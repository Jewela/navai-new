import { lazy, Suspense, Fragment } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Routes,
} from "react-router-dom";
import { AuthRoute, PublicRoute } from "./helpers.js";
import { ProtectedRoutes, PublicRoutes } from "./routes.js";
import Layout from "../container/layouts/index.js";

export function ApprRoutes({ isAuthenticated }) {
  return (
    <Router>
      <Fragment>
        <Suspense fallback={<div>Loading...</div>}>
          <Layout>
            <Routes>
              {PublicRoutes.map(
                ({ component: Component, path, exact }, index) => (
                  <Route
                    path={`${path}`}
                    key={index}
                    exact
                    element={
                      <PublicRoute isAuthenticated={isAuthenticated}>
                        <Component />
                      </PublicRoute>
                    }
                  />
                )
              )}

              {ProtectedRoutes.map(
                ({ component: Component, path, exact }, index) => (
                  <Route
                    path={`${path}`}
                    key={index}
                    exact
                    element={
                      <AuthRoute isAuthenticated={isAuthenticated}>
                        <Component />
                      </AuthRoute>
                    }
                  />
                )
              )}
            </Routes>
          </Layout>
        </Suspense>
      </Fragment>
    </Router>
  );
}
