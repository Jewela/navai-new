import { Button, Modal, Spinner } from "react-bootstrap";

function AvatarTrialDialog(props) {

    const handleProceed = () => {
        props.FnCallback();
        props.onHide();
    }
    return (<>
        <>
            <Modal
                show={props.show}
                onHide={props.onHide}
                backdrop={props.backdrop}
                keyboard={props.keyboard}
                id="account-modal"
                centered
            >
                <Modal.Header closeButton={false}>
                    <Modal.Title>Do want to use trial?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-center">
                        <button className="btn btn-sm primary-btn me-2" onClick={handleProceed} >Yes</button>
                        <button className="btn btn-sm btn-danger" onClick={props.onHide} >No</button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    </>)
}
export default AvatarTrialDialog;