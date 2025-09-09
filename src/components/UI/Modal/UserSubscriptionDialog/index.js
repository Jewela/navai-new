import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { AUTH_ROUTE_SLUGS } from "../../../../app/constants";
import { useDispatch } from "react-redux";
import actions from "../../../../redux/authenticate/actions";

function UserSubscriptionDialog(props) {
  const [activeForm, setActiveForm] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleCancel = () => {
    dispatch({
      type: actions.CLOSE_SUBSCRIPTION_MODAL,
      payload: { preventClose: true }
    });
    navigate(-1);
  }

  const handleNavigation = () => {
    dispatch({
      type: actions.CLOSE_SUBSCRIPTION_MODAL,
      payload: { preventClose: true }
    });
    navigate(AUTH_ROUTE_SLUGS.SUBSCRIBE.USER_SUBSCRIPTION)
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
          <Modal.Title>Subscription required</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>User subscription is required to access this Avatar.</p>
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-sm primary-outline" onClick={handleCancel}>Cancel</button>
            <button className="btn btn-sm primary-btn" onClick={handleNavigation}>Buy subscription</button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UserSubscriptionDialog;
