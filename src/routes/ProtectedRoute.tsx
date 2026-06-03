import React from "react";
import { Navigate } from "react-router-dom";
import { JSX } from "react/jsx-runtime";

interface Props {
  children: JSX.Element;
  role?: string; // Rol requerido
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const parsed = JSON.parse(user);

  // API devuelve el rol así:
  //   user_role: "CLIENTES" o "ADMINISTRADOR"
  let userRole = parsed.user_role || "";

  // Normalizamos
  userRole = userRole.trim().toUpperCase();
  const requiredRole = role?.trim().toUpperCase();

  // Validación
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
