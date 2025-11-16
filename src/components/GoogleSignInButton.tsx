// GoogleSignInButton.tsx
import userApi from "@/api/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

declare global {
  interface Window {
    google: any;
  }
}

interface Props {
  clientId: string;
}

export const GoogleSignInButton: React.FC<Props> = ({ clientId }) => {
  const navigate = useNavigate();
  const { googleLogin } = useAuth();

  clientId =
    "733005429472-ttuifiuq5t9kehav5t7baepmv374vca1.apps.googleusercontent.com";
  useEffect(() => {
    if (!window.google) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredentialResponse,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("google-signin")!,
      { theme: "outline", size: "large" }
    );
  }, [clientId]);

  async function handleCredentialResponse(response: any) {
    // response.credential là ID token (JWT)
    const idToken = response.credential;
    // gửi lên backend
    googleLogin(idToken);
    // lưu access token/JWT do backend trả về (ví dụ trong httpOnly cookie hoặc localStorage tuỳ chiến lược)
  }

  return <div id="google-signin"></div>;
};
