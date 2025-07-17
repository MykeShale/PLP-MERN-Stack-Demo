import React from "react"
import { Navigate } from "react-router-dom";
import useLoginStore from "../../store/login.store";

const ProtectedRoute = ({ children }) => {
  const login = useLoginStore((state) => state.login);

  if (!login) {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;
