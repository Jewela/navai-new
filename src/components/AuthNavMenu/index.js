import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authenticate/actions";
import {
  AUTH_ROUTE_SLUGS,
  PUBLIC_ROUTES_SLUGS,
  ALLOWED_USERID,
  USER_TYPES,
} from "../../app/constants";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleUser } from "@fortawesome/free-solid-svg-icons";

function AuthNavMenu() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    userData: { profileImage, id: UserId, isBusiness: IfBusinessUser, userSubscriptionStatus = false, userType },
  } = useSelector((state) => state.auth);
  const _userType = userType.toLowerCase();
  const [isNavbarOpen, setIsNavbarOpen] = useState("collapse");

  const toggleNavbar = () => {
    setIsNavbarOpen(!isNavbarOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsNavbarOpen(!isNavbarOpen);
    navigate(PUBLIC_ROUTES_SLUGS.ROOT);
    // window.location.href = PUBLIC_ROUTES_SLUGS.ROOT;
  };

  return (
    <>
      <ul className="navbar-nav custom-menu">
        <li className="nav-item">
          <Link
            className="nav-link active"
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

      <div className="logged-user">
        <Link to="/profile">
          {profileImage && profileImage?.imageBlobUrl !== null ? (
            <img
              className="rounded-circle"
              src={profileImage?.imageBlobUrl}
              alt="profile-image"
            />
          ) : (
            <FontAwesomeIcon
              icon={faCircleUser}
              style={{ color: "#808ce3", fontSize: "1.7em" }}
            />
          )}
        </Link>
      </div>

      <button
        className={`navbar-toggler ${isNavbarOpen ? "collapsed" : "togglemenu"
          }`}
        type="button"
        onClick={toggleNavbar}
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div
        className={`navbar-collapse navbar-collapse-div profile-dropdown collapse ${isNavbarOpen ? "" : "show"
          }`}
      >
        <ul className="navbar-nav navbar-dropdown">
          <li className="nav-item">
            <Link
              to="/profile"
              onClick={toggleNavbar}
              className="nav-link active"
            >
              Profile
            </Link>
          </li>
          {IfBusinessUser && (_userType === USER_TYPES.MERCHANT || _userType === USER_TYPES.EMPLOYEE) && (
            <li className="nav-item">
              <Link
                to={AUTH_ROUTE_SLUGS.AVTAR.LIST}
                onClick={toggleNavbar}
                className="nav-link"
              >
                Admin Dashboard
              </Link>
            </li>
          )}
          {/*
            <li className="nav-item">
                <Link to={AUTH_ROUTE_SLUGS.AVTAR.FAVORITE_AVATARS} onClick={toggleNavbar} className="nav-link">Favourite Avatar</Link>
            </li> */}
          <li className="nav-item">
            {IfBusinessUser
              ? <>
                <Link onClick={toggleNavbar} to={AUTH_ROUTE_SLUGS.AVTAR.LIST} className="nav-link">
                  Avatar Subscription
                </Link>
              </>
              : <>
                {userSubscriptionStatus
                  ? <Link onClick={toggleNavbar} to={AUTH_ROUTE_SLUGS.SUBSCRIBE.SUBSCRIBED_AVATARS} className="nav-link">
                    Subscription
                  </Link>
                  : <Link onClick={toggleNavbar} to={AUTH_ROUTE_SLUGS.SUBSCRIBE.USER_SUBSCRIPTION} className="nav-link">
                    User Subscription
                  </Link>
                }
              </>
            }

          </li>
          <li className="nav-item">
            <Link onClick={handleLogout} className="nav-link">
              Logout
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
}

export default AuthNavMenu;
