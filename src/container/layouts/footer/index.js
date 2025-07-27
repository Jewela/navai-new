import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./footer.css";
import HelperChatbot from "../../../components/HelperChatbot";
import { AUTH_ROUTE_SLUGS, AVATAR_CHAT_ACTIONS_BUTTON_TITLE, AVATAR_CHAT_ACTIONS_FEATURE, HELPER_CHATBOT_AVATAR_ID, PUBLIC_ROUTES_SLUGS } from "../../../app/constants";
import ChatbotBox from "../../../components/ChatbotBox";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../app/config/endpoints";
import { useDispatch, useSelector } from "react-redux";
import { setAvatarId, setAvatarInfo } from "../../../redux/avatarIdReducer/avatarIdSlice";
import toast from "react-hot-toast";
const ingoredRoutes = [
  PUBLIC_ROUTES_SLUGS.HELPER_CHATBOT,
  PUBLIC_ROUTES_SLUGS.EMBEDED_CHATBOT,
  PUBLIC_ROUTES_SLUGS.AICHAT,
  AUTH_ROUTE_SLUGS.PLAYGROUND
];

function Footer(props) {
  const location = useLocation();
  const [selectedBox, setSelectedBox] = useState("");
  const [skipTake, setSkipTake] = useState({ take: 0, skip: -1 });
  const [initiated, setInitiated] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const { avaterInfo: { Avatarid = 0 } = {} } = useSelector((state) => state.avater_id);

  const dispatch = useDispatch();
  if (PUBLIC_ROUTES_SLUGS.AVATAR_CHATBOT === location.pathname) {
    return null
  }

  const getAvatarInfo = async () => {
    try {
      const res = await postRequest(AVTAR.EDIT, { "id": HELPER_CHATBOT_AVATAR_ID });
      if (res.data.data) {
        const avater = res.data.data;
        // commenting becuser avatar getting auth error. (you much login to chat)
        if (
          avater.avatarTypeEnum === 0 ||
          avater.avatarTypeEnum === 2
        ) {
          // setAvaterInfo(res.data.data);
          dispatch(setAvatarInfo(res.data.data));
        } else {
          toast.error("You need to login for chat");

          // setAvaterInfo(res.data.data); // this is for test
          dispatch(setAvatarInfo(res.data.data)); // this is for test
          throw new Error("For this avater you need authentication");
        }

        // dispatch(setAvatarInfo(res.data.data));
        const { name, images = [], personalDetailDto = {} } = res.data.data;
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
          agentImage: imageBlobUrl
        })
        setInitiated(true);
        dispatch(setAvatarId(HELPER_CHATBOT_AVATAR_ID));
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (!location.pathname.includes("aichat") && !location.pathname.includes("playground") && Avatarid !== HELPER_CHATBOT_AVATAR_ID) {
      getAvatarInfo();
    }
  }, [location.pathname])

  return (
    <>
      <footer className="spacer-lg">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto text-white text-center">
              <div className="footer__content">
                <Link className="navbar-brand" to="/">
                  <img src="/images/logo.png" alt="logo" />
                </Link>
                <div>&copy;2024 NavAI. All Rights Reserved - {selectedBox}</div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {!ingoredRoutes.includes(location.pathname) && (
        <>
          {selectedBox && (
            <ChatbotBox
              selectedBox={selectedBox}
              setSkipTake={setSkipTake}
              skipTake={skipTake}
            />
          )}
          <HelperChatbot
            setSkipTake={setSkipTake}
            skipTake={skipTake}
            selectedBox={selectedBox}
            setSelectedBox={setSelectedBox}
          />
        </>
      )}
    </>
  );
}

export default Footer;
