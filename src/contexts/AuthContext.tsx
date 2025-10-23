// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ILoginForm, IUserForm, User } from "../lib/types";
import { useMutation } from "@tanstack/react-query";
import userApi from "@/api/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: IUserForm | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (form: ILoginForm) => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isArtist: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUserForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      const token = localStorage.getItem("token");

      if (storedUser && token) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (form: ILoginForm) => {
      const res = await userApi.login(form);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      setUser(data);
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast.warning("Sai mật khẩu hoặc tài khoản");
    },
  });

  const login = (form: ILoginForm) => {
    loginMutation.mutate(form);
  };

  const register = async (name: string, email: string, password: string) => {
    console.warn("Register function not implemented yet");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    const newUser = { ...user, ...updatedUser };
    setUser(newUser as IUserForm);

    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const isAuthenticated = !!user;
  const isArtist = !!user?.user.artistId;

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        isArtist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
