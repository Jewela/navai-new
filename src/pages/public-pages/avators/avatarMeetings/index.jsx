import { useParams } from "react-router-dom";
import { postRequest } from "../../../../app/httpClient/axiosClient";
import { DEFAULT_VALUE, RESPONSE_CODE, SUBSCRIPTION_TYPES } from "../../../../app/constants";
import { useState } from "react";
import { AVTAR } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import actions, { CART_ACTIONS, CHAT_ACTIONS, RECENT_AVATARS_ACTION as recent_actions } from "../../../../redux/authenticate/actions";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import MeetingContainer from "./meetingContainer";

function AvatorDetails() {
    const { id: avatorId } = useParams();
    const { isAuthenticated, userData } = useSelector(state => state.auth);
    const { id: userId, userSubscriptionStatus = false } = userData;
    const dispatch = useDispatch();
    const { avatar_id: avatarChatId } = useSelector(state => state.avatar_conversation);
    const [isLoading, setLoading] = useState(false);
    const [avatorDetails, setAvatorDetails] = useState({});
    const [recentVisitLoading, setRecentVisitLoading] = useState(false);
    const [avtarDetail, setAvtarDetail] = useState({});

    const {
        avatarList: recentFavAvatarList = []
    } = useSelector(state => state.recent_avatar);
    const [{ avatarid: recentAvatarId = 0 } = {}] = recentFavAvatarList;

    async function getAvtarById(url) {
        setLoading(true);
        const LOCALE = DEFAULT_VALUE.LOCALE

        let payloadData = JSON.stringify({
            id: avatorId,
        });

        try {
            const { status, data: { httpStatusCode }, data: { data } } = await postRequest(url, payloadData);
            if (status === RESPONSE_CODE[200] && httpStatusCode === RESPONSE_CODE[200]) {

                const { name, images, personalDetailDto, avatarCategoryEnum, hasAvatarActiveSubscription, userAvatarSubscription } = data;
                setAvtarDetail(data);
                const [_image] = images.filter(item => item.isProfile);
                const lifeSummary = personalDetailDto !== null && Object.keys(personalDetailDto).length > 0 ? personalDetailDto?.lifeSummary : null;

                if (!isAuthenticated && avatarCategoryEnum === 1) {
                    dispatch({
                        type: actions.OPEN_AUTH_MODAL,
                        payload: { preventClose: true }
                    });
                    return;
                }
                console.log({ avatarCategoryEnum, userSubscriptionStatus })
                console.log({ userAvatarSubscription })
                const { isActive } = userAvatarSubscription;

                //? previous logic.
                // if (avatarCategoryEnum === 1 && userSubscriptionStatus === false) {
                if (!isActive) {
                    console.log("we got this..... ");
                    dispatch({
                        type: CART_ACTIONS.UPDATE_CART,
                        payload: {
                            isBusiness: true,
                            type: SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION,
                            currency: "USD",
                            currencySymbol: "$",
                            cartItems: [],
                            avatarDetails: data,
                        },
                    });
                    dispatch({
                        type: actions.OPEN_SUBSCRIPTION_MODAL,
                        payload: { preventClose: true }
                    });
                    return;
                }

                setAvatorDetails({
                    name: name,
                    image: _image?.imageBlobUrl,
                    avatarId: parseInt(avatorId),
                    lifeSummary: lifeSummary
                });

                if (avatarChatId !== avatorId) {
                    dispatch({
                        type: CHAT_ACTIONS.CHAT_CONVERSATION_INIT,
                        payload: { avatar_id: avatorId }
                    });
                }

                if (isAuthenticated && (recentAvatarId !== parseInt(avatorId) || parseInt(recentAvatarId) === 0)) {
                    captureRecentVisit({
                        "userid": userId,
                        "avatarid": parseInt(avatorId),
                        "avatarname": name,
                        "avatariamge": _image?.imageBlobUrl || '/images/avator-4.jpg',
                        "visit_time": currentTimestamp(),
                    });
                }
                setLoading(false);
            } else {
                setLoading(false);
            }
        } catch (error) {
            const errorMessage = getErrorMessage(error);
            setLoading(false);
        }
    }

    const captureRecentVisit = async (payload) => {
        return false;
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

    useEffect(() => {
        getAvtarById(AVTAR.EDIT);
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant',
        });

        // if (!isAuthenticated) {
        //     dispatch({
        //         type: actions.OPEN_AUTH_MODAL,
        //         payload: { preventClose: true }
        //     });
        // }
    }, [avatorId]);

    if (isLoading) {
        return <>
            <div className='loading1 mt-5 pre-loading'>
                <Spinner className="mb-2" as="span" animation="grow" size="lg" role="status" aria-hidden="true" />
            </div>
        </>
    }

    return (<>
        <section className="chat py-3 pt-5">
            <MeetingContainer
                avatorDetails={avatorDetails}
                userData={userData}
            />
            {/* <LeftSection avatarId={avatorId} /> */}
            {/* {Object.keys(avatorDetails).length > 0 &&
                <ChatSection avator={avatorDetails} />
            } */}
        </section>
    </>);
}
export default AvatorDetails;
