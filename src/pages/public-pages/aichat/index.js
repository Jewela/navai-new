import React, { useEffect, useState } from "react";
import AiChatPanel from "./_components/AiChatPanel";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  setAvatarId,
  setAvatarInfo,
  setChatInputValue,
  setIsFocuse,
  setPopupToggle,
} from "../../../redux/avatarIdReducer/avatarIdSlice";
import { BASEURL, PREFIX } from "../../../app/config/endpoints";
import axios from "axios";
import toast from "react-hot-toast";

const Aichat = () => {
  const { id } = useParams();
  const [avaterInfo, setAvaterInfo] = useState(null);
  const [inputValue, setInputValue] = useState("");

  // set avater id to redux state
  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      const numId = Number(id);
      dispatch(setAvatarId(numId));
    }
  }, [id]);

  // call api to get data by avater id
  async function getData() {
    if (!id) {
      return;
    }
    try {
      const res = await axios.post(`${BASEURL}${PREFIX}/Avatar/GetAvatarById`, {
        id,
      });
      if (res.data.data) {
        const avater = res.data.data;
        if ((avater.avatarCategoryEnum === 0 || avater.avatarCategoryEnum === 2) && (avater.isPublished)) {
          setAvaterInfo(res.data.data);
          dispatch(setAvatarInfo(res.data.data));
        } else if (avater.avatarCategoryEnum === 1 || avater.avatarCategoryEnum === 3) {
          toast.error("You need to login for chat");

          setAvaterInfo(res.data.data); // this is for test
          dispatch(setAvatarInfo(res.data.data)); // this is for test
          throw new Error("For this avater you need authentication");
        } else {
          toast.error("You need to login for chat");

          setAvaterInfo(res.data.data); // this is for test
          dispatch(setAvatarInfo(res.data.data)); // this is for test
          throw new Error("For this avater you need authentication");
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getData();
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
      {!id ? (
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
  );
};

export default Aichat;
