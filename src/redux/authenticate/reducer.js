import actions from "./actions.js";
import { setInitialState, setOnLocalStorage } from "../../utils/localStorage";
import { STORAGE_INDEXES } from "../../app/constants/index.js";

const initialState = setInitialState();
function Reducer(state = initialState, action) {
  // console.warn(action);

  switch (action.type) {
    case actions.LOGIN:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: true,
        [STORAGE_INDEXES.ERROR_MESSAGE]: "",
      };

    case actions.LOGIN_FAILURE:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: false,
        [STORAGE_INDEXES.ERROR_MESSAGE]: action.payload.errorMessage,
      };

    case actions.LOGIN_SUCCESS:
      return { ...state, ...action.payload };

    case actions.LOGOUT_SUCCESS:
      return { ...state, ...action.payload };

    case actions.SIGNUP:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: true,
        [STORAGE_INDEXES.EMAIL]: action.payload.emailAddress,
      };

    case actions.SIGNUP_FAILURE:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: false,
        [STORAGE_INDEXES.ERROR_MESSAGE]: action.payload.errorMessage,
      };

    case actions.VERIFY_OTP_FAILURE:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: false,
        [STORAGE_INDEXES.ERROR_MESSAGE]: action.payload.errorMessage,
      };

    case actions.VERIFY_OTP_SUCCESS:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: false,
        [STORAGE_INDEXES.ERROR_MESSAGE]: null,
        [STORAGE_INDEXES.EMAIL_VERIFIED]: true,
      };

    case actions.SIGNUP_SUCCESS:
      return { ...state, ...action.payload };

    case actions.EMAIL_VERIFY_PROCESS:
      return { ...state, emailVerified: null };

    case actions.VERIFY_OTP:
      return { ...state, loader: true, errorMessage: null };

    case actions.OPEN_AUTH_MODAL:
      return {
        ...state,
        openAuthModal: true,
        preventClose: action?.payload?.preventClose || false,
      };

    case actions.CLOSE_AUTH_MODAL:
      return { ...state, openAuthModal: false };

    case actions.OPEN_BUSINESS_AUTH_MODAL:
      return {
        ...state,
        openBusinessAuthModal: true,
        preventClose: action?.payload?.preventClose || false,
      };

    case actions.CLOSE_BUSINESS_AUTH_MODAL:
      return { ...state, openBusinessAuthModal: false };

    case actions.OPEN_SUBSCRIPTION_MODAL:
      return {
        ...state,
        openSubscriptioinModal: true,
        preventClose: action?.payload?.preventClose || false,
      };

    case actions.CLOSE_SUBSCRIPTION_MODAL:
      return { ...state, openSubscriptioinModal: false };

    case actions.API_PROCESS:
      return { ...state, ...action.payload };

    case actions.API_PROCESS_FAILURE:
      return { ...state, ...action.payload };

    case actions.API_PROCESS_SUCCESS:
      return { ...state, ...action.payload };
    case actions.CHATBOT_DATA:
      return { ...state, ...action.payload };
    case actions.CHATBOT_LISTING:
      return { ...state, ...action.payload };

    case actions.PROCESS_INIT:
      return {
        ...state,
        [STORAGE_INDEXES.LOADER]: false,
        [STORAGE_INDEXES.ERROR_MESSAGE]: null,
        [STORAGE_INDEXES.SUCCESS_MESSAGE]: null,
      };

    case actions.TOAST_PROCESS:
      return { ...state, toast: action.payload };

    case actions.UPDATE_PROFILE_IMAGE:
      const userAuthData = {
        ...state,
        userData: {
          ...state.userData,
          profileImage: {
            ...state.userData.profileImage,
            imageBlobUrl: action.payload.imageUrl,
          },
        },
      };
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, userAuthData);
      return userAuthData;

    case actions.UPDATE_USER_SUBSCRIPTION:
      const userSubscriptionData = {
        ...state,
        userData: {
          ...state.userData,
          isSubscriptionActive: true,
          userSubscriptionStatus: true,
        },
      };
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, userSubscriptionData);
      return userSubscriptionData;
    
      case actions.ALTER_USER_SUBSCRIPTION:
      const _userSubscriptionData = {
        ...state,
        userData: {
          ...state.userData,
          isSubscriptionActive: false,
          userSubscriptionStatus: false,
        },
      };
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, _userSubscriptionData);
      return _userSubscriptionData;

    case actions.UPDATE_AVATAR_TRAIL_AVAILABLE:
      const ifAvatarTrialAvailable = {
        ...state,
        userData: {
          ...state.userData,
          isAvatarTrialAvailable: false,
        },
      };
      setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, ifAvatarTrialAvailable);
      return ifAvatarTrialAvailable;

    default:
      return state;
  }
}

export default Reducer;
