
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import actions, { login } from '../../../../redux/authenticate/actions';
import { useNavigate } from 'react-router-dom';

import { AVTAR, USER_STATIC_TYPE_ID } from '../../../../app/config/endpoints';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PROTECTED_ROUTE_SLUGS } from '../../../../app/constants';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import ForgotPasswordForm from './ForgotPasswordForm';

function LoginModal(props) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loader, emailVerified, errorMessage } = useSelector(state => state.auth);
    const [isVisible, setVisible] = useState(false);
    const [emailReadOnly, setEmailReadOnly] = useState(false);

    const toggle = () => {
        setVisible(!isVisible);
    };
    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid email address').required('Email is required'),
        password: yup.string().required('Password is required'),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const handleNavigation = () => {
        return false;
        // navigate(PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY);
    }

    const onSubmit = (data) => {
        dispatch(login(
            data.email,
            data.password,
            USER_STATIC_TYPE_ID,
            handleNavigation,
            false,
        ));
    }

    const handleGoogleLoginWindow = (event) => {
        event.preventDefault();
        window.open(AVTAR.GOOGLE_LOGIN, "_self");
        props.onHide();
    }

    /* forgot password */
    const [show, setShow] = useState(false);

    const handleClose = () => {
        setShow(false);
        setEmailReadOnly(false)
    }
    const handleShow = () => setShow(true);

    return <>
        {show
            ? <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false} centered
            >
                <Modal.Header closeButton>
                    <Modal.Title> {emailReadOnly ? 'Reset' : 'Forgot'} Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ForgotPasswordForm
                        emailReadOnly={emailReadOnly}
                        setEmailReadOnly={setEmailReadOnly}
                        FnHandleClose={handleClose}
                    />
                </Modal.Body>
            </Modal>
            :
            <div className="form-wrapper">
                <div className="login-form-wrapper">
                    <form id="login_form" method="post" onSubmit={handleSubmit(onSubmit)}>
                        <div className="form__fields mb-3">
                            <label>Email</label>
                            <input {...register('email')} type="email" name="email" id="label-email" className="add-customer-input form-control" placeholder="Email address" />
                            {errors.email && <p className='error-message'>{errors.email.message}</p>}
                        </div>
                        <div className="form__fields mb-3">
                            <label>Password</label>
                            <div className='p-relattive'>
                                <input
                                    {...register('password')}
                                    type={!isVisible ? "password" : "text"}

                                    name="password"
                                    id="input-password"
                                    className="add-customer-input form-control"
                                    placeholder="Password"
                                />
                                <span className="csr-pointer passtoggle" onClick={toggle}>
                                    {isVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                </span>
                            </div>
                            {errors.password && <p className='error-message'>{errors.password.message}</p>}
                        </div>
                        <div className='mb-3 text-end'><span role='button' onClick={handleShow}>Forgot Password</span></div>
                        <div className="form__fields site mb-3">
                            {errorMessage && <p className='error-message'>{errorMessage}</p>}
                        </div>

                        <div className="form__fields mb-3">
                            <input type="hidden" name="action" />
                            <button disabled={loader} id="login_form_btn" className="btn primary-btn w-100">
                                {loader ? 'Please Wait...' : 'Log In'}
                            </button>
                            <div className='text-center login-seprator'><span>OR</span></div>
                            <div className="google-login">
                                {/* <SigninWithGoogleButton /> */}
                                <img role='button' onClick={(event) => handleGoogleLoginWindow(event)} src='/images/google-icon/continue-with-google.png'
                                />
                            </div>
                        </div>
                        <div className="form__fields text-center">
                            <p>Don't have account? <a href="#" onClick={() => props.onFormChange(0)} id="signup-link">Sign Up</a></p>
                        </div>
                    </form>
                </div>
            </div>
        }
    </>
}
export default LoginModal;
// export const SigninWithGoogleButton = () => {
//     return (<button className="gsi-material-button" >
//         <div className="gsi-material-button-state"></div>
//         <div className="gsi-material-button-content-wrapper">
//             <div className="gsi-material-button-icon">
//                 <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" style="display: block;">
//                     <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
//                     <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
//                     <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
//                     <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
//                     <path fill="none" d="M0 0h48v48H0z"></path>
//                 </svg>
//             </div>
//             <span className="gsi-material-button-contents">Sign in with Google</span>
//             <span style="display: none;">Sign in with Google</span>
//         </div>
//     </button>);
// }