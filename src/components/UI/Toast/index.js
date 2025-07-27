import React, { useState } from 'react';
import { useDispatch } from 'react-redux';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Toast from 'react-bootstrap/Toast';
import actions from '../../../redux/authenticate/actions';
import { STORAGE_INDEXES } from '../../../app/constants';

import ToastContainer from 'react-bootstrap/ToastContainer';

function Toaster(props) {
    const dispatch = useDispatch();
    const { type, title, message, status } = props;
    const [show, setShow] = useState(status);

    const handleOnclose = () => {
        dispatch({
            type: actions.TOAST_PROCESS,
            payload: {
                [STORAGE_INDEXES.TOAST_STATUS]: false,
                [STORAGE_INDEXES.TOAST_TYPE]: '',
                [STORAGE_INDEXES.TOAST_MESSAGE]: '',
            }
        });
    }
    return <>
        <ToastContainer className="position-static" position='top-end'>
            <Toast className="d-inline-block m-1" onClose={() => handleOnclose()} show={show} bg={type} delay={3000} autohide>
                <Toast.Body className={`text-light fs-1-5 toast-body`}>
                    {message}
                </Toast.Body>
            </Toast>
        </ToastContainer>
    </>
}

export default Toaster;