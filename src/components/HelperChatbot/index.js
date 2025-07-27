import React, { useEffect, useState } from "react";
import ChatbotForm from "./ChatbotForm";
import { useSelector } from "react-redux";

function HelperChatbot({ setSelectedBox, selectedBox, setSkipTake, skipTake }) {
  const [isOpen, setOpen] = useState(false);
  const [chatWithus, setChatWithus] = useState(false);
  const popupToggle = useSelector((state) => state.avater_id.popupToggle);
  const avaterInfo = useSelector((state) => state.avater_id.avaterInfo);

  const toggleChatbot = (status) => {
    setOpen(status);
    if (!status) {
      setChatWithus(false);
    }
  };

  // useEffect(() => {
  //   setOpen(popupToggle);
  // }, [popupToggle]);

  useEffect(() => {
    const { Avatarid = 0 } = avaterInfo;
    if (location.pathname.includes("aichat") || location.pathname.includes("playground")) {
      if (Avatarid) {
        setOpen(true);
      }
    }
  }, [avaterInfo]);

  return (
    <React.Fragment>
      {isOpen ? (
        <div className="chatbot-box">
          <i
            className="ri-close-circle-fill close-icon"
            role="button"
            onClick={() => {
              toggleChatbot(false);
              setSelectedBox("");
            }}
          ></i>
          <div
            className="chatbot__head"
            style={{ justifyContent: "space-between" }}
          >
            <div>
              <img
                src={
                  avaterInfo?.personalDetailDto?.logoImageUrl
                    ? avaterInfo?.personalDetailDto?.logoImageUrl
                    : "/images/avatar-5.jpg"
                }
                className="agent"
              />
            </div>
            <div className="chat_bot_className">
              <h6>
                {avaterInfo?.personalDetailDto?.businessName
                  ? avaterInfo?.personalDetailDto?.businessName
                  : avaterInfo?.name}
              </h6>
            </div>
          </div>

          <ChatbotForm
            setSelectedBox={setSelectedBox}
            setSkipTake={setSkipTake}
            skipTake={skipTake}
            selectedBox={selectedBox}
            avatarImage={
              avaterInfo?.personalDetailDto?.logoImageUrl
                ? avaterInfo?.personalDetailDto?.logoImageUrl
                : "/images/avatar-5.jpg"
            }
          />
        </div>
      ) : (
        <div
          className="chatbot-icon"
          role="button"
          onClick={() => toggleChatbot(true)}
        >
          <i className="ri-question-answer-line"></i>
        </div>
      )}
    </React.Fragment>
  );
}
export default HelperChatbot;
