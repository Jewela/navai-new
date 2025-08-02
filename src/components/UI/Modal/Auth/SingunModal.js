import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signup } from "../../../../redux/authenticate/actions";
import actions from "../../../../redux/authenticate/actions";
import { USER_STATIC_TYPE_ID } from "../../../../app/config/endpoints";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  AUTH_ROUTE_SLUGS,
  PROTECTED_ROUTE_SLUGS,
  PUBLIC_ROUTES_SLUGS,
} from "../../../../app/constants";

function SingunModal(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loader, emailVerified, errorMessage } = useSelector(
    (state) => state.auth
  );

  const [isPassVisible, setVisible] = useState(false);
  const [isConfirmPassVisible, setConfirmPassVisible] = useState(false);

  const toggle = () => {
    setVisible(!isPassVisible);
  };
  const confirmPassToggle = () => {
    setConfirmPassVisible(!isConfirmPassVisible);
  };

  const validationSchema = yup.object().shape({
    // firstName: yup.string().required('First name is required'),
    // lastName: yup.string().required('Last name is required'),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
    terms: yup
      .boolean()
      .oneOf([true], "You must accept the terms and conditions"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  function handleNavigation() {
    navigate(PUBLIC_ROUTES_SLUGS.ROOT);
  }

  const onSubmit = (data) => {
    dispatch(
      signup(
        data.firstName,
        data.lastName,
        data.email,
        data.password,
        data.terms,
        USER_STATIC_TYPE_ID,
        false,
        handleNavigation
      )
    );
  };

  return (
    <>
      <div className="form-wrapper">
        <div className="signup-form-wrapper">
          <form id="signup_main_form" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              {/* <div className="col-md-6">
                            <div className="form__fields mb-3">
                                <label>First name</label>
                                <input {...register('firstName')} name='firstName' type="text" id="input-name" className="add-customer-input form-control" placeholder="First name" />
                                {errors.firstName && <p className='error-message'>{errors.firstName.message}</p>}

                            </div> 
                        </div> 

                        <div className="col-md-6">
                            <div className="form__fields mb-3">
                            <label>Last name</label>
                            <input type="text"  {...register('lastName')} name='lastName' id="input-last-name" className="add-customer-input form-control" placeholder="Last name" />
                            {errors.lastName && <p className='error-message'>{errors.lastName.message}</p>}
                            </div>
                        </div>    */}

              <div className="col-md-12">
                <div className="form__fields mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    {...register("email")}
                    name="email"
                    id="input-email"
                    className="add-customer-input form-control"
                    placeholder="Email address"
                  />
                  {errors.email && (
                    <p className="error-message">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="form__field">
                    <label>Password</label>
                    <div className="p-relattive">
                      <input
                        type={!isPassVisible ? "password" : "text"}
                        name="password"
                        id="input-password"
                        className="add-customer-input form-control"
                        placeholder="Enter password"
                        {...register("password")}
                      />
                      <span className="csr-pointer passtoggle" onClick={toggle}>
                        {isPassVisible ? (
                          <FontAwesomeIcon icon={faEye} />
                        ) : (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form__fields">
                    <label>Confirm password</label>
                    <div className=" p-relattive">
                      <input
                        type={!isConfirmPassVisible ? "password" : "text"}
                        name="confirm-password"
                        id="input-confirm-password"
                        className="add-customer-input form-control"
                        placeholder="Confirm password"
                        {...register("confirmPassword")}
                      />
                      <span
                        className="csr-pointer passtoggle"
                        onClick={confirmPassToggle}
                      >
                        {isConfirmPassVisible ? (
                          <FontAwesomeIcon icon={faEye} />
                        ) : (
                          <FontAwesomeIcon icon={faEyeSlash} />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-12">
                {errors.password && (
                  <p className="error-message mb-0">
                    {errors.password.message}
                  </p>
                )}
                {errors.confirmPassword && (
                  <p className="error-message mb-0">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="col-md-12 mt-3">
                <div className="form__fields site mb-3">
                  <input
                    type="checkbox"
                    id="input-terms-condition"
                    className="add-customer-input"
                    name="accept"
                    {...register("terms")}
                  />{" "}
                  Accept Terms &amp; Conditions for guest
                  {errors.terms && (
                    <p className="error-message">{errors.terms.message}</p>
                  )}
                </div>
                <div className="form__fields site mb-3">
                  {errorMessage && (
                    <p className="error-message">{errorMessage}</p>
                  )}
                </div>
              </div>

              <div className="col-md-12">
                <div className="form__fields mb-3">
                  <button
                    disabled={loader}
                    id="signup-btn"
                    className="btn primary-btn w-100"
                  >
                    {loader ? "Please Wait..." : "SignUp"}
                  </button>
                </div>
                <div className="form__fields text-center">
                  <p>
                    Already account{" "}
                    <a
                      href="#"
                      id="login-link"
                      onClick={() => props.onFormChange(1)}
                    >
                      Login
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
export default SingunModal;
