import { useEffect, useRef, useState } from "react";
import styles from "./css/aichat.module.css";
import axios from "axios";
import AVATER, {
  BASEURL,
  PREFIX,
} from "../../../../app/config/endpoints/index";
import { useSelector } from "react-redux";
const AiChatPanel = ({
  avaterid,
  avaterInfo,
  setInputValue,
  handleSubmit,
  inputValue,
}) => {
  const mainRef = useRef(null);
  const inputRef = useRef(null);
  const [isClicked, setIsClicked] = useState(0);
  const isFocuse = useSelector((state) => state.avater_id.isFocus);
  const handleFullScreen = () => {
    if (mainRef.current && mainRef.current.requestFullscreen) {
      mainRef.current.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
        );
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      handleFullScreen();
    }, 500);
  }, []);

  const handleClose = () => {
    if (document.exitFullscreen) {
      document
        .exitFullscreen()
        .then(() => {
          window.close();
        })
        .catch((err) => {
          console.error(
            `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
          );
        });
    } else {
      window.close();
    }
  };

  useEffect(() => {
    if (isFocuse) {
      inputRef.current.focus();
    }
  }, [isFocuse]);

  return (
    <label
      htmlFor="fullscreen_xm45btn"
      ref={mainRef}
      className={styles.mainContainer}
      style={{
        backgroundImage: `url(${
          avaterInfo?.personalDetailDto?.backgroundImage?.imageBlobUrl
            ? avaterInfo?.personalDetailDto?.backgroundImage?.imageBlobUrl
            : "/images/chatbg.png"
        })`,
        backgroundPosition: "center center",
        backgroundSize: "cover",
        backgroundRepeat: "repeat",
        objectFit: "cover",
      }}
    >
      <div className={`${styles.contentContainer}`}>
        <h1 className={`${styles.heading}`}>
          {avaterInfo === null
            ? "Loading..."
            : avaterInfo?.personalDetailDto?.businessName
            ? avaterInfo?.personalDetailDto?.businessName
            : "AI Agent"}
        </h1>
        <div className={`${styles.profileContainer}`}>
          <div className={styles.profileImageContainer}>
            <img
              src={
                avaterInfo?.personalDetailDto?.logoImageUrl
                  ? avaterInfo?.personalDetailDto?.logoImageUrl
                  : "/images/profile.jpg"
              }
              alt="profile"
              className={`${styles.profileImage}`}
            />
          </div>
          <div className={styles.textContainer}>
            <h2 className={`${styles.subheading}`}>How can I help?...</h2>
            <form onSubmit={handleSubmit} className={styles.inputContainer}>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                type="text"
                className={`${styles.inputField}`}
                placeholder="Type something..."
                ref={inputRef}
              />
            </form>
          </div>
        </div>
        <div className={`${styles.linkContainer}`}>
          <a href="/" className={styles.link}>
            {avaterInfo === null
              ? "Loading..."
              : avaterInfo?.personalDetailDto?.businessUrl
              ? avaterInfo?.personalDetailDto?.businessUrl
              : "https://www.navai.cloud"}
          </a>
        </div>
        <button onClick={handleClose} className={styles.closeButton}>
          x
        </button>
        <div>
          <input
            id="fullscreen_xm45btn"
            type="button"
            onClick={handleFullScreen}
            className={styles.fullscreenButton}
            value="Full screen"
          />
        </div>
      </div>
    </label>
  );
};

export default AiChatPanel;
