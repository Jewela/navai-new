import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AuthModal from "../../../components/UI/Modal/Auth";
import BusinessAuthModal from "../../../components/UI/Modal/BusinessAuth/BusinessAuth";
import AuthNavMenu from "../../../components/AuthNavMenu";
import actions from "../../../redux/authenticate/actions";
import { PUBLIC_ROUTES_SLUGS } from "../../../app/constants";
import UserSubscriptionDialog from "../../../components/UI/Modal/UserSubscriptionDialog";

function NavBar() {
  const {
    emailVerified,
    isAuthenticated,
    openAuthModal,
    openBusinessAuthModal,
    openSubscriptioinModal,
    preventClose = false,
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch({ type: actions.CLOSE_AUTH_MODAL });
    dispatch({ type: actions.CLOSE_BUSINESS_AUTH_MODAL });
  };

  const handleShow = () => dispatch({ type: actions.OPEN_AUTH_MODAL });
  const handleBusinessModalShow = () =>
    dispatch({ type: actions.OPEN_BUSINESS_AUTH_MODAL });

  return (
    <>
      {isAuthenticated ? (
        <AuthNavMenu />
      ) : (
        <>
          <div className="collapse navbar-collapse show" id="navbarNav">
            <ul className="navbar-nav ms-auto pointer-effect">
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={PUBLIC_ROUTES_SLUGS.ROOT}
                  aria-current="page"
                >
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={PUBLIC_ROUTES_SLUGS.PRODUCTS}
                  aria-current="page"
                >
                  Products
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={PUBLIC_ROUTES_SLUGS.ABOUT_US}
                  aria-current="page"
                >
                  About Us
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link"
                  to={PUBLIC_ROUTES_SLUGS.CONTACT_US}
                  aria-current="page"
                >
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
          <AuthModal
            show={openAuthModal ? true : false}
            preventClose={preventClose}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          />
          <BusinessAuthModal
            show={openBusinessAuthModal ? true : false}
            preventClose={preventClose}
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
          />
          <Button
            variant="btn primary-btn ms-5 account-btn"
            onClick={handleShow}
          >
            Login or Signup
          </Button>
          {/* <Button
            variant="btn primary-btn ms-5 account-btn"
            onClick={handleBusinessModalShow}
          >
            Business Login or Signup
          </Button> */}
        </>
      )}
      <UserSubscriptionDialog
        show={openSubscriptioinModal ? true : false}
        preventClose={preventClose}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      />
    </>
  );
}

export default NavBar;
