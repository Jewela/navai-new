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
import { ADMIM, } from '../../../../../app/config/endpoints'
import Toaster from '../../../../../components/UI/Toast';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    question: yup.string().required('Question is required'),
    repetition: yup.string().required('This field is required'),
    belongTo: yup.string().required('This field is required'),
});

function AddFamilyQuestion(props) {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { state, parentQuestionId } = useLocation();
    const { loader, errorMessage, toast } = useSelector(state => state.auth);
    const LOCALE = DEFAULT_VALUE.LOCALE

    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data) => {
        const { question, repetition, belongTo } = data;

        let payloadData = JSON.stringify({
            questionRepetition: repetition,
            question: question,
            parentQuestionId: state.parentQuestionId,
            storyQuestionBelongTo: belongTo,
        });

        // console.log(payloadData);
        // return false;

        try {
            dispatch(ACTION_SERVICES(actions.API_PROCESS));
            const { status, data: { httpStatusCode, friendyMessageList } } = await postRequest(ADMIM.STORY_QUESTION.ADD, payloadData);

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
                navigate(ADMIN_ROUTE_SLUGS.STORY_QUESTION);
            } else {
                dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].ERROR_ADDING_QUESTIONS));
            }
        } catch (error) {
            dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, RESPONSE_MESSAGES[LOCALE].ERROR_ADDING_QUESTIONS));
        }

        return false;
    }
    const hangleNavigation = () => {
        navigate(ADMIN_ROUTE_SLUGS.STORY_QUESTION);
    }

    useEffect(() => {
        console.log("hreeree===>")
        if (state === null) {
            hangleNavigation();
        }
    }, []);


    return <>
        <div className="dashboard-content px-4">
            <div className="row">
                <div className="col-md-12">
                    <div className="w-100 d-flex justify-content-between align-items-center mb-4">
                        <span className="h5 mb-0">Story Parent Questions</span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <div className="col-md-12 mb-4">
                            <label>Enter Question</label>
                            <textarea {...register('question')} name='question' className='form-control' disabled={loader} />
                            {errors.question && <p className='text-error fs-1-5'>{errors.question.message}</p>}
                        </div>

                        <div className="col-md-2 mb-4">
                            <label>Question repetition</label>
                            <select {...register('repetition')} className="form-control">
                                <option value="" ></option>
                                {Object.keys(ENUM_AVTAR.STORY_QUESTION.REPETITION).map((item, index) => {
                                    return <option value={ENUM_AVTAR.STORY_QUESTION.REPETITION[item]} key={index}>{item.replace('_', ' ')}</option>
                                })}
                            </select>
                            {errors.repetition && <p className='text-error fs-1-5'>{errors.repetition.message}</p>}
                        </div>

                        <div className="col-md-2 mb-4">
                            <label>Question belongs to</label>
                            <select {...register('belongTo')} className="form-control">
                                <option value="" ></option>
                                {Object.keys(ENUM_AVTAR.STORY_QUESTION.BELONGS_TO).map((item, index) => {
                                    return <option value={ENUM_AVTAR.STORY_QUESTION.BELONGS_TO[item]} key={index}>{item.replaceAll('_', ' ')}</option>
                                })}
                            </select>
                            {errors.belongTo && <p className='text-error fs-1-5'>{errors.belongTo.message}</p>}
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
export default AddFamilyQuestion;