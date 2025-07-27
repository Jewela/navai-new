import { faArrowLeft, faCalendarCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DropdownButton, Spinner } from "react-bootstrap";
import { AUTH_ROUTE_SLUGS, RESPONSE_CODE } from "../../../../app/constants";
import { Link } from "react-router-dom";
import { postRequest } from "../../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import ConfirmDialoge from "./ConfirmDialoge";
import { useState } from "react";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";
import { formatOrderDate } from "../../../../utils/helpers/function";

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Dropdown from 'react-bootstrap/Dropdown';

// const filterViewOptions = {
//     ALL: "All",
//     CANCELLED: "Cancelled",
//     ACCEPTED: "Accepted",
//     PENDING: "Pending"
// }

function EmployeeList(props) {
    const [confirmModalShow, setConfirmModalShow] = useState(false);
    // const [selectedFilterOption, setSelectedFilterOption] = useState(filterViewOptions.ALL)
    const [selectedAttributes, setSelectedAttributes] = useState({
        id: 0,
        status: null,
        isLoading: false,
    })

    const handleConfirmModalShow = (status = false) => {
        setConfirmModalShow(status);
        if (status === false) {
            handleSelectedAttributes();
        }
    }

    const handleConfirmAction = (id, status) => {
        handleSelectedAttributes(id, status)
        handleConfirmModalShow(true);
    }

    const handleSelectedAttributes = (id = 0, status = null, isLoading = false) => {
        setSelectedAttributes({
            id: id,
            status: status,
            isLoading: isLoading
        })
    }

    const FnCallbackActionYes = () => {
        console.log({ selectedAttributes });
        props.setLoadMore(true);
        setSelectedAttributes((prev) => ({ ...prev, isLoading: true }));
        setConfirmModalShow(false);
        cancelInvitation(selectedAttributes?.id);
    }


    const cancelInvitation = async (id) => {
        try {
            const payload = { invitationIds: [id] }
            const response = await postRequest(AVTAR.DELETE_EMPLOYEE_INVITATION, payload);
            console.log(response);
            const { status, data: { data: { total, invitations }, httpStatusCode } } = response;
            if (
                httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200]
            ) {
                props.FnCallback(id, "Cancelled")
                handleSelectedAttributes();
                toast.success(RESPONSE_MESSAGES.en.INVITATION_CACEL_SUCCESS);
                props.setLoadMore(false)
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
            toast.error(errorMessage === "" || errorMessage === null ? "Getting error while processing your request" : errorMessage);
        }
    }

    const handleFilterOption = (option) => {
        props.FnFiltercallback(props.filterViewOptions[option])
        // setSelectedFilterOption(filterViewOptions[option]);
    }

    // const FilterEmployeeById = (id) => {
    //     // Filter out the employee with the matching id
    //     const updatedList = employeesList.filter(employee => employee.invitationId !== id);
    //     setEmployeesList(updatedList); // Update the state
    // };

    if (props.isLoading) {
        return <>
            <div className='mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="border" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }

    return <>
        <div className="box-wrap">
            <div className="box-header border-0 profile-option-title flex-column">
                <div className="d-flex justify-content-between">
                    <div>
                        <Link to={AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE}>
                            <span role="button">
                                <FontAwesomeIcon icon={faArrowLeft} /> Back
                            </span>
                        </Link>
                    </div>
                    <div>
                        <DropdownButton
                            as={ButtonGroup}
                            variant="Secondary"
                            id={`dropdown-button-drop`}
                            size="xs"
                            className="p-1"
                            title={props.selectedFilterOption}
                        >
                            {Object.keys(props.filterViewOptions).map((options, index) => (
                                <Dropdown.Item
                                    key={index}
                                    eventKey={index}
                                    onClick={() => handleFilterOption(options)}
                                >
                                    {props.filterViewOptions[options]}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </div>
                </div>
                <h2 className="h3 mb-0 mt-2">Employee List</h2>
                {/* {JSON.stringify(selectedAttributes, null, 2)} */}
                <div className="profile__options mt-4">
                    {
                        props.employeesList.length > 0
                            ? props.employeesList.map((epmloyee, index) => {
                                return <div className="h3 rounded-10 p-4" key={`key-emp-id-${epmloyee.invitationId}`} id={`emp-id-${epmloyee.invitationId}`}>
                                    <i className="ri-user-line"></i>
                                    <div className="h4">{epmloyee?.userEmail}</div>
                                    <div className="d-flex justify-content-between align-items-center text-sm">
                                        {renderStatusIcon(epmloyee?.invitationStatus, epmloyee.invitationId, handleConfirmAction, selectedAttributes)}
                                        <div className="fill">
                                            <FontAwesomeIcon icon={faCalendarCheck} className="text-muted me-1" />
                                            <small className="status-text text-muted">{formatOrderDate(epmloyee?.invitedOn)}</small>
                                        </div>
                                    </div>
                                </div>
                            })
                            : <p className="d-flex justify-content-center text-danger">Employees not found.</p>
                    }
                </div>
            </div>
        </div>

        {confirmModalShow &&
            <ConfirmDialoge
                show={confirmModalShow}
                onHide={() => handleConfirmModalShow()}
                fncallback={FnCallbackActionYes}
            />

        }
    </>
}

export default EmployeeList;
const renderStatusIcon = (status, id, handleConfirmAction, selectedAttributes) => {
    switch (status) {
        case 'Accepted':
            return (
                <>
                    <i className="ri-checkbox-circle-line accepted-icon text-success" title="Accepted"></i>
                    <span className="status-text text-success">Active</span>
                </>
            );
        case 'Pending':
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
