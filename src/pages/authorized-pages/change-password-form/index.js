import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';;

import { getRequest, postRequest, putRequest } from '../../../app/httpClient/axiosClient';
import { AUTH, GENERAL } from '../../../app/config/endpoints';
import { getErrorMessage } from '../../../utils/helpers/apiErrorResponse';
import { RESPONSE_MESSAGES } from '../../../app/constants/localizedStrings';
import toast from 'react-hot-toast';
import { DEFAULT_VALUE, RESPONSE_CODE } from '../../../app/constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const validationSchema = yup.object().shape({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup.string().required('New password is required'),
});

function ChangePasswordForm(props) {
    const { changePasswordStatus, setChangePasswordStatus } = props;
    const [loader, setLoader] = useState(false);
    const [isVisible, setVisible] = useState(false);
    const [isNewPassVisible, setNewPassVisible] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema)
    });

    const onSubmit = async (formData) => {
        console.log(formData);

        try {
            setLoader(true);
            const { status: OldHashPasswordStatus, HashPassword: OldHashPassword } = await GenerateHashPassword(formData.oldPassword);
            if (!OldHashPasswordStatus) {
                toast.error(`Getting error while generating hash password. Please try again.`);
                setLoader(false);
                return false;
            }

            const { status: NewHashPasswordStatus, HashPassword: NewHashPassword } = await GenerateHashPassword(formData.newPassword);
            if (!NewHashPasswordStatus) {
                toast.error(`Getting error while generating hash password. Please try again.`);
                setLoader(false);
                return false;
            }
            console.log({ OldHashPassword, NewHashPassword })

            const payload = {
                "password": NewHashPassword,
                "oldPassword": OldHashPassword,
            }
            const response = await postRequest(AUTH.UPDATE_PASSWORD, payload);
            const { status: statusCode, data: { data } } = response;
            if (statusCode === RESPONSE_CODE[200]) {
                toast.success(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].RESET_PASS_SUCCESS);
                setChangePasswordStatus();
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "instant",
                });
            }

        } catch (error) {
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage);
            setLoader(false);
        }

    }

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

    const toggle = () => {
        setVisible(!isVisible);
    };

    const NewPassToggle = () => {
        setNewPassVisible(!isNewPassVisible);
    };

    const handleCancel = () => {
        setChangePasswordStatus((prevState) => !prevState);
    }

    return (<>
        <form id="update_pass_form" method="post" onSubmit={handleSubmit(onSubmit)}>
            <div className="form__fields mb-3">
                <label>Old password</label>
                <div className='p-relattive'>
                    <input
                        {...register("oldPassword")}
                        readOnly={loader}
                        type={!isVisible ? "password" : "text"}
                        placeholder="Old password"
                        className={`form-control ${loader ? "readonly" : ""}`}
                    />
                    <span className="csr-pointer passtoggle" onClick={toggle}>
                        {isVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    </span>
                    {errors.oldPassword && !loader && (
                        <p className="text-error">{errors.oldPassword.message}</p>
                    )}
                </div>
            </div>
            <div className="form__fields mb-3">
                <label>New password</label>
                <div className='p-relattive'>
                    <input
                        {...register("newPassword")}
                        readOnly={loader}
                        type={!isNewPassVisible ? "password" : "text"}
                        placeholder="New password"
                        className={`form-control ${loader ? "readonly" : ""}`}
                    />
                    <span className="csr-pointer passtoggle" onClick={NewPassToggle}>
                        {isNewPassVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                    </span>
                    {errors.newPassword && !loader && (
                        <p className="text-error">{errors.newPassword.message}</p>
                    )}
                </div>
            </div>
            <div className="form__fields">
                <div className="button-group">
                    <button
                        disabled={loader}
                        type="submit"
                        className="btn primary-btn"
                    >
                        Sav{!loader && "e"}
                        {loader && (
                            <>
                                <span>ing&nbsp;</span>
                                <span
                                    className="spinner-border spinner-border-sm"
                                    role="status"
                                />
                            </>
                        )}
                    </button>
                    <button
                        type="button"
                        onClick={() => handleCancel()}
                        className="btn primary-btn"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </form>
    </>)
}

export default ChangePasswordForm