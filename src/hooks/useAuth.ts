import { useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Constants from "../utils/constants";

const AUTH_TOKEN_KEY = Constants.TOKEN_KEY;

const useAuth = () => {
  const token = useMemo(() => {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }, []);

  const isAuthenticated = useMemo(() => {
    return !!token;
  }, [token]);

  return { isAuthenticated, token };
};

const useRequireAuth = (redirectTo = "/login") => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirectTo, { replace: true, state: { from: location } });
    }
  }, [isAuthenticated, navigate, redirectTo, location]);

  return { isAuthenticated };
};

const useRedirectIfAuthenticated = (redirectTo = "/users") => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectTo]);

  return { isAuthenticated };
};

export default useAuth;
export { useRequireAuth, useRedirectIfAuthenticated, AUTH_TOKEN_KEY };
