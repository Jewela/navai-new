import React from "react";
import "./ChatbotBox.css";
import { useSelector } from "react-redux";

const ChatbotBox = ({ selectedBox, setSkipTake, skipTake }) => {
  const { chatbotListing } = useSelector((s) => s.auth);
  const all = chatbotListing?.filter((v) => v.subject == selectedBox);

  return (
    <>
      <div className="listing chatbot-data-box">
        {all?.length ? (
          all?.map((v) => (
            <div key={v.id} className="listing-item">
              <img src={v.imageBlobUrl} alt={v.title} />
              <div className="listing-info">
                {/* <span className="certified">Certified</span> */}
                <h2>{v.title}</h2>
                {/* <p className="price">{v.description}</p> */}
                <p className="details">{v.description}</p>
                {/* <p className="mileage">{v.mileage}</p> */}
              </div>
            </div>
          ))
        ) : (
          <p
            style={{
              top: "50%",
              position: "absolute",
              left: "37%",
            }}
          >
            No data found
          </p>
        )}
        <p
          className="cus"
          style={{
            cursor: "pointer",
            color:
              chatbotListing?.length == 0 || all?.length < 4 ? "gray" : "blue",
            textAlign: "center",
            top: "100%",
            left: "37%",
            position: "sticky",
            background: "white",
            pointerEvents: chatbotListing?.length == 0 ? "none" : "unset",
          }}
          onClick={() => {
            if (all.length <= 4) setSkipTake?.({ skip: 10, take: 10 });
          }}
        >
          Load more...
        </p>
      </div>
    </>
  );
};

export default ChatbotBox;
