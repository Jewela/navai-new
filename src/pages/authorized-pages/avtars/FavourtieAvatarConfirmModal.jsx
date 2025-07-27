import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { AVTAR } from '../../../../app/config/endpoints';

// import actions, { ACTION_SERVICES } from '../../../../redux/authenticate/actions';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

// import { deleteRequest } from '../../../../app/httpClient/axiosClient';
// import { RESPONSE_CODE } from '../../../../app/constants';
import toast from 'react-hot-toast';

function FavourtieAvatarConfirmModal(props) {
    const { favavatar: { status, title, id, action, avatarname, avatarimage }, handleavatarmodalstatus = undefined, fnhandlecallback = undefined, } = props;

    const onHide = () => {
        handleavatarmodalstatus();
    }

    return <><Modal
        {...props}
        size="lg"
        className="del-avator-modal"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        show={status}
        centered
    >
        <Modal.Body className="text-center pb-0">
            <div>
                <h4>{title}</h4>
            </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
            <Button
                className='add-more'
                // disabled={loader}
                onClick={() => fnhandlecallback(id, action, avatarname, avatarimage)}
            >
                Submit
            </Button>
            <Button
                onClick={() => onHide()}
                // disabled={loader}
                className='add-more'>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
    </>
}

export default FavourtieAvatarConfirmModal