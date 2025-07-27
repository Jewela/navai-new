import { useEffect, useState } from "react";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR, GENERAL } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { DEFAULT_VALUE, PUBLIC_ROUTES_SLUGS } from "../../../app/constants";
import { RESPONSE_CODE } from "../../../app/constants";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import actions, { RECENT_AVATARS_ACTION as recent_actions } from "../../../redux/authenticate/actions";
import RecentVisit from "../../../components/HomePage/RecentVisit";
import toast from "react-hot-toast";

function AvatarBio() {
    const { id: avatorId } = useParams();
    const { isAuthenticated, userData: { id: userId } } = useSelector(state => state.auth);
    const {
        avatarList: recentFavAvatarList = []
    } = useSelector(state => state.recent_avatar);
    const dispatch = useDispatch();
    const [{ avatarid: recentAvatarId = 0 } = {}] = recentFavAvatarList;

    const [avtarDetails, setAvtarDetails] = useState({});
    const [isLoading, setLoading] = useState(true);
    const [recentVisitLoading, setRecentVisitLoading] = useState(false);

    async function getAvtar(url) {
        setLoading(true);
        const LOCALE = DEFAULT_VALUE.LOCALE

        let payloadData = JSON.stringify({
            id: avatorId,
        });

        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {
                const { name, images, personalDetailDto } = data;
                const lifeSummary = personalDetailDto !== null && Object.keys(personalDetailDto).length > 0 ? personalDetailDto?.lifeSummary : null;
                const [_avator] = images.filter(item => item.isProfile);

                setAvtarDetails({
                    profileImage: _avator?.imageBlobUrl,
                    avatarId: parseInt(avatorId),
                    fileName: _avator?.fileName,
                    name: name,
                    lifeSummary: lifeSummary
                });
                setLoading(false);
                console.log(recentAvatarId, avatorId)
                if (isAuthenticated && (recentAvatarId !== parseInt(avatorId) || parseInt(recentAvatarId) === 0)) {
                    captureRecentVisit({
                        "userid": userId,
                        "avatarid": parseInt(avatorId),
                        "avatarname": name,
                        "avatariamge": _avator?.imageBlobUrl || '/images/avator-4.jpg',
                        "visit_time": currentTimestamp(),
                    });
                }

            } else {
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setLoading(false);
        }
    }

    const captureRecentVisit = async (payload) => {
        if (!recentVisitLoading) {
            try {
                const { status } = await postRequest(AVTAR.SET_RECENT_VISIT, payload);

                if (status === RESPONSE_CODE[200]) {
                    const recentAvatarList = [payload, ...recentFavAvatarList];
                    if (recentAvatarList.length > 5) {
                        recentAvatarList.pop();
                    }
                    dispatch({
                        type: recent_actions.UPDATE_AVATAR_LIST,
                        payload: {
                            avatarList: recentAvatarList,
                        }
                    });
                }
                setRecentVisitLoading(true);
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage);
            }

        }
    }

    const currentTimestamp = () => {
        const currentDate = new Date();

        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so we add 1
        const day = String(currentDate.getDate()).padStart(2, '0');
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const handleAuth = () => {
        dispatch({
            type: actions.OPEN_AUTH_MODAL
        });
    }

    useEffect(() => {
        getAvtar(AVTAR.EDIT);
        window.scrollTo(0, 0);
    }, [avatorId]);

    if (isLoading) {
        return <>
            <div className='loading1 mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
                <p>Please wait...</p>
            </div>
        </>
    }

    return (
        <>
            <section className="spacer-md">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8 mx-auto">
                            <div className='edit-avator__inner'>
                                <div className="edit-avator__img position-relative">
                                    <img src={avtarDetails.profileImage ? avtarDetails.profileImage : '/images/avator-4.jpg'} alt={avtarDetails.fileName} className={`rounded-10 w-100`} />
                                </div>
                                <div className='edit-avator__details'>
                                    <h2 className="h3 text-capitalize mb-3">{avtarDetails.name}</h2>
                                    <p>{avtarDetails.lifeSummary}</p>

                                    {isAuthenticated
                                        ? <Link to={`${PUBLIC_ROUTES_SLUGS.AVATORS}/${avatorId}`} className='btn primary-btn mt-4'>Connect</Link>
                                        : <span role='button' onClick={handleAuth} className="btn primary-btn mt-4">
                                            Connect
                                        </span>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {isAuthenticated &&
                <RecentVisit />
            }
        </>
    );
}
export default AvatarBio;
