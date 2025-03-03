import React from "react";

import { jwtDecode } from "jwt-decode";
import { Navigate, Outlet, useLocation } from "react-router";

interface ProtectedRoutesProps {
  children?: React.ReactNode;
}


export const ProtectedRoutes: React.FC<ProtectedRoutesProps> = ({
  children,
}) => {
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  try {
    const decoded = jwtDecode(accessToken);

    if (!decoded) {
      localStorage.removeItem("accessToken");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children ? <>{children}</> : <Outlet />;
  } catch {
    localStorage.removeItem("accessToken");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export const PublicRoute: React.FC<ProtectedRoutesProps> = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    try {
      const decoded = jwtDecode(accessToken);

      if (decoded) {
        return <Navigate to="/" replace />;
      }

      localStorage.removeItem("accessToken");
    } catch {
      localStorage.removeItem("accessToken");
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoutes;
