import { Button, Modal } from "react-bootstrap";

function ConfirmDialoge(props) {
    const { show, onHide, fncallback } = props;
    if (!show) return null;
    return (<>
        <Modal
            {...props}
            size="lg"
            className="del-avator-modal"
            aria-labelledby="contained-modal-title-vcenter"
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Body className="text-center pb-0">
                <div>
                    <h4>Are you sure?</h4>
                    <p className='fs-1'>You want to Cancel the invitation?</p>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 justify-content-center">
                <Button
                    onClick={() => onHide()}
                    className='add-more'>
                    No
                </Button>
                <Button
                    onClick={() => fncallback()}
                    className='add-more'
                >
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    </>)
}
export default ConfirmDialoge;