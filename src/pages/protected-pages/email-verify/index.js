import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { verifyOtp } from "../../../redux/authenticate/actions";

import './css/email-verify.css'
import { useEffect, useRef, useState } from "react";
import { AUTH_ROUTE_SLUGS } from "../../../app/constants";
function EmailVerify() {
    const navigate = useNavigate();
    const { loader, isAuthenticated, email, errorMessage } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    console.log({ loader, isAuthenticated, email, errorMessage })

    const inputRefs = Array.from({ length: 6 }, (_, index) => useRef(null));

    const [resendOtpAvail, setResendOtpAvail] = useState(errorMessage !== null ? true : false);

    // const validationSchema = yup.object().shape({
    //     input1: yup.string().required('otp is required'),
    //     input2: yup.string().required('otp is required'),
    //     input3: yup.string().required('otp is required'),
    //     input4: yup.string().required('otp is required'),
    //     input5: yup.string().required('otp is required'),
    // });

    const validationSchema = yup.object().shape({
        otp: yup
            .string()
            .test('atLeastOneNotEmpty', 'OTP fields are required.', function (value) {
                const { input1, input2, input3, input4, input5 } = this.parent;
                return input1 && input2 && input3 && input4 && input5;
            }),
    });

    const { register, setValue, getValues, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = (data) => {
        const otp = `${data.input1}${data.input2}${data.input3}${data.input4}${data.input5}`
        dispatch(verifyOtp(otp));
    };

    const sendOtp = () => {
        //    console.log("ldfjlsdf");
    };

    const handleInputChange = (e, index) => {
        const value = e.target.value;
        setValue(`input${index}`, value);
        if (value && index < inputRefs.length - 1) {
            inputRefs[index + 1].current.focus();
        }
        return;
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && index > 0 && !e.target.value) {
            inputRefs[index - 1].current.focus();
        }
    };


    if (!isAuthenticated) {
        navigate('/');
    }


    useEffect(() => {
        navigate(AUTH_ROUTE_SLUGS.PROFILE)
    })

    return <>
        <svg width="600" height="600" viewBox="0 0 1500 1500" className="filter-svg">
            <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
        </svg>
        <section className="verify-account spacer-lg">
            <div className="container">
                <div className="row justify-content-center align-items-center">
                    <div className="col-md-5">
                        <h2 className="h1 fw-bold">Email Verification</h2>
                        <p className="paragraph-lg">We have sent you a one time password on this email</p>
                        <span className="fw-bold h5">{email}</span>
                        <form className="otp" onSubmit={handleSubmit(onSubmit)}>
                            <div className="otp__wrap">
                                <input
                                    {...register('input1')}
                                    // name="input1"
                                    className="otp"
                                    type="text"
                                    maxLength="1"
                                    onChange={(e) => handleInputChange(e, 1)}
                                    onKeyDown={(e) => handleKeyDown(e, 1)}
                                    ref={inputRefs[1]}
                                />
                                <input
                                    {...register('input2')}
                                    // name="input2"
                                    className="otp"
                                    type="text"
                                    maxLength="1"
                                    onChange={(e) => handleInputChange(e, 2)}
                                    onKeyDown={(e) => handleKeyDown(e, 2)}
                                    ref={inputRefs[2]}
                                />
                                <input
                                    {...register('input3')}
                                    // name="input3"
                                    className="otp"
                                    type="text"
                                    maxLength="1"
                                    onChange={(e) => handleInputChange(e, 3)}
                                    onKeyDown={(e) => handleKeyDown(e, 3)}
                                    ref={inputRefs[3]}
                                />
                                <input
                                    {...register('input4')}
                                    // name="input4"
                                    className="otp"
                                    type="text"
                                    maxLength="1"
                                    onChange={(e) => handleInputChange(e, 4)}
                                    onKeyDown={(e) => handleKeyDown(e, 4)}
                                    ref={inputRefs[4]}
                                />
                                <input
                                    {...register('input5')}
                                    // name="input5"
                                    className="otp"
                                    type="text"
                                    maxLength="1"
                                    onChange={(e) => handleInputChange(e, 5)}
                                    onKeyDown={(e) => handleKeyDown(e, 5)}
                                    ref={inputRefs[5]}
                                />
                            </div>
                            {errors.otp && <p className="text-danger">{errors.otp.message}</p>}
                            {errorMessage ? <p className='error-message text-danger my-1'>{errorMessage}</p> : ''}
                            {/* {
                                resendOtpAvail ? <p className="resend-otp">
                                    Do not receive OTP?
                                    <span className="send-otp btn-xs primary-btn csr-pointer" onClick={sendOtp}>Send OTP</span>
                                </p> : ''
                            } */}

                            <button type="submit" disabled={loader} className="btn primary-btn">
                                {loader ? 'Please Wait...' : 'verify'}
                            </button>
                        </form>
                    </div>
                    <div className="col-md-5">
                        <img src="images/cartoon-sm.png" alt="verify otp" className="w-100" />
                    </div>
                </div>
            </div>
        </section>
    </>
}
export default EmailVerify;