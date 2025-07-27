import { useEffect, useState } from "react";

import { postRequest } from "../../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../../app/config/endpoints";
import { DEFAULT_VALUE, RESPONSE_CODE } from "../../../../app/constants";
import { Spinner } from "react-bootstrap";
import AvatarMenu from "../../avtars/AvatarMenu";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import EmployeeList from "./EmployeeList";
const PAGINATIOIN = {
    TAKE: 9,
    SKIP: 0,
    NO_OF_RECORDS: 9,
    TOTAL_RECORDS: 0,
};

const filterViewOptions = {
    ALL: "All",
    CANCELLED: "Cancelled",
    ACCEPTED: "Accepted",
    PENDING: "Pending"
}

function ManageEmployee() {
    const [isLoading, setLoading] = useState(true);
    const [employeesList, setEmployeesList] = useState([]);
    const [employesListReplica, setEmployesListReplica] = useState([])
    const [loadMore, setLoadMore] = useState(true);
    const [selectedFilterOption, setSelectedFilterOption] = useState(filterViewOptions.ALL)
    const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
    const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
    const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
    const [isLimitReached, setIsLimitReached] = useState(false);

    const getEmployee = async () => {
        try {
            setLoadMore(true);
            const payload = {
                "skip": skipRecord,
                "take": takeRecord,
                "ignoreTakeSkip": false
            }
            const response = await postRequest(AVTAR.GET_EMP_INVITATION, payload);
            console.log(response);
            const { status, data: { data: { total, invitations }, httpStatusCode } } = response;
            if (
                httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200]
            ) {
                console.log({ total, invitations });
                if (invitations.length) {
                    setEmployesListReplica([...employesListReplica, ...invitations]);
                    console.warn(selectedFilterOption)
                    if (selectedFilterOption !== filterViewOptions.ALL) {
                        const filteredUpdatedList = invitations.filter(employee => employee.invitationStatus === selectedFilterOption);
                        setEmployeesList([...employeesList, ...filteredUpdatedList]);
                    } else {
                        setEmployeesList([...employeesList, ...invitations]);
                    }
                } else {
                    setIsLimitReached(true);
                }
                setLoading(false);
                setLoadMore(false);
                setTotalRecords(total);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
            toast.error(errorMessage)
            setLoading(false);
            setLoadMore(false);
        }
    }

    const loadMoreEmployee = () => {
        // setSelectedFilterOption(filterViewOptions.ALL);
        // handleFilterStatus(filterViewOptions.ALL);
        setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
    };

    const FnCallback = (id, status) => {
        setEmployeesList((prevList) => {
            // Create a new updated list with the modified employee status
            const updatedList = prevList.map((employee) => {
                // If the employee ID matches, update the status
                if (employee.invitationId === id) {
                    return {
                        ...employee,
                        invitationStatus: status, // or any status you want to update
                    };
                }
                // Return the employee unchanged if the ID doesn't match
                return employee;
            });

            return updatedList; // Set the updated list in the state
        });

    }

    const handleFilterStatus = (status) => {
        console.log(status)
        setSelectedFilterOption(status);
        let updatedList;

        if (status === filterViewOptions.ALL) {
            // updatedList = employeesList.filter(employee => employee.invitationId !== id);   
            console.log("employesListReplica: ", employesListReplica)
            updatedList = employesListReplica;
        } else {
            updatedList = employesListReplica.filter(employee => employee.invitationStatus === status);
        }

        setEmployeesList(updatedList);
    }

    useEffect(() => {
        getEmployee();
        if (employeesList.length === 0) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant",
            });
        }
    }, [skipRecord])

    return (<>
        <section className="page-heading light-bg py-5">
            <div className="container">
                <div className="row position-relative">
                    <div className="col-md-12 text-center position-relative">
                        <h1 className="mb-0 h2 fw-bold">
                            Manage Employee
                        </h1>
                    </div>
                    <AvatarMenu />
                </div>
            </div>
        </section>

        {isLoading
            ? <>
                <div className="loading1 mt-5 pre-loading">
                    <Spinner
                        className="mb-2"
                        as="span"
                        animation="grow"
                        size="lg"
                        role="status"
                        aria-hidden="true"
                    />
                    <p className="">{DEFAULT_VALUE.PROCESSING_TEXT.LOADING}</p>
                </div>
            </>
            : <>
                <section className="spacer-md avator py-5">
                    <div className="container">
                        <div className="row ">
                            <svg
                                width="100%"
                                height="1050"
                                viewBox="0 0 1500 1500"
                                className="filter-svg"
                            >
                                <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
                            </svg>
                            <div className="col-md-12 mt-5 mx-auto">
                                {/* {JSON.stringify(employeesList, null, 2)} */}
                                <EmployeeList
                                    isLoading={isLoading}
                                    employeesList={employeesList}
                                    FnCallback={FnCallback}
                                    setLoadMore={setLoadMore}
                                    selectedFilterOption={selectedFilterOption}
                                    FnFiltercallback={handleFilterStatus}
                                    filterViewOptions={filterViewOptions}
                                />
                                <button
                                    className={`m-auto btn primary-btn mt-5 d-flex justify-content-center align-items-center ${loadMore && "btn-loading"}`}
                                    onClick={loadMoreEmployee}
                                    disabled={isLimitReached || loadMore}
                                >
                                    Load More{" "}
                                    {loadMore && (
                                        <>
                                            &nbsp;
                                            <Spinner
                                                className="loadmore-btn"
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </>
        }
    </>)
}
export default ManageEmployee;