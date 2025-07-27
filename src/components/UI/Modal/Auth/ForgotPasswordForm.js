import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { getRequest, postRequest, putRequest } from '../../../../app/httpClient/axiosClient';
import { AUTH, GENERAL } from '../../../../app/config/endpoints';
import { getErrorMessage } from '../../../../utils/helpers/apiErrorResponse';
import { RESPONSE_MESSAGES } from '../../../../app/constants/localizedStrings';
import toast from 'react-hot-toast';
import { DEFAULT_VALUE, RESPONSE_CODE } from '../../../../app/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function ForgotPasswordForm(props) {
    const { emailReadOnly, setEmailReadOnly, FnHandleClose } = props;
    const [loader, setLoader] = useState(false);
    const [isVisible, setVisible] = useState(false);

    const toggle = () => {
        setVisible(!isVisible);
    };
    const validationSchema = yup.object().shape({
        email: yup.string().email('Invalid email address').required('Email is required'),
        new_password: yup.string().when('email', (email, schema) => {
            return emailReadOnly ? schema.required('Please enter new password') : schema.notRequired();
        }),
        otp: yup.string().when('email', (email, schema) => {
            return emailReadOnly ? schema.required('Please enter one time pin') : schema.notRequired();
        }),
    });

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const GenerateHashPassword = async (password) => {
        const NullResponse = { status: false, HashPassword: null };
        try {
            const response = await postRequest(`${AUTH.GENERATE_HASHCODE}?password=${password}`, null);
            const { status, data } = response;
            console.log("pass: ", data)
            if (status === RESPONSE_CODE[200]) {
                return {
                    status: true,
                    HashPassword: data
                }
            }
            return NullResponse;
        } catch (error) {
            return NullResponse
        }
    }
    const onSubmit = async (formData) => {
        try {
            setLoader(true);
            if (emailReadOnly) {
                const { status: HashPasswordStatus, HashPassword } = await GenerateHashPassword(formData.new_password);
                if (!HashPasswordStatus) {
                    toast.error(`Getting error while generating hash password. Please try again.`);
                    setLoader(false);
                    return false;
                }
                const payload = {
                    "email": formData.email,
                    "password": HashPassword,
                    "verificationCode": formData.otp,
                }
                const response = await postRequest(AUTH.RESET_FORGOT_PASSWORD, payload);
                const { status: statusCode, data: { data } } = response;
                if (statusCode === RESPONSE_CODE[200]) {
                    setEmailReadOnly(false);
                    toast.success(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].RESET_PASS_SUCCESS);
                    FnHandleClose();
                }

            } else {
                const response = await getRequest(AUTH.FORGOT_PASSWORD.replace('{EMAIL}', formData.email));
                const { status: statusCode, data: { data } } = response;
                if (statusCode === RESPONSE_CODE[200]) {
                    setEmailReadOnly(true);
                }
            }
            setLoader(false);
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            setLoader(false);
        }
    }

    return (
        <form id="forgot_form" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="form__fields mb-3">
                <label>Email</label>
                <input
                    {...register('email')}
                    type="email"
                    id="label-email"
                    className="add-customer-input form-control"
                    placeholder="Email address"
                    readOnly={loader || emailReadOnly ? true : false}
                />
                {errors.email && <p className='error-message'>{errors.email.message}</p>}
            </div>
            {emailReadOnly && <>
                <div className="form__fields mb-3">
                    <label>New Password</label>
                    <div className='p-relattive'>
                        <input
                            {...register('new_password')}
                            type={!isVisible ? "password" : "text"}
                            className="add-customer-input form-control"
                            placeholder="Enter new password"
                            readOnly={loader}
                        />
                        <span className="csr-pointer passtoggle" onClick={toggle}>
                            {isVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                        </span>
                        {errors.new_password && <p className='error-message'>{errors.new_password.message}</p>}
                    </div>
                </div>
                <div className="form__fields mb-3">
                    <label>One Time Pin</label>
                    <input
                        {...register('otp')}
                        type="text"
                        className="add-customer-input form-control"
                        placeholder="Email one time pin"
                        readOnly={loader}
                    />
                    {errors.otp && <p className='error-message'>{errors.otp.message}</p>}
                </div>
            </>}
            <div className="form__fields mb-3">
                <button disabled={loader} id="forgotn_form_btn" className="btn primary-btn w-100">
                    {loader ? 'Please Wait...' : 'Submit'}
                </button>
            </div>
        </form>
    )
}
export default ForgotPasswordForm