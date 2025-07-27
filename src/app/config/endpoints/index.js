// dotenv.config();
export const ENV_PRODUCTION = "production";
export const BASEURL = process.env.REACT_APP_HOST_URL
  ? process.env.REACT_APP_HOST_URL
  : "https://afterlifeapi.azurewebsites.net";
export const PREFIX = "/api";

export const USER_STATIC_TYPE_ID = 2;
export const ADMIN_STATIC_TYPE_ID = 3;
export const NODE_API_BASEURL =
  process.env.NODE_ENV === ENV_PRODUCTION
    ? process.env.REACT_APP_PROD_NODE_API
    : process.env.REACT_APP_NODE_API;
export const NODE_API_PREFIX = "/api";
// console.warn(process.env.NODE_ENV);
// console.warn(NODE_API_BASEURL);
export const AUTH = {
  SIGNUP: `${BASEURL}${PREFIX}/User/SignUp/Sign-up`,
  LOGIN: `${BASEURL}${PREFIX}/User/Login/Login`,
  GENERATE_HASHCODE: `${BASEURL}${PREFIX}/User/GenerateHashCode/GenerateHashCodeForLoginPassword`,
  VERIFY_OTP: `${BASEURL}${PREFIX}/User/VerifyOTP/VerifyOTP`,
  FORGOT_PASSWORD: `${BASEURL}${PREFIX}/User/RequestForgotPassword/RequestForgotPassword/{EMAIL}`,
  RESET_FORGOT_PASSWORD: `${BASEURL}${PREFIX}/User/ForgotPassword/ForgotPassword`,
  UPDATE_PASSWORD: `${BASEURL}${PREFIX}/User/UpdatePassword/UpdatePassword`,
};

export const GENERAL = {
  GET_AVTAR: `${BASEURL}${PREFIX}/Avatar/GetAvatars`,
  GET_AVTAR_FOR_AVATAR: `${BASEURL}${PREFIX}/Avatar/GetAvatarsForGuest`,
  GET_ADMIN_OR_PLAYGROUND_AVTAR: `${BASEURL}${PREFIX}/Avatar/GetAdminOrPlayGroundPageAvatars`,
  CONTACT_US: `${BASEURL}${PREFIX}/CreateBotAccess/raise`,
};

export const AVTAR = {
  CREATE: `${BASEURL}${PREFIX}/Avatar/CreateAvatar`,
  PUBLISH: `${BASEURL}${PREFIX}/AvatarPublicPublish/Publish`,
  PUBLIC: `${BASEURL}${PREFIX}/AvatarPublicPublish/Public`,
  DELETE: `${BASEURL}${PREFIX}/Avatar/DeleteAvatar?id={AVATAR_ID}`,
  CHECK_PUBLISH_ACCESS: `${BASEURL}${PREFIX}/AvatarPublicPublish/CheckLoginUserAccess`,
  EDIT: `${BASEURL}${PREFIX}/Avatar/GetAvatarById`,
  UPLOAD_PROFILE_SECTION: `${BASEURL}${PREFIX}/Avatar/UploadAvatarProfileSection`,
  UPDATE_PROFILE_SECTION: `${BASEURL}${PREFIX}/Avatar/UpdateAvatarProfileSection`,
  UPLOAD_AVATAR_STORY: `${BASEURL}${PREFIX}/Avatar/UploadAvatarStory`,
  UPDATE_AVATAR_STORY: `${BASEURL}${PREFIX}/Avatar/UpdateAvatarStory`,
  UPLOAD_AVATAR_ALBUM: `${BASEURL}${PREFIX}/Avatar/UploadAvatarAlbum`,
  UPDATE_AVATAR_ALBUM: `${BASEURL}${PREFIX}/Avatar/UpdateAvatarAlbum`,
  UPDATE_AVATAR_DP: `${BASEURL}${PREFIX}/Avatar/UpdateAvatarDP`,
  CHAT_REQUEST_DEMO_ACTION: `${BASEURL}${PREFIX}/Avatar/GetRequestDemoAction`,
  PROFILE: `${BASEURL}${PREFIX}/User/UserProfile/GetUserProfile`,
  CHAT_RESPONSE: `${BASEURL}${PREFIX}/UserBotChat/GetBotResponse`,
  CHAT_HELPER_RESPONSE: `${BASEURL}${PREFIX}/UserBotChat/GetHelperBotResponse`,
  CHAT_BOT_RESPONSE: `${BASEURL}${PREFIX}/UserBotChat/GetBotResponse`,
  CHAT_EMAIL_CAPTURE: `${BASEURL}${PREFIX}/CreateBotAccess/raise`,
  AUDIO_CHAT_RESPONSE: `${BASEURL}${PREFIX}/UserBotChat/GetWithVoice`,
  ADD_SUBJECT: `${BASEURL}${PREFIX}/Avatar/AddSubject`,
  GET_SUBJECT: `${BASEURL}${PREFIX}/Avatar/GetSubjects`,
  GET_AVATAR_MEDIA: `${BASEURL}${PREFIX}/Avatar/GetAvatarMedia`,
  AVATER_BY_ID: `${BASEURL}${PREFIX}/Avatar/GetAvatarById`,
  POST_AVATER_BY_ID: `${NODE_API_BASEURL}${PREFIX}/Avatar/GetAvatarById`,
  GET_AVATAR_DATE_FILTER: `${BASEURL}${PREFIX}/Avatar/GetDatesForMediaFilter`,
  GET_AVATAR_SUBJECT_FILTER: `${BASEURL}${PREFIX}/Avatar/GetDatesForMediaFilter`,
  UPLOAD_PROFILE_IMAGE: `${BASEURL}${PREFIX}/User/UserProfile/UploadProfileImage`,
  UPDATE_USER_PROFILE: `${BASEURL}${PREFIX}/User/UserProfile/UpdateUserProfile`,
  GOOGLE_LOGIN: `${BASEURL}${PREFIX}/User/GoogleLogin/Login`,
  GOOGLE_LOGIN_RESPONSE: `${BASEURL}${PREFIX}/User/GoogleResponse/Response`,
  FAVORITE_AVATARS: `${NODE_API_BASEURL}${NODE_API_PREFIX}/GetFavoritebyUid/{UID}`,
  ALL_FAVORITE_AVATARS: `${NODE_API_BASEURL}${NODE_API_PREFIX}/GetAllFavoritebyUid/{UID}`,
  REMOVE_FAVORITE_AVATAR: `${NODE_API_BASEURL}${NODE_API_PREFIX}/RemoveFavoratebyUid`,
  SET_FAVORITE_AVATAR: `${NODE_API_BASEURL}${NODE_API_PREFIX}/SetFavoratebyUid`,
  SET_USER_QUESTIOS: `${NODE_API_BASEURL}${NODE_API_PREFIX}/SetUserQuestions`,
  RECENT_VISIT: `${NODE_API_BASEURL}${NODE_API_PREFIX}/GetRecentbyUid/{UID}`,
  SET_RECENT_VISIT: `${NODE_API_BASEURL}${NODE_API_PREFIX}/SetRecentbyUid`,
  SPEECH_TO_TEXT: `${NODE_API_BASEURL}${NODE_API_PREFIX}/SpeechToText`,
  TEXT_TO_SPEECH: `${NODE_API_BASEURL}${NODE_API_PREFIX}/TextToSpeech`,
  ADD_DOC_TO_CHAT_BOT: `https://my-apptest4.azurewebsites.net/api/upload_to_vectorstore`,
  GET_STATS: "https://avatar-usage1.azurewebsites.net/api/get_usage",
  GET_EMP_INVITATION: `${BASEURL}${PREFIX}/AvatarInvitation/GetEmployeeInvitation`,
  INVITE_EMPLOYEES: `${BASEURL}${PREFIX}/AvatarInvitation/AddEmployee`,
  INVITE_GUEST: `${BASEURL}${PREFIX}/AvatarInvitation/AddGuest`,
  DELETE_EMPLOYEE_INVITATION: `${BASEURL}${PREFIX}/AvatarInvitation/DeleteInvitation`,
  CREATE_NEW_GROUP: `${BASEURL}${PREFIX}/AvatarInvitation/CreateGroup`,
  GET_GROUPS: `${BASEURL}${PREFIX}/AvatarInvitation/GetGroup`,
  GET_GROUPS_GUEST: `${BASEURL}${PREFIX}/AvatarInvitation/GetGuestInvitation`,
  GET_INVITED_EMAIL_DETAILS: `${BASEURL}${PREFIX}/AvatarInvitation/GetInvitationDetailByEmail`,
  GUEST_MAP: `${BASEURL}${PREFIX}/AvatarGuestMap/Post`,
  REMOVE_GUEST_MAP: `${BASEURL}${PREFIX}/AvatarGuestMap/Remove`,
  REMOVE_GUEST_MAP: `${BASEURL}${PREFIX}/AvatarGuestMap/Remove`,
};

export const ADMIM = {
  FAMILY_QUESTION: {
    LIST: `${BASEURL}${PREFIX}/Question/GetFamilyQuestion`,
    UPDATE: `${BASEURL}${PREFIX}/Question/UpdateFamilyQuestion`,
    ADD: `${BASEURL}${PREFIX}/Question/AddFamilyQuestion`,
    DELETE: `${BASEURL}${PREFIX}/Question/DeleteFamilyQuestion`,
  },
  STORY_QUESTION: {
    LIST: `${BASEURL}${PREFIX}/Question/GetStoryQuestion`,
    UPDATE: `${BASEURL}${PREFIX}/Question/UpdateStoryQuestion`,
    ADD: `${BASEURL}${PREFIX}/Question/AddStoryQuestion`,
    DELETE: `${BASEURL}${PREFIX}/Question/DeleteStoryQuestion`,
  },
};

export const ADMIN = {
  LOGIN: `${BASEURL}${PREFIX}/Avatar/CreateAvatar`,
  FAMILY_QUESTION: {
    LIST: `${BASEURL}${PREFIX}/Question/GetFamilyQuestion`,
    UPDATE: `${BASEURL}${PREFIX}/Question/UpdateFamilyQuestion`,
    ADD: `${BASEURL}${PREFIX}/Question/AddFamilyQuestion`,
    DELETE: `${BASEURL}${PREFIX}/Question/DeleteFamilyQuestion`,
  },
  STORY_QUESTION: {
    LIST: `${BASEURL}${PREFIX}/Question/GetStoryQuestion`,
    UPDATE: `${BASEURL}${PREFIX}/Question/UpdateStoryQuestion`,
    ADD: `${BASEURL}${PREFIX}/Question/AddStoryQuestion`,
    DELETE: `${BASEURL}${PREFIX}/Question/DeleteStoryQuestion`,
  },
  IDENTITY_QUESTION: {
    LIST: `${BASEURL}${PREFIX}/Question/GetIdentityQuestion`,
    UPDATE: `${BASEURL}${PREFIX}/Question/UpdateIdentityQuestion`,
    ADD: `${BASEURL}${PREFIX}/Question/AddIdentityQuestion`,
    DELETE: `${BASEURL}${PREFIX}/Question/DeleteIdentityQuestion`,
  },
  INTERCEPT_QUESTION: {
    LIST: `${BASEURL}${PREFIX}/InterceptUserQuestion/GetQuestion`,
    UPDATE: `${BASEURL}${PREFIX}/InterceptUserQuestion/UpdateQuestion`,
    ADD: `${BASEURL}${PREFIX}/InterceptUserQuestion/InsertQuestion`,
    DELETE: `${BASEURL}${PREFIX}/InterceptUserQuestion/DeleteQuestion`,
  },
};

export const MEDIA = {
  UPLOAD_IMAGE: `${BASEURL}${PREFIX}/Media/UploadImage`,
};

export const profile = {
  //'abc':'/xyz/',
};

export const SUBSCRIPTION = {
  LIST: `${BASEURL}/Subscription/GetSubscriptionPrice`,
  SUBS_MODEL: `${BASEURL}/Subscription/GetSubscriptionModels`,
  CHECKOUT_SESSION: `${BASEURL}/CreateStripeSubscription`,
  CHECKOUT_PAYPAL_SESSION: `${BASEURL}/CreatePayPalSubscription`,
  ACTIVE: `${BASEURL}/Subscription/GetActiveGateway`,
  CANCEL: `${BASEURL}/CancelActiveSubscription`,
  CREATE_STRIPE_INTENT: `${NODE_API_BASEURL}${NODE_API_PREFIX}/CreateStripeIntent`,
  ADD: `${NODE_API_BASEURL}${NODE_API_PREFIX}/StripeSubscription/Add`,
};

export const PRODUCTS = {
  ROOT: `https://gxj43sl3zutxhneh2qmdomuur40nbtue.lambda-url.us-east-2.on.aws/`,
};
