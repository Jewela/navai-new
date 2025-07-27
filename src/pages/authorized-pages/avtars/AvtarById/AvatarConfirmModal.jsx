import { Button, Modal, Spinner } from "react-bootstrap";

function AvatarConfirmModal(props) {
    const { onHide, propDetails: { modalActiveStaus, confirmTitle, isLoading, FnCallback, payloadStatus, getSubscriptionListLoading } } = { ...defaultProps, ...props };

    return <><Modal
        show={modalActiveStaus}
        size="lg"
        className="del-avator-modal"
        aria-labelledby="contained-modal-title-vcenter"
        backdrop="static"
        keyboard={false}
        centered
    >

        <Modal.Body className="text-center pb-0">
            <div>
                <h4 dangerouslySetInnerHTML={{ __html: confirmTitle }} />
            </div>
        </Modal.Body>
        <Modal.Footer className="border-0 justify-content-center">
            {getSubscriptionListLoading
                ? <>
                    <h2
                        className='add-more'
                    >
                        Please wait <Spinner className="loadmore-btn" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
                    </h2>
                </>
                :
                <>
                    <Button
                        onClick={() => onHide()}
                        disabled={isLoading}
                        className='add-more'
                    >
                        No
                    </Button>
                    <Button
                        onClick={() => isLoading ? false : FnCallback(payloadStatus)}
                        className='add-more'
                        disabled={isLoading}
                    >
                        Yes&nbsp;{isLoading && <span className="spinner-border spinner-border-sm mx-2" role="status" />}
                    </Button>
                </>

            }
        </Modal.Footer>
    </Modal>
    </>
}
export default AvatarConfirmModal;
const defaultProps = {
    modalActiveStaus: false,
    confirmTitle: false,
    isLoading: false,
    FnCallback: undefined,
    onHide: undefined,
}