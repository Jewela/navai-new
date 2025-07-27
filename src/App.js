import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import AppRoutes from "./routes";
import { Toaster } from "react-hot-toast";

const App = () => {
  const { isAuthenticated, emailVerified } = useSelector((state) => state.auth);
  // const dispatch = useDispatch();

  return (
    <>
      <BrowserRouter>
        <AppRoutes
          isAuthenticated={isAuthenticated}
          emailVerified={emailVerified}
        />
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
export default App;
// jewelanwar@gmail.com

// Admin@123$
