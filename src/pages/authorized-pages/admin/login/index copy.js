import { useState, useEffect, useMemo, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

import actions, { ACTION_SERVICES, login } from '../../../../redux/authenticate/actions';
import { DEFAULT_VALUE, RESPONSE_CODE } from '../../../../app/constants';

import { ADMIN_STATIC_TYPE_ID, AUTH } from '../../../../app/config/endpoints'
import { getErrorMessage } from '../../../../utils/helpers/apiErrorResponse';
import { RESPONSE_MESSAGES } from '../../../../app/constants/localizedStrings';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';


function AdminLogin() {

    const dispatch = useDispatch();
    const { loader, errorMessage } = useSelector(state => state.auth);

    const [isVisible, setVisible] = useState(false);

    const toggle = () => {
        setVisible(!isVisible);
    };

    const validationSchema = useMemo(() => yup.object().shape({
        email: yup.string().email().required('Email is required'),
        password: yup.string().required('Password is required'),
    }), []);

    const { register, handleSubmit, formState: { errors }, setValue, setError, trigger } = useForm({
        mode: 'all',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });


    const onSubmit = async (data) => {
        dispatch(login(
            data.email,
            data.password,
            ADMIN_STATIC_TYPE_ID
        ));
    }

    return <>
        <section className="admin-login spacer-lg">
            <svg width="1050" height="1050" viewBox="0 0 1500 1500" className="filter-svg">
                <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
            </svg>

            <div className="container">
                <div className="row">
                    <div className="col-md-7 mx-auto">
                        <div className="box-wrap">
                            <div className="box-body">
                                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                    <div className="row">
                                        <div className="col-md-12 text-center mb-4">
                                            <img src="images/logo.png" alt="logo" className="mb-4" />
                                            <div className="h2">Welcome to AfterlifeAI</div>
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="admin-email">Email</label>
                                            <input
                                                {...register('email')}
                                                type="text" id="admin-email" name="email" placeholder="Enter email" className="form-control" />
                                            {errors.email && <p className='text-error'>{errors.email.message}</p>}
                                        </div>

                                        <div className="col-md-12 mb-2 p-relattive form__fields">
                                            <label htmlFor="admin-pass">Password</label>
                                            <input
                                                {...register('password')}
                                                type={!isVisible ? "password" : "text"}
                                                id="admin-pass" name="password" placeholder="Enter password" className="add-customer-input form-control" />
                                            <span className="csr-pointer admin_passtoggle" onClick={toggle}>
                                                {isVisible ? <FontAwesomeIcon icon={faEye} /> : <FontAwesomeIcon icon={faEyeSlash} />}
                                            </span>
                                            {errors.password && <p className='text-error'>{errors.password.message}</p>}
                                        </div>
                                        {errorMessage &&
                                            <div className="col-md-12">
                                                <p className="text-error">{errorMessage}</p>
                                            </div>
                                        }
                                        <div className="col-md-12 mt-2">
                                            <button
                                                variant="primary"
                                                disabled={loader}
                                                type='submit' className="btn primary-btn"
                                            >
                                                {loader
                                                    ? <>
                                                        <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />&nbsp;<span>Loading...</span>
                                                    </>
                                                    : 'Login'
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </>
}

export default AdminLogin;