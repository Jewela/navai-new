import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, { login } from "../../../../redux/authenticate/actions";
import { useNavigate } from "react-router-dom";

import { AVTAR, USER_STATIC_TYPE_ID } from "../../../../app/config/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import Modal from "react-bootstrap/Modal";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  AUTH_ROUTE_SLUGS,
  PROTECTED_ROUTE_SLUGS,
} from "../../../../app/constants";
import ForgotBusinessPasswordForm from "./ForgotBusinessPasswordForm";

function LoginModal(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, emailVerified, errorMessage } = useSelector(
    (state) => state.auth
  );
  const [isVisible, setVisible] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [emailReadOnly, setEmailReadOnly] = useState(false);

  const toggle = () => {
    setVisible(!isVisible);
  };
  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
    // user: yup.string().required("User is required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const handleNavigation = () => {
    navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
  };

  const handleClose = () => {
    setShowForgotPassword();
    setEmailReadOnly(false);
  };

  const onSubmit = (data) => {
    dispatch(
      login(
        data.email,
        data.password,
        USER_STATIC_TYPE_ID,
        handleNavigation,
        true
      )
    );
  };

  const handleGoogleLoginWindow = (event) => {
    event.preventDefault();
    window.open(AVTAR.GOOGLE_LOGIN, "_self");
    props.onHide();
  };

  return (
    <>
      {showForgotPassword ? (
        <Modal
          show={showForgotPassword}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {" "}
              {emailReadOnly ? "Reset" : "Forgot"} Business Password
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ForgotBusinessPasswordForm
              emailReadOnly={emailReadOnly}
              setEmailReadOnly={setEmailReadOnly}
              FnHandleClose={handleClose}
            />
          </Modal.Body>
        </Modal>
      ) : (
        <div className="form-wrapper">
          <div className="login-form-wrapper">
            <form
              id="login_form"
              method="post"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="form__fields mb-3">
                <label>Email</label>
                <input
                  {...register("email")}
                  type="email"
                  name="email"
                  id="label-email"
                  className="add-customer-input form-control"
                  placeholder="Email address"
                />
                {errors.email && (
                  <p className="error-message">{errors.email.message}</p>
                )}
              </div>
              <div className="form__fields mb-3">
                <label>Password</label>
                <div className="p-relattive">
                  <input
                    {...register("password")}
                    type={!isVisible ? "password" : "text"}
                    name="password"
                    id="input-password"
                    className="add-customer-input form-control"
                    placeholder="Password"
                  />
                  <span className="csr-pointer passtoggle" onClick={toggle}>
                    {isVisible ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faEyeSlash} />
                    )}
                  </span>
                </div>
                {errors.password && (
                  <p className="error-message">{errors.password.message}</p>
                )}
              </div>

              <div className="form__fields site mb-3">
                {errorMessage && (
                  <p className="error-message">{errorMessage}</p>
                )}
              </div>

              <div className="mb-3 text-end">
                <span role="button" onClick={() => setShowForgotPassword(true)}>
                  Forgot Password
                </span>
              </div>

              <div className="form__fields mb-3">
                <input type="hidden" name="action" />
                <button
                  disabled={loader}
                  id="login_form_btn"
                  className="btn primary-btn w-100"
                >
                  {loader ? "Please Wait..." : "Log In"}
                </button>
                <div className="text-center login-seprator">
                  <span>OR</span>
                </div>
                <div className="google-login">
                  <img
                    role="button"
                    onClick={(event) => handleGoogleLoginWindow(event)}
                    src="/images/google-icon/continue-with-google.png"
                  />
                </div>
              </div>
              <div className="form__fields text-center">
                <p>
                  Don't have account?{" "}
                  <a
                    href="#"
                    onClick={() => props.onFormChange(0)}
                    id="signup-link"
                  >
                    Sign Up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default LoginModal;
