import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const RestrictedRoutes = () => {
  const { state: user } = useAuthContext();

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default RestrictedRoutes;
