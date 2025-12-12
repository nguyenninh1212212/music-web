// src/contexts/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { ILoginForm, IRegisterForm, IUserForm, User } from "../lib/types";
import { useMutation } from "@tanstack/react-query";
import userApi from "@/api/auth";
import { toast } from "sonner";

interface AuthContextType {
  user: IUserForm | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (form: ILoginForm) => void;
  googleLogin: (tokenId: string) => void;
  register: (name: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  isArtist: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUserForm | null>>;
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
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (parsedUser && parsedUser.user && parsedUser.user?.token) {
        setUser(parsedUser);
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

  const googleMutation = useMutation({
    mutationFn: async (idToken: string) => {
      const res = await userApi.googleLogin(idToken);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      window.location.href = "/";
      toast.success("Đăng nhập thành công");
    },
    onError: (error) => {
      console.error("Login thất bại", error);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (form: ILoginForm) => {
      const res = await userApi.login(form);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);
      window.location.href = "/";
    },
    onError: (error: any) => {
      console.log("🚀 ~ AuthProvider ~ error:", error);
      toast.warning(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });
  const registerMutation = useMutation({
    mutationFn: async (form: IRegisterForm) => {
      const res = await userApi.register(form);
      return res.data;
    },
    onSuccess: () => {
      toast.info("Register success");
      window.location.href = "/login";
    },
    onError: (error: any) => {
      toast.warning(
        error.response?.data?.message || "Login failed. Please try again."
      );
    },
  });

  const login = (form: ILoginForm) => {
    loginMutation.mutate(form);
  };

  const googleLogin = (tokenId: string) => {
    googleMutation.mutate(tokenId);
  };

  const register = async (name: string, username: string, password: string) => {
    registerMutation.mutateAsync({ name, password, username });
  };

  const logout = () => {
    localStorage.removeItem("user");
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
        googleLogin,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
