import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { refreshAccessToken } from "../service/AuthService";
import Loading from "./Loading";

function ProtectedRoute() {
  const [checking, setChecking] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    async function checkAuthentication() {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        setChecking(false);
        return;
      }

      try {
        const payload = JSON.parse(
          atob(token.split(".")[1])
        );

        // Access token is still valid
        if (!payload.exp || payload.exp * 1000 > Date.now()) {
          setAuthenticated(true);
          setChecking(false);
          return;
        }

        // Access token expired, try refresh token
        await refreshAccessToken();

        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");

        setAuthenticated(false);
      }

      setChecking(false);
    }

    checkAuthentication();
  }, []);

  if (checking) {
    return <Loading />;
  }

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;