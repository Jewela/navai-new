import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { postRequest } from '../../../../../app/httpClient/axiosClient';
import { RESPONSE_CODE, DEFAULT_VALUE, STORAGE_INDEXES, ADMIN_ROUTE_SLUGS } from '../../../../../app/constants';
import { ENUM_AVTAR } from '../../../../../app/constants/enums';
import { RESPONSE_MESSAGES } from '../../../../../app/constants/localizedStrings';
import actions, { ACTION_SERVICES } from '../../../../../redux/authenticate/actions';
import { ADMIN, } from '../../../../../app/config/endpoints'
import Toaster from '../../../../../components/UI/Toast';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    question: yup.string().required('Question is required'),
    answer: yup.string().required('Answer is required'),
    tag: yup.string().required('Tag is required'),
});

function AddInterceptQuestions(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state, parentQuestionId } = useLocation();
    const { loader, errorMessage, toast } = useSelector(state => state.auth);
    const LOCALE = DEFAULT_VALUE.LOCALE

    const { register, handleSubmit, getValues, setValue, formState: { errors }, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        const { question, answer, tag } = data;

        let payloadData = JSON.stringify({
            question: question,
            answer: `${answer}{${tag}}`,
        });

        // console.log(payloadData);
        // return false;

        try {
            dispatch(ACTION_SERVICES(actions.API_PROCESS));
            const { status, data: { httpStatusCode } } = await postRequest(ADMIN.INTERCEPT_QUESTION.ADD, payloadData);

            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                dispatch(ACTION_SERVICES(actions.PROCESS_INIT));
                dispatch({
                    type: actions.TOAST_PROCESS,
                    payload: {
                        [STORAGE_INDEXES.TOAST_STATUS]: true,
                        [STORAGE_INDEXES.TOAST_TYPE]: 'success',
                        [STORAGE_INDEXES.TOAST_MESSAGE]: RESPONSE_MESSAGES[LOCALE].SUCCESS_ADD_QUESTIONS,
                    }
                });
                reset();
                navigate(ADMIN_ROUTE_SLUGS.INTERCEPT_QUESTION);
            } else {
                dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].ERROR_ADDING_QUESTIONS));
            }
        } catch (error) {
            dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].ERROR_ADDING_QUESTIONS));
        }

        return false;
    }

    const hangleNavigation = () => {
        navigate(ADMIN_ROUTE_SLUGS.FAMILY_QUESTION);
    }

    useEffect(() => {
        if (state === null) {
            hangleNavigation();
        }
    }, []);


    return <>
        <div className="dashboard-content px-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                        <span className="h5 mb-0">Intercept question</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="col-md-12 mb-4">
                            <label>Enter Question</label>
                            <textarea {...register('question')} name='question' className='form-control' disabled={loader} />
                            {errors.question && <p className='text-error fs-1-5'>{errors.question.message}</p>}
                        </div>
                        <div className="col-md-12 mb-4">
                            <label>Enter answer</label>
                            <textarea {...register('answer')} name='answer' className='form-control' disabled={loader} />
                            {errors.answer && <p className='text-error fs-1-5'>{errors.answer.message}</p>}
                        </div>

                        <div className="col-md-2 mb-4">
                            <label>Select Tag</label>
                            <select {...register('tag')} className="form-control">
                                <option value="" ></option>
                                {Object.keys(ENUM_AVTAR.INTERCEPT_QUESTION.TAG).map((item, index) => {
                                    return <option value={ENUM_AVTAR.INTERCEPT_QUESTION.TAG[item]} key={index}>
                                        {`{${ENUM_AVTAR.INTERCEPT_QUESTION.TAG[item]}}`}
                                    </option>
                                })}
                            </select>
                            {errors.tag && <p className='text-error fs-1-5'>{errors.tag.message}</p>}
                        </div>

                        {errorMessage && <p className='text-error fs-1-5'>{errorMessage}</p>}
                        <div className="mt-4 d-flex">
                            <Button disabled={loader} onClick={() => hangleNavigation()} type="submit" className='btn primary-btn btn-xs mr-10'>
                                <FontAwesomeIcon icon={faArrowLeft} />&nbsp;Back
                            </Button>
                            <Button disabled={loader} type="submit" className='btn primary-btn btn-xs mr-10'>
                                {loader ?
                                    <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />&nbsp;<span>Saving...</span></>
                                    : 'Save'
                                }
                            </Button>
                            {/* <Button disabled={loader} type="submit" className='btn primary-btn btn-xs'>
                                {loader ?
                                    <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />&nbsp;<span>Saving...</span></>
                                    : 'Save & add more'
                                }
                            </Button> */}
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {toast?.type &&
            <Toaster
                status={toast.status}
                type={toast.type}
                message={toast.message}
            />

        }
    </>
}
export default AddInterceptQuestions;