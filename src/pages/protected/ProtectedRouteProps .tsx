// src/pages/protected/ProtectedRouteProps .tsx

import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import Unauthorized from "@/pages/UnauthorizedPage";
// Giả sử bạn có component LoadingSpinner

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  console.log("🚀 ~ ProtectedRoute ~ isAuthenticated:", isAuthenticated);

  return isAuthenticated ? <>{children}</> : <Unauthorized />;
};

export default ProtectedRoute;
