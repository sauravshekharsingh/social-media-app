import { createContext, useEffect, useReducer } from "react";
import jwt from "jwt-decode";

const initialState = null;

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");

    try {
      const user = jwt(token);

      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (err) {
      localStorage.clear("token");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
