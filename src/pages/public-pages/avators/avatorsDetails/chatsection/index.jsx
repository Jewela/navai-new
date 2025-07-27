import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef } from "react";
import { useState } from "react";
import {
  DEFAULT_VALUE,
  PUBLIC_ROUTES_SLUGS,
  RESPONSE_CODE,
  STORAGE_INDEXES,
} from "../../../../../app/constants";
import { postRequest } from "../../../../../app/httpClient/axiosClient";
import { AVTAR } from "../../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";

import {
  faCirclePlay,
  faHeart as regularFaHeart,
} from "@fortawesome/free-regular-svg-icons";
import {
  faMicrophone,
  faVolumeHigh,
  faHeart as solidFaHeart,
} from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { OverlayTrigger, Spinner, Tooltip } from "react-bootstrap";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { wordsCapping } from "../../../../../utils/helpers/functions";
import { CHAT_ACTIONS } from "../../../../../redux/authenticate/actions";
import { useNavigate } from "react-router-dom";
import RecentVisit from "../../../../../components/HomePage/RecentVisit";
import Recorder from "recorder-js";
import ReactPlayer from "react-player";
import axios from "axios";
import { getToken } from "../../../../../app/Auth";
const validationSchema = yup.object().shape({
  chatQuery: yup.string().required("This field is required"),
});

const DEFAULT_QUEST = [
  "Tell me about yourself",
  "How are you?",
  "Tell me a story from your life",
  "Where are you from?",
];

const CONFIRM_MESSAGE = {
  DELETE: { key: `DELETE`, value: `Delete from Favorite?` },
  ADD: { key: `ADD`, value: `Add to Favorite?` },
};

const CHAT_MODE_TYPE = {
  AUDIO: STORAGE_INDEXES.CHAT_MODE_AUDIO,
  TEXT: STORAGE_INDEXES.CHAT_MODE_TEXT,
};
function ChatSection(props) {
  const {
    avator: { name, image, avatarId, lifeSummary },
  } = { ...defaultProps, ...props };
  const {
    userData: { profileImage, id: userId },
  } = useSelector((state) => state.auth);
  const {
    conversation,
    query_id: conversationqueryId,
    chat_mode,
  } = useSelector((state) => state.avatar_conversation);
  const [activeChatMode, setActiveChatMode] = useState(CHAT_MODE_TYPE.TEXT);

  const [seeMoreBio, setSeemoreBio] = useState(false);
  const [photoSidebarCollapsed, setHandlePhotoSidebarCollapsed] =
    useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [chatQuery, setChatQuery] = useState("");
  const [queryId, setQueryId] = useState(conversationqueryId);
  const [timeSpan, setTimeSpan] = useState(DEFAULT_VALUE.TIMEZONE);
  const [chatDetails, setChatDetails] = useState(conversation);
  const [isFirstSession, setIsFirstSession] = useState(
    chatDetails.length === 0 ? true : false
  );
  const inputRef = useRef();
  const chatNode = useRef();
  const scrollContainerRef = useRef();

  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setProcessing] = useState(false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [avatarAudioResponse, setAvatarAudioResponse] = useState(null);

  let recorder = null;

  const [audioURL, setAudioURL] = useState("");
  const [outputAudioURL, setOutputAudioURL] = useState("");
  const [mediaRecorder, setMediaRecorder] = useState(null);

  const {
    avatarList: favAvatarList = [],
    avatarListIds: favavatarListIds = [],
  } = useSelector((state) => state.favourite_avatar);

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

  const submitChatMessage = async (data) => {
    const { chatQuery } = data;

    dispatch({
      type: CHAT_ACTIONS.UPDATE_CONVERSATION,
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
    // return
    setLoading(true);
    const payloadData = JSON.stringify({
      queryId: queryId,
      avatarId: avatarId,
      timeSpan: timeSpan,
      query: chatQuery,
    });

    try {
      captureUserQuestions({
        userid: userId,
        avatarid: avatarId,
        ques_text: chatQuery,
        date_time: currentTimestamp(),
      });

      const {
        status,
        data: { httpStatusCode },
        data: { data },
      } = await postRequest(
        AVTAR.CHAT_RESPONSE,
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
        if (isError) {
          toast.error(`Sorry, we are facing some technical dificulities.`);
        }

        dispatch({
          type: CHAT_ACTIONS.UPDATE_CONVERSATION,
          payload: {
            conversation: {
              type: "response",
              image: image,
              name: name,
              message: response || ``,
              response: data,
            },
            avatar_id: avatarId,
          },
        });
        dispatch({
          type: CHAT_ACTIONS.UPDATING_QUERY_ID,
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
              image: image,
              name: name,
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

  const captureUserQuestions = async (payload) => {
    return;
    await postRequest(AVTAR.SET_USER_QUESTIOS, payload);
  };

  const ifFavourite = (id = 0) =>
    favavatarListIds.find((avatarId) => avatarId === id);
  const _iffavourite = ifFavourite(avatarId);
  const currentTimestamp = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based, so we add 1
    const day = String(currentDate.getDate()).padStart(2, "0");
    const hours = String(currentDate.getHours()).padStart(2, "0");
    const minutes = String(currentDate.getMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleSeeMoreBio = () => {
    setSeemoreBio(!seeMoreBio);
  };

  const handlePhotoSidebarCollapsed = () => {
    setHandlePhotoSidebarCollapsed(!photoSidebarCollapsed);
  };

  const exitChat = () => {
    navigate(PUBLIC_ROUTES_SLUGS.AVATORS);
  };

  const handleDefaultQues = (question) => {
    setValue("chatQuery", question);
    handleSubmit(submitChatMessage)();
  };

  const handleChangeChatMode = (mode) => {
    // dispatch({
    //     type: CHAT_ACTIONS.CHANGE_CHAT_MODE,
    //     payload: { mode }
    // });
    setActiveChatMode(mode);
  };

  const onChangeaudio = async (event) => {
    // try {
    //     const response = await axios.post(
    //         'https://api.openai.com/v1/audio/speech',
    //         {
    //             input: "Hello how are you",
    //             voice: 'alloy',
    //             // input: 1,
    //             model: "tts-1",
    //         },
    //         {
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             responseType: 'arraybuffer',
    //         }
    //     );

    //     const blob = new Blob([response.data], { type: 'audio/mpeg' });
    //     const audioURL = URL.createObjectURL(blob);
    //     setOutputAudioURL(audioURL);
    //     console.log(`audio url: `, audioURL)
    // } catch (error) {
    //     console.error('Error generating audio:', error);
    // }

    // return;
    console.log(event.target.files[0]);
    const formData = new FormData();
    formData.append("request", event.target.files[0]);
    console.log({ formData });

    const { status, data } = await postRequest(
      `${AVTAR.SPEECH_TO_TEXT}`,
      formData
    );
    console.log({ status, data });
    return false;
    // const arrayBuffer = data;
    // const blob = new Blob([data], { type: 'audio/mp3' });
    // const audioUrl = URL.createObjectURL(blob);
    // new Audio(audioUrl).play();
    // return;

    // console.log(data)
    const blob = new Blob([data], { type: "audio/wav" });
    const audioUrl = URL.createObjectURL(blob);
    console.log(audioUrl);
    // setAudioData(audioUrl);
    setOutputAudioURL(audioUrl);
    // console.log(URL.createObjectURL(event.target.files[0]))

    // audioBufferToWav(data)

    const anchorTag = document.createElement("a");
    const _download = document.createTextNode("download audio");
    anchorTag.setAttribute("href", audioUrl);
    anchorTag.setAttribute("download", audioUrl);
    anchorTag.appendChild(_download);
    document.body.appendChild(anchorTag);
  };

  const [playing, setPlaying] = useState(false);

  const handleMicrophoneInput = async () => {
    setIsRecording(!isRecording);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream);
        setMediaRecorder(recorder);

        const chunks = [];
        recorder.ondataavailable = (e) => chunks.push(e.data);
        recorder.onstop = async () => {
          const blob = new Blob(chunks, { type: "audio/mp3" });
          const audioUrl = URL.createObjectURL(blob);
          setAudioURL(audioUrl);
          setProcessing(true);

          dispatch({
            type: CHAT_ACTIONS.UPDATE_AUDIO_CONVERSATION,
            payload: {
              audio_conversation: {
                type: "query",
                image: profileImage?.imageBlobUrl || null,
                name: "You",
                audio_message: audioUrl,
                response: null,
              },
              avatar_id: avatarId,
            },
          });

          // // Submit audio via API
          const formData = new FormData();
          formData.append("request", blob, "audio.mp3");

          const token = getToken();
          const response = await axios.post(
            `${AVTAR.AUDIO_CHAT_RESPONSE}/${avatarId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
              },
              responseType: "arraybuffer",
            }
          );

          const _blob = new Blob([response.data], { type: "audio/mpeg" });
          const _audioUrl = URL.createObjectURL(_blob);
          dispatch({
            type: CHAT_ACTIONS.UPDATE_AUDIO_CONVERSATION,
            payload: {
              audio_conversation: {
                type: "response",
                image: image,
                name: name,
                message: _audioUrl || ``,
                response: null,
              },
              avatar_id: avatarId,
            },
          });
          setAvatarAudioResponse(_audioUrl);
          setPlaying(true);
          setProcessing(false);
          setSpeaking(true);
        };
        recorder.start();
      })
      .catch((err) => {
        console.error("Error accessing microphone:", err);
      });
  };

  const audioEnded = () => {
    // toast(`audio ended`);
    setSpeaking(false);
    setProcessing(false);
    setPlaying(false);
  };

  const stopRecording = async () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setIsRecording(false);
      setPlaying(false);
    }
  };
  const handleTextToSpeech = async () => {
    try {
      const formData = {
        text: "We got this baby",
      };
      // try {
      //     const response = await axios.post(
      //         'https://api.openai.com/v1/audio/speech',
      //         {
      //             input: "Hello how are you",
      //             voice: 'alloy',
      //             // input: 1,
      //             model: "tts-1",
      //         },
      //         {
      //             headers: {
      //                 'Content-Type': 'application/json',

      //             },
      //             responseType: 'arraybuffer',
      //         }
      //     );
      //     console.log(response)
      //     const blob = new Blob([response.data], { type: 'audio/mp3' });
      //     const audioURL = URL.createObjectURL(blob);
      //     setOutputAudioURL(audioURL);
      //     console.log(`audio url: `, audioURL)
      // } catch (error) {
      //     console.error('Error generating audio:', error);
      // }
      // return;
      // const { status, data: response } = await postRequest(`${AVTAR.TEXT_TO_SPEECH}`, formData);
      const response = await axios.post(`${AVTAR.TEXT_TO_SPEECH}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      });
      console.log(response);
      // console.log(response);

      // const blob = new Blob([data], { type: 'audio/mpeg' });
      // const audioURL = URL.createObjectURL(blob);
      // console.log(audioURL);
      console.log(
        "======================================================================="
      );
      // console.log(response.arraybuffer());
      // initAudio(response)
      // const arrayBuffer = await response.blob();
      const blob = new Blob([response.data], { type: "audio/mp3" });
      const audioUrl = URL.createObjectURL(blob);
      console.log(audioUrl);
      // const audio = new Audio(audioUrl);
      // audio.play();
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("handle text to speech:", error);
      toast.error(errorMessage);
    }
  };
  const handleSpeakerOutput = () => {
    setSpeaking(!isSpeaking);
  };

  useEffect(() => {
    scrollContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
    setChatDetails(conversation);
  }, [conversation]);

  return (
    <>
      <div className="col-md-9">
        <div className="outline-box">
          <div className="chatbot">
            <div className="chatbot__header">
              <div className="d-flex">
                <img src={image ? image : "/images/avator-4.jpg"} />
              </div>
              <div className="chat__loggeduser">
                <h4 className="font-weight-bold m-0">{name}</h4>
                {lifeSummary && lifeSummary.length >= 150 && !seeMoreBio ? (
                  <>
                    <p className="mb-0">
                      <span>{wordsCapping(lifeSummary, 150)}</span>
                      <span
                        className="mx-2 text-highlight fw-bold"
                        onClick={handleSeeMoreBio}
                        role="button"
                      >
                        See more
                      </span>
                    </p>
                  </>
                ) : (
                  <p className="mb-0">
                    <span>{lifeSummary}</span>
                    {lifeSummary && lifeSummary.length >= 150 && seeMoreBio && (
                      <span
                        className="mx-2 text-highlight fw-bold"
                        onClick={handleSeeMoreBio}
                        role="button"
                      >
                        See less
                      </span>
                    )}
                  </p>
                )}
              </div>

              <div className="exist-chat d-flex gap-2 align-items-center">
                <span
                  role="button"
                  className="exit-btn btn primary-btn btn-sm"
                  onClick={exitChat}
                >
                  <i className="ri-chat-1-line"></i> Exit Chat
                </span>

                <span
                  onClick={() => handleChangeChatMode(CHAT_MODE_TYPE.TEXT)}
                  className={`chat-opt bg-danger ${chat_mode === CHAT_MODE_TYPE.TEXT && "border"
                    }`}
                  role="button"
                >
                  <i className="ri-chat-1-line"></i>
                </span>
                <span
                  onClick={() => handleChangeChatMode(CHAT_MODE_TYPE.AUDIO)}
                  className={`chat-opt light-bg ${chat_mode === CHAT_MODE_TYPE.AUDIO && "border"
                    }`}
                  role="button"
                >
                  <i className="ri-mic-fill"></i>
                </span>
              </div>
            </div>

            <div className="chat__inner">
              {activeChatMode === CHAT_MODE_TYPE.AUDIO && (
                <>
                  <div className="voice-chat d-flex gap-5 justify-content-center mb-4 pt-4">
                    <div
                      className={`voice-chat__user col-6 text-center position-relative ${isRecording && "opacity-p5"
                        }`}
                    >
                      <div className="voice-chat__headshot">
                        <img src={image ? image : "/images/avator-4.jpg"} />
                        <span className={isSpeaking ? "color-speaking" : ""}>
                          <FontAwesomeIcon
                            size="2x"
                            icon={faVolumeHigh}
                            fade={isSpeaking}
                          />
                        </span>
                        {/*<span role="button" onClick={() => setPlaying(true)}>
                                            <FontAwesomeIcon size="2x" icon={faCirclePlay} fade={isSpeaking} />
                                        </span>
                                        {/* <FontAwesomeIcon icon={faVolumeHigh} beatFade /> */}
                      </div>
                      <span className="h6">{name}</span>
                      {isProcessing && (
                        <div className="avatar-specific-loader">
                          <Spinner
                            className="loadmore-btn"
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className={`voice-chat__user col-6 text-center position-relative ${isProcessing && "opacity-p5"
                        }`}
                    >
                      <div className="voice-chat__headshot">
                        <img
                          src={
                            profileImage
                              ? profileImage?.imageBlobUrl
                              : "/images/avator-4.jpg"
                          }
                        />
                        <span
                          onClick={
                            isRecording ? stopRecording : handleMicrophoneInput
                          }
                          className={isRecording ? "color-recording" : ""}
                          role="button"
                        >
                          <FontAwesomeIcon
                            size="2x"
                            icon={faMicrophone}
                            fade={isRecording}
                          />
                          {/* <input type="file" onChange={onChangeaudio} /> */}
                        </span>
                        {/* <p>{audioURL}</p> */}
                      </div>
                      <span className="h6">You</span>
                      {/* {
                                        avatarAudioResponse 
                                    } */}
                      {/* {JSON.stringify({ playing })} */}
                      <ReactPlayer
                        className="audio-response-player position-absolute w-0"
                        url={avatarAudioResponse}
                        playing={playing}
                        onEnded={audioEnded}
                      />
                      {/* {outputAudioURL} */}
                      {/* <audio src={outputAudioURL} controls /> */}

                      {isSpeaking && (
                        <div className="avatar-specific-loader">
                          <Spinner
                            className="loadmore-btn"
                            as="span"
                            animation="border"
                            size="lg"
                            role="status"
                            aria-hidden="true"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}

              {activeChatMode === CHAT_MODE_TYPE.TEXT && (
                <>
                  <div className="chatbot__default pt-3">
                    {chatDetails.length === 0 && !isLoading && (
                      <>
                        <p>
                          How can I assist you?
                          <br />
                          I'm here to help with your brainstorming session,
                          providing guidance to organize your thoughts. Remember
                          to double-check before acting on any advice I offer,
                          as it may not always be spot-on.
                        </p>
                        {/* <div className="chatbot__default--message">
                                        {DEFAULT_QUEST.map((question, index) => {
                                            return <React.Fragment key={index}>
                                                <span onClick={() => handleDefaultQues(question)} role="button">{question}</span>
                                            </React.Fragment>
                                        })}
                                    </div> */}
                      </>
                    )}

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
                                  style={{
                                    color: "#808ce3",
                                    fontSize: "2.5em",
                                  }}
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
                      })}
                    {isLoading && (
                      <div className="mx-2 chatlist-header chatbot__header">
                        <img
                          src={image}
                          style={{ width: "2.5em", height: "2.5em" }}
                        />
                        <div className="chatlist-item">
                          <div className="">
                            <strong>{name}</strong>:
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
                    <div ref={scrollContainerRef}></div>
                  </div>

                  <div className="chatbot__input my-4">
                    <div className="position-relative">
                      <form onSubmit={handleSubmit(submitChatMessage)}>
                        <input
                          {...register("chatQuery")}
                          type="text"
                          className="chatbot_input"
                          placeholder="Ask question..."
                          autoComplete="off"
                        />

                        <button className="btn" type="submit">
                          <span>
                            <i className="ri-send-plane-2-line"></i>
                          </span>
                        </button>
                      </form>
                    </div>
                    {errors.chatQuery && (
                      <p className="text-error">{errors.chatQuery.message}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <RecentVisit />
    </>
  );
}
export default ChatSection;
const defaultProps = {
  avator: { name: null, image: null, avatarId: 0, lifeSummary: null },
};
