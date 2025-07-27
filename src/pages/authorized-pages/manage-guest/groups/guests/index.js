import { useNavigate, useParams } from "react-router-dom";
import AvatarMenu from "../../../avtars/AvatarMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";
import { RESPONSE_CODE } from "../../../../../app/constants";
import GuestList from "./GuestList";

const PAGINATIOIN = {
    TAKE: 9,
    SKIP: 0,
    NO_OF_RECORDS: 9,
    TOTAL_RECORDS: 0,
};


function GroupGuest() {
    const params = useParams();
    const { id: groupId } = params
    const navigate = useNavigate();

    const [isLoading, setLoading] = useState(true);
    const [guestList, setGuestList] = useState([]);
    const [employesListReplica, setEmployesListReplica] = useState([])
    const [loadMore, setLoadMore] = useState(true);
    const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
    const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
    const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
    const [isLimitReached, setIsLimitReached] = useState(false);

    console.log(params.id);

    const handleBacknavigation = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
        }
    }

    const getGroupGuest = async () => {
        try {
            setLoadMore(true);
            const payload = {
                "skip": skipRecord,
                "take": takeRecord,
                groupId: groupId,
                "ignoreTakeSkip": false
            }
            const response = await postRequest(AVTAR.GET_GROUPS_GUEST, payload);
            console.log(response);
            const { status, data: { data: { total, invitations }, httpStatusCode } } = response;
            if (
                httpStatusCode === RESPONSE_CODE[200] &&
                status === RESPONSE_CODE[200]
            ) {
                console.log({ total, invitations });
                if (invitations.length) {
                    // setEmployesListReplica([...employesListReplica, ...invitations]);
                    // console.warn(selectedFilterOption)
                    // if (selectedFilterOption !== filterViewOptions.ALL) {
                    //     const filteredUpdatedList = invitations.filter(employee => employee.invitationStatus === selectedFilterOption);
                    //     setEmployeesList([...employeesList, ...filteredUpdatedList]);
                    // } else {
                    //     setEmployeesList([...employeesList, ...invitations]);
                    // }
                    setGuestList([...guestList, ...invitations]);
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

    useEffect(() => {
        getGroupGuest();
    }, [groupId])

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
                    <div className="col-md-12 mt-5 mx-auto">
                        <GuestList
                            isLoading={isLoading}
                            guestList={guestList}
                            groupId={groupId}
                        />
                    </div>
                </div>
            </div>
        </section>
    </>
    )
}
export default GroupGuest