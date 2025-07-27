import React, { useEffect, useState } from "react";
import ChatbotForm from "./ChatbotForm";
import { useSelector } from "react-redux";

function EmbededChatbot() {
  const [isOpen, setOpen] = useState(false);
  const [chatWithus, setChatWithus] = useState(false);
  const popupToggle = useSelector((state) => state.avater_id.popupToggle);
  const avaterInfo = useSelector((state) => state.avater_id.avaterInfo);

  const ToggleChatbot = (status) => {
    setOpen(status);
    if (!status) {
      setChatWithus(false);
    }
  };

  useEffect(() => {
    setOpen(popupToggle);
  }, [popupToggle]);

  return (
    <React.Fragment>
      {isOpen ? (
        <div className="chatbot-box">
          <i
            className="ri-close-circle-fill close-icon"
            role="button"
            onClick={() => ToggleChatbot(false)}
          ></i>
          <div
            className="chatbot__head dasdas"
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
                  : "Hi there"}
              </h6>
            </div>
          </div>

          <ChatbotForm />
        </div>
      ) : (
        <div
          className="chatbot-icon"
          role="button"
          onClick={() => ToggleChatbot(true)}
        >
          <i className="ri-question-answer-line"></i>
        </div>
      )}
    </React.Fragment>
  );
}
export default EmbededChatbot;
