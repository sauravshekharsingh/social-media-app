import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Logout from "./components/Logout";
import RestrictedRoutes from "./utils/RestrictedRoute";
import UnauthenticatedRoutes from "./utils/UnauthenticatedRoutes";
import Notifications from "./pages/Notifications";
import api from "./utils/api";
import { useState } from "react";
import { useEffect } from "react";
import { getAuthTokenFromLocalStorage } from "./utils/token";

function App() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        if(!getAuthTokenFromLocalStorage()) {
          return;
        }

        const res = await api.get("/notification", {
          headers: {
            Authorization: `Bearer ${getAuthTokenFromLocalStorage()}`,
          },
        });

        if (res.data.success) {
          setNotifications(res.data.data);
        }
      } catch (err) {
        console.log(err);
      }
    }

    fetchNotifications();
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar notifications={notifications} />
        <Routes>
          <Route element={<UnauthenticatedRoutes />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<RestrictedRoutes />}>
            <Route path="/" element={<Home />} exact />
            <Route
              path="/notifications"
              element={
                <Notifications
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              }
              exact
            />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/logout" element={<Logout />} exact />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
