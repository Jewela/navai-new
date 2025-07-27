import { useState } from "react";
import Modal from "react-bootstrap/Modal";

import LoginModal from "./LoginModal";
import SingunModal from "./SingunModal";

function AuthModal(props) {
  const [activeForm, setActiveForm] = useState(1);
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
          <Modal.Title>Welcome to Navai</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeForm ? (
            <LoginModal onHide={props.onHide} onFormChange={setActiveForm} />
          ) : (
            <SingunModal onHide={props.onHide} onFormChange={setActiveForm} />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default AuthModal;
