import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { DEFAULT_VALUE, RESPONSE_CODE } from "../../app/constants";
import actions, { CHAT_ACTIONS, HELPER_CHAT_ACTIONS } from "../../redux/authenticate/actions";
import { postRequest } from "../../app/httpClient/axiosClient";
import { Spinner } from "react-bootstrap";
import { getErrorMessage } from "../../utils/helpers/apiErrorResponse";
import { AVTAR } from "../../app/config/endpoints";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { setIsFocuse } from "../../redux/avatarIdReducer/avatarIdSlice";
import { FiSend } from "react-icons/fi";

import "./ChatbotForm.css";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getChatBotUrl } from "../../utils/helpers/functions";

const validationSchema = yup.object().shape({
  chatQuery: yup.string().required("This field is required"),
});
//const avatarId = 220;

function ChatbotForm({ selectedBox, setSelectedBox, skipTake, setSkipTake, avatarImage = '/images/avatar-5.jpg' }) {
  const avatarId = useSelector((state) => state.avater_id.avatarId);
  const avaterInfo = useSelector((state) => state.avater_id.avaterInfo);
  const chatInputValue = useSelector((state) => state.avater_id.chatInputValue);
  const popupToggle = useSelector((state) => state.avater_id.popupToggle);
  // const [startChat, setStartChat] = useState(false);

  const { pathname, state } = useLocation();
  const dispatch = useDispatch();
  const {
    userData: { profileImage, id: userId },
    chatbotData = [],
  } = useSelector((state) => state.auth);
  const { avaterInfo: { avatarCategoryEnum = -1 } = {} } = useSelector((state) => state.avater_id);
  const { conversation, query_id: conversationqueryId, chat_mode } = useSelector((state) => state.helper_avatar_conversation);
  const scrollContainerRef = useRef();

  const [isLoading, setLoading] = useState(false);
  const formRef = useRef();
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
    reset,
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
      toast.error("Invlaid avatar category enum. Please try again.")
      return false;
    }
    // return false;
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
    // return false;
    try {
      const {
        status,
        data: { httpStatusCode },
        data: { data },
      } = await postRequest(
        // AVTAR.CHAT_RESPONSE,
        __URL,
        payloadData,
        true,
        isFirstSession
      );
      if (
        status === RESPONSE_CODE[200] &&
        httpStatusCode === RESPONSE_CODE[200]
      ) {
        const { queryId, response, avatarId, error, isError } = data;
        setQueryId(queryId);
        dispatch(setIsFocuse(true));

        if (isError) {
          toast.error(`Sorry, we are facing some technical dificulities.`);
        }

        dispatch({
          type: HELPER_CHAT_ACTIONS.HELPER_UPDATE_CONVERSATION,
          payload: {
            conversation: {
              type: "response",
              image: avatarImage,
              name: "Navai",
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
      if (error?.response?.data?.data === null) {
        dispatch({
          type: CHAT_ACTIONS.UPDATE_CONVERSATION,
          payload: {
            conversation: {
              type: "response",
              image: null,
              name: "name",
              message: `We are having some technical difficulty, please ask another question.`,
              response: {},
            },
            avatar_id: avatarId,
          },
        });
        dispatch({
          type: CHAT_ACTIONS.UPDATING_QUERY_ID,
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      formRef.current.click();
      return false;
    }
  };

  useEffect(() => {
    scrollContainerRef.current?.scrollIntoView({ behavior: "smooth" });
    setChatDetails(conversation);
  }, [conversation]);

  const [requestAction, setRequestAction] = useState({
    status: false,
    actionName: "",
    actionValue: null,
  });
  const [email, setEmail] = useState("");

  const getavatarmedia = async () => {
    try {
      const res = await postRequest(AVTAR.GET_AVATAR_MEDIA, {
        // take: 10,
        // skip: 0,
        ...skipTake,
        filter: {
          logic: "and",
          filters: [
            {
              field: "avatarId",
              operator: "eq",
              value: avatarId,
            },
            {
              field: "mediaCategory",
              operator: "eq",
              value: 0,
            },
          ],
        },
      });
      dispatch({
        type: actions.CHATBOT_LISTING,
        payload: { chatbotListing: res.data?.result.data },
      });
    } catch (error) {
      console.log("er1", error);
    }
  };
  async function handleSubmitEmail() {
    try {
      if (email) {
        const res = await axios.get(`${AVTAR.CHAT_EMAIL_CAPTURE}/${email}`);
        setEmail("");
        setRequestAction({ status: false, actionName: "", actionValue: null });
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (avaterInfo?.personalDetailDto) {
      dispatch({
        type: actions.CHATBOT_DATA,
        payload: { chatbotData: avaterInfo?.personalDetailDto?.defaultButton },
      });
    }

    if (skipTake.take >= 10) getavatarmedia();
  }, [skipTake]);

  return (
    <>
      <div className="chatboat-box-field">
        <div className="auto-scroll   ">
          <div style={{ marginLeft: "17px" }} className="d-block  my-3 ">
            {avaterInfo?.personalDetailDto?.defaultButton
              .filter((v) => ["RequestDemo", "ContactSale"].includes(v.name))
              ?.map((button) => {
                return (
                  <div key={button?.name} className="m-2">
                    <button
                      onClick={() =>
                        setRequestAction({
                          status: true,
                          actionName: button?.demoActions[0]?.name,
                          actionValue: button?.demoActions[0]?.value,
                        })
                      }
                      className="chat_bot_requestAction"
                    >
                      {button?.name}
                    </button>
                  </div>
                );
              })}
          </div>
          <div
            className={`${requestAction?.actionName === "Popup" ? "d-block " : "d-none "
              } my-3`}
          >
            <div
              style={{
                borderBottom: "1px solid #f1f1f1",
                paddingBottom: "10px",
                display: "flex",
                justifyContent: "center",
              }}
              className="chat_bot_input_popup_wrapper position-relative   "
            >
              <div>
                <input
                  onChange={(e) => setEmail(e.target.value)}
                  value={email}
                  type="email"
                  className="chat_bot_input_popup"
                  placeholder="Email"
                  style={{ marginLeft: "-35px" }}
                />
                <button
                  onClick={handleSubmitEmail}
                  className="chat_bot_input_popup_button"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
          <div
            style={{
              borderBottom: "1px solid #f1f1f1",
              paddingBottom: "10px",
            }}
            className={`${requestAction?.actionName === "Url" ? "d-block " : "d-none "
              } my-3  `}
          >
            <div className="chat_bot_input_popup_wrapper  ">
              <div style={{ marginLeft: "25px" }}>
                <a
                  className="text-decoration-underline text-sm "
                  href={"https://" + requestAction?.actionValue}
                  target="_blank"
                // rel={"external"}
                >
                  {requestAction?.actionValue}
                </a>
              </div>
            </div>
          </div>
          <div>
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
                          <strong>
                            {chatItem?.name === "You"
                              ? "You"
                              : avaterInfo?.name}
                          </strong>
                          :
                        </div>
                        <p className="mb-0">{chatItem?.message}</p>
                      </div>
                    </div>
                  </React.Fragment>
                );
              })}
          </div>

          <div ref={scrollContainerRef} />
          {isLoading && (
            <div className="mx-2 chatlist-header chatbot__header">
              <img src={avatarImage} style={{ width: '2.5em', height: '2.5em' }} />
              <div className="chatlist-item">
                <div className="">
                  <strong>
                    {avaterInfo?.name ? avaterInfo?.name : "Navai"}
                  </strong>
                  :
                </div>
                <Spinner
                  className="my-2 gradient-style chat-loading"
                  as="span"
                  animation="grow"
                  size="md"
                  role="status"
                  aria-hidden="true"
                />
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit(submitChatMessage)}
          className="position-relative"
          style={{ bottom: 5 }}
        >
          <div className="d-flex flex-row ">
            <div className="flex-fill">
              {/* <input
                {...register("chatQuery")}
                className="form-control chatbot_input"
                type="text"
                placeholder="Ask question..."
                autoComplete="off"
                readOnly={isLoading}
                autoFocus
              /> */}
              <textarea
                rows={1}
                {...register("chatQuery")}
                onKeyDown={handleKeyDown}
                className="form-control chatbot_input dsdadad"
                type="text"
                placeholder="Ask question..."
                autoComplete="off"
                readOnly={isLoading}
                autoFocus
              >

              </textarea>

            </div>
            <div className="flex-fill">
              <span className="chat-icon">
                <button ref={formRef} disabled={isLoading} className="btn btn-none" type="submit">
                  <i className="ri-send-plane-2-fill"></i>
                </button>
              </span>
            </div>
          </div>
          {errors.chatQuery && (
            <p className="text-error">{errors.chatQuery.message}</p>
          )}

          {/* {(pathname.includes("aichat") || pathname.includes("playground")) && ( */}
          <div className="d-flex flex-row">
            {[
              { text: "Meet The Team", image: "/images/team.svg" },
              { text: "Products", image: "/images/products.svg" },
              { text: "Testimonials", image: "/images/testimonials.png" },
              { text: "Screenshots", image: "/images/screenshots.svg" },
            ]
              .filter((v) =>
                [...chatbotData].map((v) => v.name).includes(v.text)
              )
              .map((v) => (
                <div key={v.text} className="image-container">
                  <img
                    src={v.image}
                    alt={v.text}
                    key={v.text}
                    title={v.text}
                    onClick={() => {
                      if (selectedBox == v.text) {
                        setSkipTake({
                          skip: -1,
                          take: 0,
                        });
                      } else {
                        setSkipTake({
                          skip: 0,
                          take: 10,
                        });
                      }
                      setSelectedBox(selectedBox == v.text ? "" : v.text);
                    }}
                    className="icons-chatbot"
                  />
                </div>
              ))}
          </div>
          {/* )} */}
        </form>
      </div>
    </>
  );
}
export default ChatbotForm;
