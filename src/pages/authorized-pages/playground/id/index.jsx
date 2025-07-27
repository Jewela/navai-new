import React, { useEffect, useState } from "react";
import AiChatPanel from "../_components/AiChatPanel";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setAvatarId,
  setAvatarInfo,
  setChatInputValue,
  setIsFocuse,
  setPopupToggle,
} from "../../../../redux/avatarIdReducer/avatarIdSlice";
import { BASEURL, PREFIX } from "../../../../app/config/endpoints";
import toast from "react-hot-toast";
import { postRequest } from "../../../../app/httpClient/axiosClient";
import AvatarList from "../avatarList";

const Playground = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const [idIsValid, setIdIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [avaterInfo, setAvaterInfo] = useState(null);
  const [inputValue, setInputValue] = useState("");
  // call api to get data by avatar id
  async function getData() {
    if (!id) {
      return;
    }
    try {
      setIsLoading(true);

      const res = await postRequest(
        `${BASEURL}${PREFIX}/Avatar/GetAvatarById`,
        {
          id,
        }
      );

      if (res.data.data) {
        const avater = res.data.data;
        // if (
        //   avater.avatarTypeEnum === 0 ||
        //   avater.avatarTypeEnum === 2
        // ) {
        //   setAvaterInfo(avater);
        //   dispatch(setAvatarInfo(avater));
        // } else {
        //   toast.error("You need to login for chat");

        //   setAvaterInfo(avater); // this is for test
        //   dispatch(setAvatarInfo(avater)); // this is for test
        //   throw new Error("For this avater you need authentication");
        // }
        setAvaterInfo(avater);
        dispatch(setAvatarInfo(avater));

        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      // Error Happened: So, Load user avatars
      setIdIsValid(false);
    }
  }
  useEffect(() => {
    dispatch(setAvatarInfo({}));
    if (/^\d+$/.test(id)) {
      // set avater id to redux state
      const numId = Number(id);
      dispatch(setAvatarId(numId));
      setIdIsValid(true);
      // Get Avatar data
      getData();
    } else {
      // Load Users Avatar List
      setIdIsValid(false);
    }
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    if (inputValue) {
      dispatch(setPopupToggle(true));
      dispatch(setChatInputValue(inputValue));

      setInputValue("");
      dispatch(setIsFocuse(false));
    } else {
      console.log("Please use add value then submit");
    }
  }

  return (
    <>
      {idIsValid ? (
        <>
          {isLoading ? (
            <h2
              style={{
                textAlign: "center",
                paddingTop: "3rem",
                paddingBottom: "3rem",
              }}
            >
              Loading......
            </h2>
          ) : (
            <AiChatPanel
              avaterid={id}
              avaterInfo={avaterInfo}
              setInputValue={setInputValue}
              handleSubmit={handleSubmit}
              inputValue={inputValue}
            />
          )}
        </>
      ) : (
        <section className="spacer-md avator py-5">
          <div className="container">
            <h2>Invalid Avatar ID: Try below avatars.</h2>
            <AvatarList />
          </div>
        </section>
      )}
    </>
  );
};

export default Playground;
