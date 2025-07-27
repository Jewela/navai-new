import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

import { postRequest } from '../../../../app/httpClient/axiosClient';
import actions from '../../../../redux/authenticate/actions';
import { RESPONSE_CODE, DEFAULT_VALUE, STORAGE_INDEXES } from '../../../../app/constants';
import { RESPONSE_MESSAGES } from '../../../../app/constants/localizedStrings';
import { ADMIM } from '../../../../app/config/endpoints'

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const validationSchema = yup.object().shape({
    question: yup.string().required('Question is required')
});

function AvatarQuestionModal(props) {

    const dispatch = useDispatch();
    const [apiProcess, setApiProcess] = useState({});
    const { isLoading, errorMessage, successMessage } = apiProcess;

    const LOCALE = DEFAULT_VALUE.LOCALE

    const { setModalShow, getFamilyQuestions, questionEndpoint, questionType, questionDetail: {
        childQuestionCount,
        hasChildQuestion,
        id,
        parentQuestion,
        parentQuestionId,
        question,
        questionBelongTo,
        questionRepetition
    } } = props;

    const { register, handleSubmit, formState: { errors }, setValue, setError, trigger } = useForm({
        mode: 'onChange',
        resolver: yupResolver(validationSchema),
        defaultValues: {
            question: question
        }
    });

    const onSubmit = async (data) => {
        const { question } = data;
        setApiProcess({
            isLoading: true,
            errorMessage: '',
            successMessage: '',
        })

        let _payloadData = {
            questionRepetition: questionRepetition,
            question: question,
            parentQuestionId: parentQuestionId || 0,
            id: id,
        };

        switch (questionType) {
            case "IDENTITY_QUESTION":
                _payloadData['profileQuestionBelongTo'] = questionBelongTo;
                break;

            case "STORY_QUESTION":
                _payloadData['storyQuestionBelongTo'] = questionBelongTo;
                break;

            default:
                _payloadData['familyQuestionBelongTo'] = questionBelongTo;
                break;
        }

        let payloadData = JSON.stringify(_payloadData);

        try {
            const { status, data: { httpStatusCode, friendyMessageList } } = await postRequest(questionEndpoint, payloadData);

            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setApiProcess({
                    isLoading: false,
                    errorMessage: '',
                    successMessage: RESPONSE_MESSAGES[LOCALE].SUCCESS_UPDATE_QUESTIONS,
                });

                dispatch({
                    type: actions.TOAST_PROCESS,
                    payload: {
                        [STORAGE_INDEXES.TOAST_STATUS]: true,
                        [STORAGE_INDEXES.TOAST_TYPE]: 'success',
                        [STORAGE_INDEXES.TOAST_MESSAGE]: RESPONSE_MESSAGES[LOCALE].SUCCESS_UPDATE_QUESTIONS,
                    }
                });
                setModalShow(false);
                getFamilyQuestions();
            } else {
                setApiProcess({
                    isLoading: false,
                    errorMessage: RESPONSE_MESSAGES[LOCALE].ERROR_UPDATING_QUESTIONS,
                    successMessage: '',
                });
            }
        } catch (error) {
            setApiProcess({
                isLoading: false,
                errorMessage: RESPONSE_MESSAGES[LOCALE].ERROR_UPDATING_QUESTIONS,
                successMessage: '',
            });
        }

        return false;
    }

    useEffect(() => {
        setApiProcess({
            isLoading: false,
            errorMessage: '',
            successMessage: '',
        });
    }, [id]);

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            keyboard={false}
            centered
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Modal.Header>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Edit Question
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='mb-2 mt-2'>
                        <textarea {...register('question')} name='question' className='form-control' disabled={isLoading} />
                    </div>
                    {errors.question && <p className='text-error fs-1-5'>{errors.question.message}</p>}
                    {errorMessage && <p className='text-error fs-1-5'>{errorMessage}</p>}
                </Modal.Body>
                <Modal.Footer>
                    <Button disabled={isLoading} type="submit" className='btn primary-btn btn-xs'>
                        {isLoading ?
                            <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />&nbsp;<span>Updating...</span></>
                            : 'Update'
                        }
                    </Button>
                    <Button disabled={isLoading} className='btn primary-btn btn-xs' onClick={props.onHide}>
                        Close
                    </Button>
                </Modal.Footer>
            </form>
        </Modal>
    );
};

export default AvatarQuestionModal;