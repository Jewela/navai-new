import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_VALUE, RESPONSE_CODE } from "../../app/constants";
import { HELPER_CHAT_ACTIONS } from "../../redux/authenticate/actions";
import { postRequest } from "../../app/httpClient/axiosClient";
import { Spinner } from "react-bootstrap";
import { getErrorMessage } from "../../utils/helpers/apiErrorResponse";
import { AVTAR } from "../../app/config/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { setIsFocuse } from "../../redux/avatarIdReducer/avatarIdSlice";
import { RESPONSE_MESSAGES } from "../../app/constants/localizedStrings";
import toast from "react-hot-toast";
import ChatLoader from "./ChatLoader";
import RequestActions from "./RequestActions";
import RequestFeatures from "./RequestFeatures";
import { getChatBotUrl } from "../../utils/helpers/functions";

const validationSchema = yup.object().shape({
  chatQuery: yup.string().required("This field is required"),
});

function AvatarChatbotForm(props) {
  const { avatarId = 0, avatar: { agentName, agentImage, actionButtons = [], actionFeatures = [], avatarCategoryEnum = -1 } } = props;
  const chatInputValue = useSelector((state) => state.avater_id.chatInputValue);
  const popupToggle = useSelector((state) => state.avater_id.popupToggle);
  const [startChat, setStartChat] = useState(false);

  const dispatch = useDispatch();
  const { userData: { profileImage } } = useSelector((state) => state.auth);
  const {
    conversation,
    query_id: conversationqueryId,
    chat_mode,
  } = useSelector((state) => state.helper_avatar_conversation);
  const scrollContainerRef = useRef();

  const [isLoading, setLoading] = useState(false);
  const [queryId, setQueryId] = useState(conversationqueryId);
  const [timeSpan, setTimeSpan] = useState(DEFAULT_VALUE.TIMEZONE);
  const [chatDetails, setChatDetails] = useState(conversation);
  const [isFirstSession, setIsFirstSession] = useState(
    chatDetails.length === 0 ? true : false
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    reset,
    trigger,
  } = useForm({
    mode: "submit",
    resolver: yupResolver(validationSchema),
  });

  // auto set text if text come from aichat page
  useEffect(() => {
    if (popupToggle) {
      if (chatInputValue.length > 0) {
        submitChatMessage({ chatQuery: chatInputValue });
      }
    }
  }, [popupToggle, chatInputValue]);

  const submitChatMessage = async (data) => {
    const { chatQuery } = data;
    const __URL = getChatBotUrl(avatarCategoryEnum, AVTAR.CHAT_HELPER_RESPONSE, AVTAR.CHAT_BOT_RESPONSE);
    if (__URL === null) {
      toast.error("Invalid avatar category!")
      return false;
    }
    scrollContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });

    dispatch({
      type: HELPER_CHAT_ACTIONS.HELPER_UPDATE_CONVERSATION,
      payload: {
        conversation: {
          type: "query",
          image: profileImage?.imageBlobUrl || null,
          name: "You",
          message: chatQuery,
          response: null,
        },
        avatar_id: avatarId,
      },
    });

    reset();
    setLoading(true);

    const payloadData = JSON.stringify({
      queryId: queryId,
      avatarId: avatarId,
      timeSpan: timeSpan,
      query: chatQuery,
    });

    try {
      const { status, data: { httpStatusCode }, data: { data } } = await postRequest(__URL, payloadData, true, isFirstSession);
      if (
        status === RESPONSE_CODE[200] &&
        httpStatusCode === RESPONSE_CODE[200]
      ) {
        const { queryId, response, avatarId, error, isError } = data;
        setQueryId(queryId);
        // dispatch(setIsFocuse(true));

        if (isError) {
          toast.error(`Sorry, we are facing some technical dificulities.`);
        }

        dispatch({
          type: HELPER_CHAT_ACTIONS.HELPER_UPDATE_CONVERSATION,
          payload: {
            conversation: {
              type: "response",
              image: agentImage,
              name: agentName,
              message: response || ``,
              response: data,
            },
            avatar_id: avatarId,
          },
        });
        dispatch({
          type: HELPER_CHAT_ACTIONS.HELPER_UPDATING_QUERY_ID,
          payload: { query_id: queryId },
        });
        setLoading(false);
        setIsFirstSession(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('we are in error case: ', error)

      if (error?.response?.data.friendyMessageList[0] === RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].AVATAR_NOT_EXIST) {
        console.log("here we got now");
        toast.error(`Invalid avatar.`);
        setLoading(false);
        setQueryId(0);
        return false;
      }

      if (error?.response?.data?.data === null) {
        dispatch({
          type: HELPER_CHAT_ACTIONS.UPDATE_CONVERSATION,
          payload: {
            conversation: {
              type: "response",
              image: "/images/navai-logo.png",
              name: "name",
              message: `We are having some technical difficulty, please ask another question.`,
              response: {},
            },
            avatar_id: avatarId,
          },
        });
        dispatch({
          type: HELPER_CHAT_ACTIONS.UPDATING_QUERY_ID,
          payload: { query_id: 0 },
        });
        setLoading(false);
        setIsFirstSession(false);
        setQueryId(0);
        toast.error(
          `We are having some technical difficulty, please ask another question.`
        );
        return;
      }

      const errorMessage = getErrorMessage(error);
      setLoading(false);
      setQueryId(0);
    }
    return false;
  };

  useEffect(() => {
    scrollContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    setChatDetails(conversation);
  }, [conversation]);

  return (
    <>
      <div className="chatboat-box-field">
        <div className="auto-scroll">
          {actionButtons.length > 0 &&
            <RequestActions actionButtons={actionButtons} />
          }
          {chatDetails.length > 0 &&
            chatDetails.map((chatItem, index) => {
              return (
                <React.Fragment key={`chatlist-key-${index}`}>
                  <div className="mx-2 chatlist-header chatbot__header py-1 mb-3">
                    {chatItem?.image !== null ? (
                      <img
                        src={chatItem?.image}
                        className=""
                        style={{ width: "2.5em", height: "2.5em" }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        size="xs"
                        icon={faCircleUser}
                        style={{ color: "#808ce3", fontSize: "2.5em" }}
                      />
                    )}
                    <div className="chatlist-item">
                      <div className="">
                        <strong>{chatItem?.name}</strong>:
                      </div>
                      <p className="mb-0">{chatItem?.message}</p>
                    </div>
                  </div>
                </React.Fragment>
              );
            })
          }
          <div ref={scrollContainerRef} />
          {isLoading && <ChatLoader agentImage={agentImage} agentName={agentName} />}
        </div>
        <form
          onSubmit={handleSubmit(submitChatMessage)}
          className="position-relative"
        >
          <input
            {...register("chatQuery")}
            className="form-control chatbot_input"
            type="text"
            placeholder="Ask question..."
            autoComplete="off"
            readOnly={isLoading}
            autoFocus
          />

          <span className="chat-icon">
            <button disabled={isLoading} className="btn btn-none" type="submit">
              <i className="ri-send-plane-2-fill"></i>
            </button>
          </span>
          {errors.chatQuery && (
            <p className="text-error">{errors.chatQuery.message}</p>
          )}
        </form>

        {actionFeatures.length > 0 &&
          <RequestFeatures actionFeatures={actionFeatures} avatarId={avatarId} />
        }
      </div>
    </>
  );
}
export default AvatarChatbotForm;
