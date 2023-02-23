import { Outlet, Navigate } from "react-router-dom";
import useAuthContext from "../hooks/useAuthContext";

const UnauthenticatedRoutes = () => {
  const { state: user } = useAuthContext();

  return user ? <Navigate to="/" /> : <Outlet />;
};

export default UnauthenticatedRoutes;
