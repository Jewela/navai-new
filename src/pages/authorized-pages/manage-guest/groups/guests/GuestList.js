import { Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { AUTH_ROUTE_SLUGS } from "../../../../../app/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { formatOrderDate } from "../../../../../utils/helpers/function";

function GuestList(props) {

    const { isLoading, guestList = [], groupId = 0 } = props;
    const [selectedAttributes, setSelectedAttributes] = useState({
        id: 0,
        status: null,
        isLoading: false,
    })

    const handleConfirmAction = (id, status) => {
        // handleSelectedAttributes(id, status)
        // handleConfirmModalShow(true);
        return;
    }
    if (isLoading) {
        return <>
            <div className='mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }

    return (<>
        <div className="col-md-12 mx-auto">
            <div className="box-wrap">
                <div className="box-header border-0 ">
                    <div className="d-flex justify-content-between">
                        <h2 className="h3 mb-0 mt-2"><i className="ri-user-6-line"></i> Guest List</h2>
                        <Link className="btn btn-sm btn-primary" to={`${AUTH_ROUTE_SLUGS.MANAGE_GUEST_GROUP}/${groupId}${AUTH_ROUTE_SLUGS.INVITE_GUEST}`}>
                            <i className="ri-add-line"></i>Invite Guest
                        </Link>
                    </div>
                    <div className="profile__options mt-3">
                        {guestList.length > 0
                            ? guestList.map((guest, index) => {
                                return <div className="h3 rounded-10 p-4" key={`key-emp-id-${guest.invitationId}`} id={`emp-id-${guest.invitationId}`}>
                                    <i className="ri-user-line"></i>
                                    <div className="h4">{guest?.userEmail}</div>
                                    <div className="d-flex justify-content-between align-items-center text-sm">
                                        {renderStatusIcon(guest?.invitationStatus, guest.invitationId, handleConfirmAction, selectedAttributes)}
                                        <div className="fill">
                                            <FontAwesomeIcon icon={faCalendarCheck} className="text-muted me-1" />
                                            <small className="status-text text-muted">{formatOrderDate(guest?.invitedOn)}</small>
                                        </div>
                                    </div>
                                </div>
                            })
                            : <span className="d-flex justify-content-center text-danger mt-5">Guests not found.</span>
                        }
                    </div>
                </div>
            </div>
        </div>
    </>)
}
export default GuestList;
const renderStatusIcon = (status, id, handleConfirmAction, selectedAttributes) => {
    switch (status) {
        case 'Accepted':
            return (
                <>
                    <div>
                        <i className="ri-checkbox-circle-line accepted-icon text-success" title="Accepted"></i>
                        <span className="status-text text-success">Active</span>
                    </div>
                </>
            );
        case 'Pending':
            return (
                <>
                    <div>
                        <i className="ri-checkbox-circle-line accepted-icon text-success" title="Accepted"></i>
                        <span className="status-text text-success">Active</span>
                    </div>
                </>
            );
            return (
                <>
                    <i className="ri-checkbox-circle-line accepted-icon text-success" title="Accepted"></i>
                    <span className="status-text text-success">Active</span>
                </>
            );
            return (
                <>
                    <div className="">
                        {selectedAttributes?.isLoading === true && selectedAttributes?.id === id
                            ? <>
                                <Spinner
                                    as="span"
                                    variant="dark"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="text-muted ms-1">Cancelling...</span>
                            </>
                            : <>
                                <i className="ri-checkbox-circle-line accepted-icon text-muted" title="Accepted"></i>
                                <span className="status-text text-muted">{status}</span>
                            </>
                        }

                    </div>

                    <div
                        className={`delete-container ms-4 text-danger ${selectedAttributes?.isLoading && 'opacity-0p5'}`} role="button"
                        onClick={() => selectedAttributes?.isLoading ? null : handleConfirmAction(id)}
                    >
                        <i className="ri-close-circle-line delete-icon" title="Delete"></i>
                        <span className="status-text">Cancel</span>
                        {/* {selectedAttributes?.isLoading && <>
                        </>} */}
                    </div>
                </>
            );
        case 'Cancelled':
            return (
                <>
                    <div>
                        <i className="ri-close-circle-line cancelled-icon text-danger" title="Cancelled"></i>
                        <span className="status-text text-danger">{status}</span>
                    </div>
                </>
            );
        default:
            return (
                <>
                    <i className="ri-information-line unknown-icon text-warning" title="Unknown"></i>
                    <span className="status-text text-warning">Unknown</span>
                </>
            );
    }
};