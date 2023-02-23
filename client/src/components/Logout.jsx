import React, { useEffect } from "react";
import useAuthContext from "../hooks/useAuthContext";

function Logout() {
  const { dispatch } = useAuthContext();

  useEffect(() => {
    localStorage.clear("token");

    dispatch({ type: "LOGOUT" });
  }, [dispatch]);

  return <></>;
}

export default Logout;
