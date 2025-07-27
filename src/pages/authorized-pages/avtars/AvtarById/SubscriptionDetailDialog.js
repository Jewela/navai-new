import { Button, Modal, Spinner } from "react-bootstrap";

function SubscriptionDetailDialog(props) {
    const { subscriptionDetail = {} } = props;
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
                <Modal.Header closeButton>
                    <Modal.Title>Active Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.keys(subscriptionDetail).length > 0 &&
                        <div className=" mx-auto">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Subscription Date</th>
                                        <th>Payment Gateway</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{new Date(subscriptionDetail.subscriptionStartedOnUTC).toLocaleDateString()}</td>
                                        <td>{subscriptionDetail.paymentGateway}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    }
                </Modal.Body>
            </Modal>
        </>
    </>)
}
export default SubscriptionDetailDialog;