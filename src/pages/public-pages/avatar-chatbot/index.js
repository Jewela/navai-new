import React, { useEffect, useState } from "react"
import AvatarChatbotForm from "../../../components/AvatarChatBotById/AvatarChatbotForm"
import { useLocation } from "react-router-dom";
import HelperChatbot from "../../../components/HelperChatbot";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import { useDispatch } from "react-redux";
import { setAvatarId, setAvatarInfo } from "../../../redux/avatarIdReducer/avatarIdSlice";
import { AVATAR_CHAT_ACTIONS_BUTTON_TITLE, AVATAR_CHAT_ACTIONS_FEATURE } from "../../../app/constants";
import RequestActions from "../../../components/AvatarChatBotById/RequestActions";
import RequestFeaturePopup from "../../../components/AvatarChatBotById/RequestFeaturePopup";


function AvatarChatbotPage() {
    const query = useQuery();
    const avatarId = query.get('id') || 219; // Get the ID from the query parameters
    const [initiated, setInitiated] = useState(false);
    const [selectedBox, setSelectedBox] = useState("");
    const [skipTake, setSkipTake] = useState({ take: 0, skip: -1 });

    const [avatar, setAvatar] = useState(null);

    // set avater id to redux state
    const dispatch = useDispatch();


    function useQuery() {
        return new URLSearchParams(useLocation().search);
    }

    const getAvatarInfo = async () => {
        try {
            const res = await postRequest(AVTAR.EDIT, { "id": avatarId });
            if (res.data.data) {
                const avater = res.data.data;
                if (
                    avater.avatarCategoryEnum === 0 ||
                    avater.avatarCategoryEnum === 2
                ) {
                    // setAvaterInfo(res.data.data);
                    dispatch(setAvatarInfo(res.data.data));
                } else {
                    toast.error("You need to login for chat");

                    // setAvaterInfo(res.data.data); // this is for test
                    dispatch(setAvatarInfo(res.data.data)); // this is for test
                    throw new Error("For this avater you need authentication");
                }

                const { name, images = [], personalDetailDto = {}, avatarCategoryEnum } = res.data.data;
                const [{ imageBlobUrl }] = images.filter((image) => image.isProfile);
                const {
                    businessName = "",
                    logoImageUrl = "/images/avatar-5.jpg",
                    defaultButton = [],
                } = personalDetailDto;

                const actionButtons = defaultButton.filter((item) => AVATAR_CHAT_ACTIONS_BUTTON_TITLE.includes(item.name));
                const actionFeatures = defaultButton.filter((item) => AVATAR_CHAT_ACTIONS_FEATURE.includes(item.name));

                setAvatar({
                    businessName: businessName,
                    businessLogo: logoImageUrl,
                    actionButtons: actionButtons,
                    actionFeatures: actionFeatures,
                    agentName: name,
                    agentImage: imageBlobUrl,
                    avatarCategoryEnum: avatarCategoryEnum
                });
                setInitiated(true);
                dispatch(setAvatarId(avatarId));
            }
        } catch (error) {
            console.error(error);
        }
    }

    // console.log({ avaterInfo });

    useEffect(() => {
        getAvatarInfo();
    }, [])
    return (<React.Fragment>
        <section className="text-center embeded-chatpage-container">
            <div className="helperpage-chatbot-box ">
                {initiated
                    ? <>
                        <div className="chatbot__head">
                            <img
                                src={avatar?.businessLogo}
                                className="agent"
                            />
                            <h6>{avatar?.businessName || ''}</h6>
                        </div>
                        <AvatarChatbotForm
                            avatarId={avatarId}
                            avatar={avatar}
                        />
                    </>
                    : <p>Please wait...</p>
                }
            </div>
        </section>

        {/* <section className="text-center embeded-chatpage-container">
            <div className="">
                <div className="helperpage-chatbot-box ">
                    <div className="chatbot__head">
                        <img src="/images/avatar-5.jpg" className="agent" />
                        <h6>Hi theress</h6>
                    </div>
                    <AvatarChatbotForm avatarId={avatarId} />
                </div>
            </div>
        </section> */}
    </React.Fragment>)
}
export default AvatarChatbotPage