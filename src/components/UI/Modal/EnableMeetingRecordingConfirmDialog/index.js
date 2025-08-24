import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE_SLUGS } from "../../../../app/constants";
import { useDispatch } from "react-redux";
import actions from "../../../../redux/authenticate/actions";

function EnableMeetingRecordingConfirmDialog(props) {
  const [activeForm, setActiveForm] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch({
      type: actions.CLOSE_ENABLE_MEETING_RECORDING_CONFIRM_MODAL,
      payload: { preventClose: true }
    });
    // navigate(-1);
  }

  const handleNavigation = () => {
    dispatch({
      type: actions.CLOSE_ENABLE_MEETING_RECORDING_CONFIRM_MODAL,
      payload: { preventClose: true }
    });
    // navigate(AUTH_ROUTE_SLUGS.SUBSCRIBE.USER_SUBSCRIPTION)
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop={props.backdrop}
        keyboard={props.keyboard}
        id="account-modal"
        centered
      >
        <Modal.Header closeButton={props?.preventClose === true ? false : true}>
          <Modal.Title>Enable Recording</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Enable recording for this session?</p>
          <div className="d-flex justify-content-center">
            <button className="btn btn-sm primary-btn me-2" onClick={handleNavigation}>Yes</button>
            <button className="btn btn-sm primary-btn" onClick={handleCancel}>No</button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EnableMeetingRecordingConfirmDialog;
