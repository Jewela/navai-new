import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE_SLUGS } from "../../../../app/constants";
import { useDispatch } from "react-redux";
import actions from "../../../../redux/authenticate/actions";

function EnableMeetingRecordingConfirmDialog({ onConfirm  , ...props}) {
  const [activeForm, setActiveForm] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEnableRecording = () => {
    dispatch({
      type: actions.CLOSE_ENABLE_MEETING_RECORDING_CONFIRM_MODAL,
      payload: { preventClose: true }
    });
    
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(true);
    }
  }

  const handleDisableRecording = () => {
    dispatch({
      type: actions.CLOSE_ENABLE_MEETING_RECORDING_CONFIRM_MODAL,
      payload: { preventClose: true }
    });
    
    if (onConfirm && typeof onConfirm === 'function') {
      onConfirm(false);
    }
  }

  return (
    <>
      <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop={props.backdrop}
        keyboard={props.keyboard}
        id="recording-confirm-modal"
        centered
      >
        <Modal.Header closeButton={props?.preventClose === true ? false : true}>
          <Modal.Title>Enable Session Recording</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p className="mb-3">
              Would you like to enable session recording for this avatar meeting? 
              This will record your screen, microphone, and avatar audio.
            </p>
            <div className="d-flex justify-content-center gap-2">
              <button 
                className="btn btn-sm primary-btn me-2" 
                onClick={handleEnableRecording}
              >
                Yes
              </button>
              <button 
                className="btn btn-sm primary-btn" 
                onClick={handleDisableRecording}
              >
                No
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default EnableMeetingRecordingConfirmDialog;