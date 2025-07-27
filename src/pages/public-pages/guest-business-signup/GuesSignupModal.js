import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import SignupModal from "../../../components/UI/Modal/BusinessAuth/SignupModal";

function GuesSignupModal(props) {
    const { invitedEmail, email = "", companyName = "" } = props;
    const [_, _email] = invitedEmail.split("=");

    const handleCancel = () => {
        dispatch({
            type: actions.CLOSE_SUBSCRIPTION_MODAL,
            payload: { preventClose: true }
        });
        navigate(-1);
    }

    return (<>
        <Modal
            show={props.show}
            onHide={props.onHide}
            backdrop={props.backdrop}
            keyboard={props.keyboard}
            id="business-account-modal"
            centered
        >
            <Modal.Header closeButton={props?.preventClose === true ? false : true}>
                <Modal.Title>Welcome to Navai Business</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <SignupModal
                    onHide={props.onHide}
                    onFormChange={props.setShow}
                    guestSignup={true}
                    guestEmail={email}
                    companyName={companyName}
                />
            </Modal.Body>
        </Modal>
    </>)
}
export default GuesSignupModal;