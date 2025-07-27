import { lazy } from "react";
import {
  PROTECTED_ROUTE_SLUGS,
  AUTH_ROUTE_SLUGS,
  PUBLIC_ROUTES_SLUGS,
  ADMIN_ROUTE_SLUGS,
} from "../app/constants";

export const PublicRoutes = [
  {
    slug: PUBLIC_ROUTES_SLUGS.ROOT,
    component: lazy(() => import("../pages/public-pages/homepage")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.ABOUT_US,
    component: lazy(() => import("../pages/public-pages/aboutus")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.AVATORS,
    component: lazy(() => import("../pages/public-pages/avators")),
    exact: true,
  },
  {
    slug: `${PUBLIC_ROUTES_SLUGS.AICHAT}/:id`,
    component: lazy(() => import("../pages/public-pages/aichat")),
    exact: true,
  },
  {
    slug: `${PUBLIC_ROUTES_SLUGS.AVATORS}/:id`,
    component: lazy(() =>
      import("../pages/public-pages/avators/avatorsDetails")
    ),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.AVATAR_MEETING}/:id`,
    component: lazy(() =>
      import("../pages/public-pages/avators/avatarMeetings")
    ),
    exact: true,
  },
  {
    slug: `${PUBLIC_ROUTES_SLUGS.AVATORS}/:id/:category`,
    component: lazy(() =>
      import("../pages/public-pages/avators/avatorsPhotos")
    ),
    exact: true,
  },
  {
    slug: `${PUBLIC_ROUTES_SLUGS.AVATAR_BIO}/:id`,
    component: lazy(() => import("../pages/public-pages/avatar-bio")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.CONTACT_US,
    component: lazy(() => import("../pages/public-pages/contactus")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.EMBEDED_CHATBOT,
    component: lazy(() => import("../pages/public-pages/embeded-chatbot")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.HELPER_CHATBOT,
    component: lazy(() => import("../pages/public-pages/helper-chatbot")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.AVATAR_CHATBOT,
    component: lazy(() => import("../pages/public-pages/avatar-chatbot")),
    exact: true,
  },
  {
    slug: `${ADMIN_ROUTE_SLUGS.LOGIN}`,
    component: lazy(() => import("../pages/authorized-pages/admin/login")),
    exact: true,
  },
  {
    slug: PROTECTED_ROUTE_SLUGS.GOOGLE_LOGIN,
    component: lazy(() => import("../pages/protected-pages/google-login")),
    exact: true,
  },
  {
    slug: PUBLIC_ROUTES_SLUGS.PRODUCTS,
    component: lazy(() => import("../pages/public-pages/products")),
    exact: true,
  },
  {
    slug: `${PUBLIC_ROUTES_SLUGS.PRODUCTS}/:product`,
    component: lazy(() => import("../pages/public-pages/products/ProductDetails")),
    exact: true,
  },
  {
    slug: `${PUBLIC_ROUTES_SLUGS.BUSINESS_SIGNUP}/:email`,
    component: lazy(() => import("../pages/public-pages/guest-business-signup")),
    exact: true,
  },
];

// ************************** PROTECTED ROUTES **************************

export const ProtectedRoutes = [
  {
    slug: PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY,
    component: lazy(() => import("../pages/protected-pages/email-verify")),
    exact: true,
  },
];

// ************************** Authorized ROUTES **************************

export const AuthorizedRoutes = [
  {
    slug: AUTH_ROUTE_SLUGS.PROFILE,
    component: lazy(() => import("../pages/authorized-pages/profile")),
    exact: true,
  },
  {
    slug: AUTH_ROUTE_SLUGS.AVTAR.CREATE,
    component: lazy(() =>
      import("../pages/authorized-pages/avtars/createAvtars")
    ),
    exact: true,
  },
  {
    slug: AUTH_ROUTE_SLUGS.AGENT.CREATE,
    component: lazy(() =>
      import("../pages/authorized-pages/agents/createAgents")
    ),
    exact: true,
  },
  {
    slug: AUTH_ROUTE_SLUGS.AVTAR.LIST,
    component: lazy(() => import("../pages/authorized-pages/avtars")),
    exact: true,
  },
  {
    slug: AUTH_ROUTE_SLUGS.AVTAR.FAVORITE_AVATARS,
    component: lazy(() =>
      import("../pages/authorized-pages/avtars/FavoriteAvatars")
    ),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.AVTAR.BY_ID}/:id`,
    component: lazy(() => import("../pages/authorized-pages/avtars/AvtarById")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.AVTAR.PROFILE_OPTIONS}/:id`,
    component: lazy(() =>
      import("../pages/authorized-pages/avtars/ProfileOptions/PersonalDetails")
    ),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.BECOME_MEMBER}`,
    component: lazy(() => import("../pages/authorized-pages/become-member")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.SUBSCRIBE.USER_SUBSCRIPTION}`,
    component: lazy(() => import("../pages/authorized-pages/subscription")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.SUBSCRIBE.CART}`,
    component: lazy(() => import("../pages/authorized-pages/cart")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.SUBSCRIBE.PAYMENT_SUCCESS}`,
    component: lazy(() => import("../pages/authorized-pages/payment-success")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.SUBSCRIBE.PAYMENT_CALLBACK}`,
    component: lazy(() => import("../pages/authorized-pages/payment-callback")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE}`,
    component: lazy(() => import("../pages/authorized-pages/manage-employee")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.MANAGE_EMPLOYEE_LIST}`,
    component: lazy(() => import("../pages/authorized-pages/manage-employee/epmloyee-list")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.ADD_NEW_EMPLOYEE}`,
    component: lazy(() => import("../pages/authorized-pages/manage-employee/add-new")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.MANAGE_GUEST}`,
    component: lazy(() => import("../pages/authorized-pages/manage-guest")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.MANAGE_GUEST_GROUP}/:id`,
    component: lazy(() => import("../pages/authorized-pages/manage-guest/groups/guests")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.MANAGE_GUEST_GROUP}/:id/invite-guest`,
    component: lazy(() => import("../pages/authorized-pages/manage-guest/groups/guests/AddnewGuest")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.ADD_NEW_GUEST_GROUP}`,
    component: lazy(() => import("../pages/authorized-pages/manage-guest/groups/AddnewGroup")),
    exact: true,
  },
];

// ************************** AdminAuthorized ROUTES **************************

export const AdminAuthorizedRoutes = [
  {
    slug: ADMIN_ROUTE_SLUGS.FAMILY_QUESTION,
    component: lazy(() =>
      import("../pages/authorized-pages/admin/questions/family-questions")
    ),
    exact: true,
  },
  {
    slug: `${ADMIN_ROUTE_SLUGS.FAMILY_QUESTION}/:id`,
    component: lazy(() =>
      import(
        "../pages/authorized-pages/admin/questions/family-questions/child-questions"
      )
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.ADD_FAMILY_QUESTION,
    component: lazy(() =>
      import(
        "../pages/authorized-pages/admin/questions/family-questions/addNew"
      )
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.STORY_QUESTION,
    component: lazy(() =>
      import("../pages/authorized-pages/admin/questions/story-questions")
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.ADD_STORY_QUESTION,
    component: lazy(() =>
      import("../pages/authorized-pages/admin/questions/story-questions/addNew")
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.IDENTITY_QUESTION,
    component: lazy(() =>
      import("../pages/authorized-pages/admin/questions/identity-questions")
    ),
    exact: true,
  },
  {
    slug: `${ADMIN_ROUTE_SLUGS.IDENTITY_QUESTION}/:id`,
    component: lazy(() =>
      import(
        "../pages/authorized-pages/admin/questions/identity-questions/child-questions"
      )
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.ADD_IDENTITY_QUESTION,
    component: lazy(() =>
      import(
        "../pages/authorized-pages/admin/questions/identity-questions/addNew"
      )
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.INTERCEPT_QUESTION,
    component: lazy(() =>
      import("../pages/authorized-pages/admin/questions/intercept-questions/")
    ),
    exact: true,
  },
  {
    slug: ADMIN_ROUTE_SLUGS.ADD_INTERCEPT_QUESTION,
    component: lazy(() =>
      import(
        "../pages/authorized-pages/admin/questions/intercept-questions/addNew"
      )
    ),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.PLAYGROUND}`,
    component: lazy(() => import("../pages/authorized-pages/playground")),
    exact: true,
  },
  {
    slug: `${AUTH_ROUTE_SLUGS.PLAYGROUND}/:id`,
    component: lazy(() => import("../pages/authorized-pages/playground/id")),
    exact: true,
  },
];
