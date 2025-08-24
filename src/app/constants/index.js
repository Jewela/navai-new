import { ENUM_AVTAR } from "./enums";
export const APP_NAME = "Admin base";
export const REDIRECT_UNAUTH_ROUTE = "/login";
export const REDIRECT_AUTH_ROUTE = "/dashboard/app";
export const REDIRECT_DEFAULT_ROUTE = "/dashboard/app";
export const DEFAULT_DOMAIN = `https://navai.cloud`;
export const CHATBOT_URL = `${DEFAULT_DOMAIN}/aichat/{AVATAR_ID}`;
export const EMBEDED_CHATBOT_URL = `${DEFAULT_DOMAIN}/embeded-avatar-chatbot.js?id={AVATAR_ID}`;

export const AXIOS_ERROR_CODE = {
  ERR_NETWORK: "ERR_NETWORK",
  ECONNABORTED: "ECONNABORTED",
  ERR_BAD_REQUEST: "ERR_BAD_REQUEST",
  ERR_CANCELED: "ERR_CANCELED",
};
export const IMAGES = {
  LOGO: "/assets/images/logo.svg",
};
export const RESPONSE_CODE = {
  200: 200,
  400: 400,
  401: 401,
  404: 404,
  405: 405,
  500: 500,
};

export const STORAGE_INDEXES = {
  IS_AUTHENTICATED: "isAuthenticated",
  ACCESS_TOKEN: "accessToken",
  LOADER: "loader",
  EMAIL: "email",
  NAME: "name",
  AUTH: "auth",
  ERROR_MESSAGE: "errorMessage",
  SUCCESS_MESSAGE: "successMessage",
  USER_ID: "id",
  USER_ROLE: "role_name",
  PASSWORD: "password",
  APP_STORAGE: "AI_APP_STORAGE",
  USER_DETAILS: "userDetails",
  LOCALE: "locale",
  PROFILE_PICTURE: "profile_picture",
  EMAIL_VERIFIED: "emailVerified",
  USER_DATA: "userData",
  IS_SUBSCRIPTION_ACTIVE: "isSubscriptionActive",
  USER_SUBSCRIPTION_STATUS: "userSubscriptionStatus",
  TOAST_STATUS: "status",
  TOAST_TYPE: "type",
  TOAST_MESSAGE: "message",
  AVATAR_CONVERSATION: "AI_AVATAR_CONVERSATION",
  HELPER_AVATAR_CONVERSATION: "AI_HELPER_AVATAR_CONVERSATION",
  FAVORITE_AVATARS: "AI_FAVORITE_AVATARS",
  RECENT_AVATARS: "AI_RECENT_AVATARS",
  PRODUCTS: "AI_PRODUCTS",
  AVATAR_ID: "avatar_id",
  QUERY_ID: "query_id",
  CONVERSATION: "conversation",
  AUDIO_CONVERSATION: "audio_conversation",
  CHAT_MODE: "chat_mode",
  CHAT_MODE_TEXT: "chat_mode_text",
  CHAT_MODE_AUDIO: "chat_mode_audio",
  UNAUTH_REDIRECTION: "AI_UNAUTH_REDIRECTION",
  CART: "AI_CART",
};

export const USER_ROLES = {
  ADMIN: "admin",
  SUB_ADMIN: "sub sdmin",
};
export const DEFAULT_VALUE = {
  LOCALE: "en",
  LOGO: "/assets/logo.svg",
  LOGIN_PAGE_IMG: "/assets/images/admin-panel-image.webp",
  USER_STATIC_TYPE_ID: 2,
  TIMEZONE: 0,
  PROCESSING_TEXT: {
    LOADING: "please wait...",
    TYPE_REGULAR: "regular",
    TYPE_ERROR: "error",
  },
  AVTAR: {
    PROFILE_SECTIOINS: {
      EDUCATION: {
        SCHOOL: [
          {
            sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE.EDUCATION,
            subSectionTitleEnum: ENUM_AVTAR.SUBSECTION_TITLE.SCHOOL,
            description: "",
            avatarProfileSectionId: 0,
          },
        ],
        UNIVERSITY: [
          {
            sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE.EDUCATION,
            subSectionTitleEnum: ENUM_AVTAR.SUBSECTION_TITLE.UNIVERSITY,
            description: "",
            avatarProfileSectionId: 0,
          },
        ],
      },
      WORK_HISTORY: [
        {
          sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE.WORK,
          subSectionTitleEnum: 0,
          description: "",
          avatarProfileSectionId: 0,
        },
      ],
      HOBBY: [
        {
          sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE.HOBBY,
          subSectionTitleEnum: 0,
          description: "",
          avatarProfileSectionId: 0,
        },
      ],
    },
    STORY: {
      SAD: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.SAD,
          story: "",
          storyId: 0,
        },
      ],
      VACATION: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.VACATION,
          story: "",
          storyId: 0,
        },
      ],
      CHILDHOOD: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.CHILDHOOD,
          story: "",
          storyId: 0,
        },
      ],
      ADULT: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.ADULT,
          story: "",
          storyId: 0,
        },
      ],
      IMPORTANTLIFE: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.IMPORTANTLIFE,
          story: "",
          storyId: 0,
        },
      ],
      SCHOOL: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.SCHOOL,
          story: "",
          storyId: 0,
        },
      ],
      WORK: [
        {
          avatarStoryEnum: ENUM_AVTAR.STORY.WORK,
          story: "",
          storyId: 0,
        },
      ],
    },
    PHOTO_ALBUM: {
      YT_LINKS: { link: "", isNew: true },
    },
  },
  QUESTIOS: {
    RECORDS_PER_PAGE: 10,
  },
};

export const USER_BEHAVIOUR_TYPE = {
  STATUS: {
    0: "inactive",
    1: "active",
  },
  VERIFIED: {
    0: "not verified",
    1: "verified",
  },
};

export const USER_BEHAVIOUR_LIST = {
  STATUS: "status",
  AVAILABILITY: "availability",
  VERIFIED: "verified",
};

export const DEFAULT_CSS = {
  BG: "#e2f6fc",
  LOADER_BG_COLOR: "#fff",
  // LOADER_BG_COLOR: '#e2f6fc',
  DARK_BG: "#354054",
  PRIMARY_COLOR: "#1f74ca",
  SUCCESS_MSG_COLOR: "#4caf50",
  ERROR_MSG_COLOR: "#FF4842",
  WARNING_COLOR: "#ffab00",
  SUCCESS_COLOR: "#36b37e",
};

export const ROUTE_SLUGS = {
  HOMEPAGE: "/",
  LOGIN: "/login",
  FORGOT_PASS: "/forgot-password",
  RESET_PASS: "/reset-password",
  PROFILE: "/profile",
};

export const AUTH_ROUTE_SLUGS = {
  PROFILE: "/profile",
  BECOME_MEMBER: "/become-member",
  AVTAR: {
    LIST: "/admin-dashboard",
    CREATE: "/create-avtars",
    BY_ID: "/admin-dashboard",
    PROFILE_OPTIONS: "/avtar/profile-options",
    PERSONAL_DETAILS: "/avtar/personal-details",
    FAVORITE_AVATARS: "/avtar/favorite-avatars",
  },
  AGENT: {
    LIST: "/agents",
    CREATE: "/create-agents",
    BY_ID: "/agent",
    PROFILE_OPTIONS: "/agent/profile-options",
    PERSONAL_DETAILS: "/agent/personal-details",
    FAVORITE_AVATARS: "/agent/favorite-avatars",
  },
  SUBSCRIBE: {
    USER_SUBSCRIPTION: "/user-subscription",
    // USER_SUBSCRIPTION: "/user-active-subscription",
    PRICE_LIST: "/user-subscription",
    CART: "/cart",
    PAYMENT_SUCCESS: "/payment-success",
    PAYMENT_CALLBACK: "/payment-callback",
    SUBSCRIBED_AVATARS: "/avatars/active",
  },
  PLAYGROUND: "/playground",
  MANAGE_EMPLOYEE: "/manage-employee",
  MANAGE_EMPLOYEE_LIST: "/manage-employee/list",
  ADD_NEW_EMPLOYEE: "/manage-employee/add-new",
  MANAGE_GUEST: "/manage-guest",
  MANAGE_GUEST_GROUP: "/manage-guest/group",
  ADD_NEW_GUEST_GROUP: "/manage-guest/add-new-group",
  INVITE_GUEST: "/invite-guest",
  AVATAR_MEETING: "/avatar-meeting",
};

export const ADMIN_ROUTE_SLUGS = {
  LOGIN: "admin-login",
  DASHBOARD: "/dashboard",
  FAMILY_QUESTION: "/admin/family-question",
  ADD_FAMILY_QUESTION: "/admin/family-question/add-new",
  STORY_QUESTION: "/admin/story-question",
  ADD_STORY_QUESTION: "/admin/story-question/add-new",
  IDENTITY_QUESTION: "/admin/identity-question",
  ADD_IDENTITY_QUESTION: "/admin/identity-question/add-new",
  INTERCEPT_QUESTION: "/admin/intercept-questions",
  ADD_INTERCEPT_QUESTION: "/admin/intercept-questions/add-new",
};

export const ADMIN_ROUTE_LIST = ["admin-login", "dashboard", "family-question"];

export const ADMIN_PROTECTED_ROUTE = ["admin-login", "/"];

export const PROTECTED_ROUTE_SLUGS = {
  EMAIL_VERIFY: "/email-verify",
  GOOGLE_LOGIN: "/success",
  GOOGLE_LOGIN_SUCCESS: "/success",
};

export const PUBLIC_ROUTES_SLUGS = {
  ROOT: "/",
  ABOUT_US: "/about-us",
  CONTACT_US: "/contact-us",
  HELPER_CHATBOT: "/helper-chatbot",
  ADMIN_LOGIN: "/admin-login-2",
  AVATORS: "/avatars",
  AVATAR_BIO: "/avatar-bio",
  // AVATORS: "/avtars",
  EMBEDED_CHATBOT: "/embeded-chatbot",
  AVATAR_CHATBOT: "/avatar-chatbot",
  ADMIN_LOGIN: "/admin-login-2",
  AVATORS: "/avatars",
  AICHAT: "/aichat",
  AVATAR_BIO: "/avatar-bio",
  PRODUCTS: "/products",
  BUSINESS_SIGNUP: "/business-signup",
  // AVATAR_MEETING: "/avatar-meeting",
};

export const DEFAULT_APP_TITLE = {
  PROFILE: "Profile",
  USERS: "Users",
};

export const MEDIA_CATEGORY = {
  FAMILY: 0,
  "family-photos": 0,
  TRAVEL: 1,
  "travel-photos": 1,
  SCRAPBOOK: 2,
  "scrapbook-photos": 2,
  0: "Family photo album",
  1: "Travel photo album",
  2: "Scrapbook photo album",
};
export const MEDIA_CATEGORY_PHOTOS = {
  FAMILY: "family-photos",
  TRAVEL: "travel-photos",
  SCRAPBOOK: "scrapbook-photos",
};
export const FILTER_MONTHS = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

export const AVATAR_PARAMS = {
  avatarid: "Avatarid",
};

export const ALLOWED_USERID = [302, 399, 396];
export const SUBSCRIPTION_TYPES = {
  USER_SUBSCRIPTION: "USER_SUBSCRIPTION",
  AVATAR_SUBSCRIPTION: "AVATAR_SUBSCRIPTION",
};
export const STRIPE = {
  PUBLISH_KEY: process.env.REACT_APP_STRIPE_PUBLISH_KEY,
};

export const PRODUCT_CALL_TO_ACTION_LINK = `https://calendar.app.google/dr69gjCewAuMYNYK9`;

// !!! dont change the order, indexes are getting used !!!
export const AVATAR_CHAT_ACTIONS_BUTTON_TITLE = ["RequestDemo", "ContactSale"];
export const AVATAR_CHAT_ACTIONS_FEATURE = ["Meet The Team", "Products", "Testimonials", "Screenshots"];
export const HELPER_CHATBOT_AVATAR_ID = 219;
export const VISIT_US_DISCORD_PAGE_LINK = `https://discord.com/channels/1241476983976755341/1241476984471818401`;
// export const VISIT_US_DISCORD_PAGE_LINK = `https://www.solsticecare.com/provider-search.aspx`;

export const USER_TYPES = {
  MERCHANT: "merchant",
  GUEST: "guest",
  EMPLOYEE: "employee"
}

export const DEFAULT_USER_IMG = '/images/default-user-thumbnail.jpg'
export const DEFAULT_AVATAR_IMG = '/images/default-avatar-thumbnail.jpg'