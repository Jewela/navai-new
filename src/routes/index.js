import { Suspense, Fragment, useEffect } from "react";
import {
  BrowserRouter as Router,
  HashRouter,
  Route,
  Switch,
  HistoryRouter,
  Routes,
  useLocation,
} from "react-router-dom";

import {
  AdminAuthRoutHelper,
  AuthRouteHelper,
  ProtectedRouteHelper,
  PublicRouteHelper,
} from "./helpers.js";
import {
  AuthorizedRoutes,
  ProtectedRoutes,
  PublicRoutes,
  AdminAuthorizedRoutes,
  WithoutNavbarFooterRoutes,
} from "./routes.js";
import Layout from "../container/layouts/index.js";
import { getErrorMessage } from "../utils/helpers/apiErrorResponse.js";
import { useDispatch, useSelector } from "react-redux";
import { getRequest } from "../app/httpClient/axiosClient.js";
import {
  FAVOURIE_AVATARS_ACTION as actions,
  RECENT_AVATARS_ACTION as recent_actions,
} from "../redux/authenticate/actions.js";
import { AVTAR } from "../app/config/endpoints/index.js";
import { RESPONSE_CODE } from "../app/constants/index.js";
import AvatarMeetingsNew from "../pages/public-pages/avators/avatarMeetingsNew";
import MeetingLayout from "../container/layouts/meetingLayout.js";

function AppRoutes({ isAuthenticated, emailVerified }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    userData: { id: userId },
  } = useSelector((state) => state.auth);
  const {
    status: favAvatarStatus = false,
    isLoading: isFavAvatarLoading = false,
    errorMessage: favAvatarErrorMessage = null,
    avatarList: favAvatarList = [],
  } = useSelector((state) => state.favourite_avatar);

  const {
    status: recentAvatarStatus = false,
    isLoading: isrecentAvatarLoading = false,
    errorMessage: recentErrorMessage = null,
    avatarList: recentFavAvatarList = [],
  } = useSelector((state) => state.recent_avatar);

  async function getFavoriteAvatars(URL) {
    return false;
    try {
      // setLoadMore(true);
      const response = await getRequest(URL);
      const {
        status: statusCode,
        data: {
          data: { rows: avatars = [], total },
          status,
        },
      } = response;

      if (statusCode === RESPONSE_CODE[200] && status) {
        // setAvtarList(requireRefresh ? [avatars] : [...avatarList, ...avatars]);
        // setTotalRecords(total);
        let avatarListIds = [];

        if (avatars.length > 0) {
          avatarListIds = avatars.map((avatar) => avatar.avatarid);
        }

        dispatch({
          type: actions.UPDATE_AVATAR_LIST,
          payload: {
            avatarList: avatars,
            avatarListIds: avatarListIds,
          },
        });
      } else {
        // setErrorMessage(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].AVTAR_LIST_FAILURE);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error({ error, errorMessage });
    }
  }

  async function getRecentAvatars(URL) {
    return false;
    try {
      // setLoadMore(true);
      const response = await getRequest(URL);
      const {
        status: statusCode,
        data: {
          data: { recentVists = [] },
          status,
        },
      } = response;
      // console.log("response ==> ", recentVists);
      if (statusCode === RESPONSE_CODE[200] && status) {
        dispatch({
          type: recent_actions.UPDATE_AVATAR_LIST,
          payload: {
            avatarList: recentVists,
          },
        });
      } else {
        // setErrorMessage(RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].AVTAR_LIST_FAILURE);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error({ error, errorMessage });
    }
  }

  const fetchRecentAvatars = () => {
    return false;
    dispatch({
      type: recent_actions.IS_LOADING,
      payload: { isLoading: true },
    });
    getRecentAvatars(AVTAR.RECENT_VISIT.replace("{UID}", userId));
  };

  const fetchFavoriteAvatars = () => {
    return false;
    dispatch({
      type: actions.IS_LOADING,
      payload: { isLoading: true },
    });
    getFavoriteAvatars(AVTAR.ALL_FAVORITE_AVATARS.replace("{UID}", userId));
  };

  useEffect(() => {
    if (!favAvatarStatus && !isFavAvatarLoading && isAuthenticated) {
      fetchFavoriteAvatars();
    }

    if (!recentAvatarStatus && !isrecentAvatarLoading && isAuthenticated) {
      fetchRecentAvatars();
    }
  }, [location]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchFavoriteAvatars();
    fetchRecentAvatars();
  }, [isAuthenticated]);

  return (
    // <Router >
    <Fragment>
      <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route element={<MeetingLayout />}>
            {WithoutNavbarFooterRoutes.map(
              ({ component: Component, slug, exact }, index) => (
                <Route
                  path={`${slug}`}
                  key={index}
                  exact
                  element={<Component />}
                />
              )
            )}
            </Route>
            <Route element={<Layout />}>
            {PublicRoutes.map(
              ({ component: Component, slug, exact }, index) => (
                <Route
                  path={`${slug}`}
                  key={index}
                  exact
                  element={<Component />}
                />
              )
            )}

            {ProtectedRoutes.map(
              ({ component: Component, slug, exact }, index) => (
                <Route
                  path={`${slug}`}
                  key={index}
                  exact
                  element={
                    <ProtectedRouteHelper
                      isAuthenticated={isAuthenticated}
                      emailVerified={emailVerified}
                    >
                      <Component />
                    </ProtectedRouteHelper>
                  }
                />
              )
            )}

            {AuthorizedRoutes.map(
              ({ component: Component, slug, exact }, index) => (
                <Route
                  path={`${slug}`}
                  key={index}
                  exact
                  element={
                    <AuthRouteHelper isAuthenticated={isAuthenticated}>
                      <Component />
                    </AuthRouteHelper>
                  }
                />
              )
            )}

            {AdminAuthorizedRoutes.map(
              ({ component: Component, slug, exact }, index) => (
                <Route
                  path={`${slug}`}
                  key={index}
                  exact
                  element={
                    <AdminAuthRoutHelper isAuthenticated={isAuthenticated}>
                      <Component />
                    </AdminAuthRoutHelper>
                  }
                />
              )
            )}
            </Route>
          </Routes>
      </Suspense>
    </Fragment>
    // </Router>
  );
}

export default AppRoutes;
