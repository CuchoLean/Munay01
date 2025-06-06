// components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const isAuthenticated = localStorage.getItem("idUsuario");
  const userGenero = localStorage.getItem("generoUsuario");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (requireAdmin && userGenero?.toUpperCase() !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
