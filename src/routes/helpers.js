import { Navigate } from "react-router-dom";
// import { PROTECTED_ROUTE_SLUGS } from "../app/constants";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import actions from "../redux/authenticate/actions";

export function AuthRouteHelper({ children, isAuthenticated, ...rest }) {
  return isAuthenticated ? children : <Navigate to="/" />;
}

export function AdminAuthRoutHelper({ children, isAuthenticated, ...rest }) {
  return isAuthenticated ? children : <AdminLoginPage />;
}

export function ProtectedRouteHelper({ children, isAuthenticated, ...rest }) {
  if (!rest.emailVerified) {
    return children;
  }
  return !isAuthenticated ? children : <Navigate to="/avtar" />;
}

const AdminLoginPage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: actions.OPEN_BUSINESS_AUTH_MODAL,
    });
    console.log("open auth modal");
  }, []);

  return <div style={{ height: "70vh" }}></div>;
};
