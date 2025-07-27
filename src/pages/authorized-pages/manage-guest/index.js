import { useNavigate } from "react-router-dom";
import AvatarMenu from "../avtars/AvatarMenu";
import { AUTH_ROUTE_SLUGS, RESPONSE_CODE } from "../../../app/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import { useEffect, useState } from "react";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import GroupList from "./groups/groupList";
import { Spinner } from "react-bootstrap";

const PAGINATIOIN = {
    TAKE: 9,
    SKIP: 0,
    NO_OF_RECORDS: 9,
    TOTAL_RECORDS: 0,
};

function ManageGuest() {
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(true);
    const [groupList, setGroupList] = useState([]);
    const [employesListReplica, setEmployesListReplica] = useState([])
    const [loadMore, setLoadMore] = useState(true);

    const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
    const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
    const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
    const [isLimitReached, setIsLimitReached] = useState(false);

    const handleBacknavigation = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
        }
    }

    const getGroup = async () => {
        try {
            setLoadMore(true);
            const payload = {
                "skip": skipRecord,
                "take": takeRecord,
            }
            const response = await postRequest(AVTAR.GET_GROUPS, payload);
            const { status, data: { data: { count, groupDetails }, httpStatusCode } } = response;
            console.log({ response, count, groupDetails });
            console.warn({ httpStatusCode, status });

            if (
                httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200]
            ) {
                console.log({ groupDetails });

                if (groupDetails.length) {
                    setGroupList([...groupList, ...groupDetails]);
                } else {
                    setIsLimitReached(true);
                }

                // if (invitations.length) {
                //     setEmployesListReplica([...employesListReplica, ...invitations]);
                //     console.warn(selectedFilterOption)
                //     if (selectedFilterOption !== filterViewOptions.ALL) {
                //         const filteredUpdatedList = invitations.filter(employee => employee.invitationStatus === selectedFilterOption);
                //         setEmployeesList([...employeesList, ...filteredUpdatedList]);
                //     } else {
                //         setEmployeesList([...employeesList, ...invitations]);
                //     }
                // } else {
                //     setIsLimitReached(true);
                // }

                setLoading(false);
                setLoadMore(false);
                setTotalRecords(count);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.warn({ error, errorMessage });
            toast.error(errorMessage)
            setLoading(false);
            setLoadMore(false);
        }
    }

    const loadMoreGroups = () => {
        setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
    };

    useEffect(() => {
        getGroup();
        if (groupList.length === 0) {
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
                            Manage Guest
                        </h1>
                    </div>
                    <AvatarMenu />
                </div>
            </div>
        </section>

        <section className="spacer-md avator py-4">
            <div className="container">
                <div className="d-flex justify-content-between">
                    <div>
                        <span role="button" onClick={handleBacknavigation}>
                            <FontAwesomeIcon icon={faArrowLeft} /> Back
                        </span>
                    </div>
                </div>
                <div className="row ">
                    <div className="col-md-12 mx-auto">
                        <svg
                            width="100%"
                            height="1050"
                            viewBox="0 0 1500 1500"
                            className="filter-svg"
                        >
                            <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
                        </svg>
                    </div>
                    <div className="col-md-12 mt-3 mx-auto">
                        <GroupList
                            groupList={groupList}
                            isLoading={isLoading}
                        />
                        <button
                            className={`m-auto btn primary-btn mt-5 d-flex justify-content-center align-items-center ${loadMore && "btn-loading"}`}
                            onClick={loadMoreGroups}
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
    </>)
}
export default ManageGuest;