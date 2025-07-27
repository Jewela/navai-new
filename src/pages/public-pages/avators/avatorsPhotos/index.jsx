import { useNavigate, useParams } from "react-router-dom";
import { postRequest } from "../../../../app/httpClient/axiosClient";
import AvatartMediaPhotos from "./AvatartMediaPhotos";
import LeftSection from "./leftsection";
import { DEFAULT_VALUE, MEDIA_CATEGORY, PUBLIC_ROUTES_SLUGS, RESPONSE_CODE } from "../../../../app/constants";
import { useState } from "react";
import { AVTAR } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { CHAT_ACTIONS } from "../../../../redux/authenticate/actions";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const PAGINATIOIN = {
    TAKE: 10,
    SKIP: 0,
    NO_OF_RECORDS: 2,
    TOTAL_RECORDS: 0
}

function AvatorDetails() {
    const { selectedAvatar } = useSelector((state) => state.photo_album_reducer);
    const { id: avatorId, category: avatarCategory } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isDateFilterLoading, setDateFilterLoading] = useState(true);
    const [isSubjectFilterLoading, setSubjectFilterLoading] = useState(true);

    const [yearFilter, setYearFilter] = useState([]);
    const [subjectFilterList, setSubjectFilterList] = useState([]);

    const [selectedYear, setSelectedYear] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('');

    const [isAvtarMediaLoading, setAvtarMediaLoading] = useState(true);
    const [avtarMediaList, setSetAvtarMediaList] = useState([]);
    const [loadMore, setLoadMore] = useState(true);
    const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
    const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
    const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);

    async function getMediadateFilter(url) {

        setDateFilterLoading(true);
        const LOCALE = DEFAULT_VALUE.LOCALE

        let payloadData = JSON.stringify({
            avatarId: avatorId,
            mediaCategory: MEDIA_CATEGORY[avatarCategory],
        });

        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                const { usedYears } = data;
                setYearFilter(usedYears.filter(year => year !== null));
                setDateFilterLoading(false);
            } else {
                setDateFilterLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error(errorMessage);
            setDateFilterLoading(false);
        }
    }

    async function getSubjectFilter(url) {
        setSubjectFilterLoading(true);
        const LOCALE = DEFAULT_VALUE.LOCALE

        let payloadData = JSON.stringify({
            avatarId: avatorId,
            mediaCategory: MEDIA_CATEGORY[avatarCategory],
            filter: false,
        });

        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                console.log("SUBJECTS ===> ", data);
                setSubjectFilterList(data)
                setSubjectFilterLoading(false);
            } else {
                setSubjectFilterLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            console.error(errorMessage);
            setSubjectFilterLoading(false);
        }
    }

    const getAvatarMedia = async (URL) => {
        let payloadFilter = {
            logic: "and",
            filters: [
                {
                    field: "avatarId",
                    operator: "eq",
                    value: avatorId
                },
                {
                    field: "mediaCategory",
                    operator: "eq",
                    value: MEDIA_CATEGORY[avatarCategory]
                }

            ]
        };

        if (selectedSubject !== '') {
            payloadFilter.filters.push({
                field: "subjectId",
                operator: "eq",
                value: selectedSubject
            });
        }

        const avatarMediaPayload = {
            take: takeRecord,
            skip: skipRecord,
            filter: payloadFilter,
        };

        try {
            setAvtarMediaLoading(true);
            const { status, data: { httpResponseDetail: { httpStatusCode }, result: { data }, count: totalRecords } } = await postRequest(URL, avatarMediaPayload);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                setSetAvtarMediaList([...avtarMediaList, ...data]);
                setTotalRecords(totalRecords)
                setAvtarMediaLoading(false);
                setLoadMore(false);
            } else {
                setAvtarMediaLoading(false);
            }
        } catch (error) {
            console.log(error)
            const errorMessage = getErrorMessage(error);
            toast.error(errorMessage)
            setAvtarMediaLoading(false);
            setLoadMore(false);
        }

    }

    const loadMoreAvators = () => {
        setLoadMore(true);
        setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
    }

    const handleNavigate = () => {
        navigate(`${PUBLIC_ROUTES_SLUGS.AVATORS}/${avatorId}`);
    }

    useEffect(() => {
        // getMediadateFilter(AVTAR.GET_AVATAR_DATE_FILTER);
        // getSubjectFilter(AVTAR.GET_SUBJECT);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });
    }, []);

    useEffect(() => {
        // getAvatarMedia(AVTAR.GET_AVATAR_MEDIA);
    }, [avatorId, skipRecord, selectedSubject]);

    return (<>

        <section className="page-heading light-bg py-5">
            <div className="container">
                <div className="row">
                    <div className="col-md-12 text-center position-relative">
                        <h1 className="mb-0 h2 fw-bold">Photo Album</h1>
                    </div>
                </div>
            </div>
        </section>
        <section className="spacer-md">
            <div className="container">
                <div className="row">
                    {!selectedAvatar.status &&
                        <div className="col-md-12 mb-3">
                            <span role="button" onClick={handleNavigate}>
                                <FontAwesomeIcon icon={faArrowLeft} /> Back
                            </span>
                        </div>
                    }
                    <LeftSection
                        avatorId={avatorId}
                        mediaCategory={MEDIA_CATEGORY[avatarCategory]}
                    // isDateFilterLoading={isDateFilterLoading}
                    // isSubjectFilterLoading={isSubjectFilterLoading}
                    // yearFilter={yearFilter}
                    // subjectFilterList={subjectFilterList}
                    // setSelectedYear={setSelectedYear}
                    // setSelectedSubject={setSelectedSubject}
                    // setTotalRecords={setTotalRecords}
                    // setSetAvtarMediaList={setSetAvtarMediaList}
                    // setSkipRecord={setSkipRecord}
                    />
                    <AvatartMediaPhotos
                        avatorId={avatorId}
                        mediaCategory={MEDIA_CATEGORY[avatarCategory]}
                    />
                </div>
            </div>

        </section>
    </>);
}
export default AvatorDetails;
