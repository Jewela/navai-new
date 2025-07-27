import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ADMIM } from '../../../../../app/config/endpoints';

import { Spinner } from 'react-bootstrap';
import actions, { ACTION_SERVICES } from '../../../../../redux/authenticate/actions';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import { postRequest } from '../../../../../app/httpClient/axiosClient';
import { RESPONSE_CODE, DEFAULT_VALUE, STORAGE_INDEXES } from '../../../../../app/constants';
import { RESPONSE_MESSAGES } from '../../../../../app/constants/localizedStrings';

function DeleteQuestion(props) {
    const dispatch = useDispatch();
    const { setDeleteModalShow, getQuestions, setIsDeleted, onHide, questionEndpoint, hoveredQuestion: { id, question, isParent } } = props;
    const [apiProcess, setApiProcess] = useState({});
    const { isLoading, errorMessage, successMessage } = apiProcess;

    const LOCALE = DEFAULT_VALUE.LOCALE

    async function deleteQuestionById() {
        // return false;
        try {
            setApiProcess({
                isLoading: true,
                errorMessage: '',
                successMessage: '',
            })
            const payloadData = { id: id, isParent: isParent };

            const { status, data: { result, httpStatusCode } } = await postRequest(questionEndpoint, payloadData);

            if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
                setApiProcess({
                    isLoading: false,
                    errorMessage: '',
                    successMessage: '',
                });

                dispatch({
                    type: actions.TOAST_PROCESS,
                    payload: {
                        [STORAGE_INDEXES.TOAST_STATUS]: true,
                        [STORAGE_INDEXES.TOAST_TYPE]: 'success',
                        [STORAGE_INDEXES.TOAST_MESSAGE]: RESPONSE_MESSAGES[LOCALE].SUCCESS_DELETE_QUESTIONS,
                    }
                });
                setDeleteModalShow(false);
                getQuestions();
            } else {
                setApiProcess({
                    isLoading: false,
                    errorMessage: RESPONSE_MESSAGES[LOCALE].ERROR_DELETE_QUESTIONS,
                    successMessage: '',
                });
            }
        } catch (error) {
            setApiProcess({
                isLoading: false,
                errorMessage: RESPONSE_MESSAGES[LOCALE].ERROR_DELETE_QUESTIONS,
                successMessage: '',
            });
        }
        // window.scrollTo(0, 0);
    }

    useEffect(() => {
        setApiProcess({
            isLoading: false,
            errorMessage: '',
            successMessage: '',
        });
    }, [id]);

    return <><Modal
        {...props}
        size="lg"
        className="del-avator-modal"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        centered
    >
        <Modal.Header>
            <Modal.Title><h4>Are you sure?</h4></Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center pb-0">
            <div>
                <p className='fs-1'>{question}</p>
            </div>
            {errorMessage && <p className='text-error fs-1-5'>{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">

            <Button
                onClick={() => onHide()}
                disabled={isLoading}
                className='add-more'>
                Close
            </Button>
            <Button
                onClick={() => isLoading ? false : deleteQuestionById()}
                className='add-more'
                disabled={isLoading}
            >
                {isLoading ?
                    <><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />&nbsp;<span>Deleting...</span></>
                    : 'Delete'
                }
            </Button>
        </Modal.Footer>
    </Modal>
    </>
}

export default DeleteQuestion