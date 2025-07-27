import { createSlice } from "@reduxjs/toolkit";
import { HELPER_CHATBOT_AVATAR_ID } from "../../app/constants";

const initialState = {
  avatarId: null,
};

const avatarSlice = createSlice({
  name: "avatar",
  initialState: {
    avatarId: HELPER_CHATBOT_AVATAR_ID,
    avaterInfo: {},
    popupToggle: false,
    chatInputValue: "",
    isFocus: true,
  },
  reducers: {
    setAvatarId(state, action) {
      state.avatarId = action.payload;
    },
    setAvatarInfo(state, action) {
      state.avaterInfo = action.payload;
    },
    setPopupToggle(state, action) {
      state.popupToggle = action.payload;
    },
    setChatInputValue(state, action) {
      state.chatInputValue = action.payload;
    },
    setIsFocuse(state, action) {
      state.isFocus = action.payload;
    },
  },
});

export const {
  setAvatarId,
  clearAvatarId,
  setAvatarInfo,
  setPopupToggle,
  setChatInputValue,
  setIsFocuse,
} = avatarSlice.actions;

export default avatarSlice.reducer;
