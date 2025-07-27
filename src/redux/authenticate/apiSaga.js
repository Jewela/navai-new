import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  STORAGE_INDEXES,
  RESPONSE_CODE,
  DEFAULT_VALUE,
} from "../../app/constants";
import { RESPONSE_MESSAGES } from "../../app/constants/localizedStrings";
import actions, {
  FAVOURIE_AVATARS_ACTION as fa_actions,
  RECENT_AVATARS_ACTION as ra_actions,
} from "./actions";

import {
  authUserData,
  updateOtpVerification,
  defaultInitialState,
} from "../../utils/helpers";
import { AUTH, SUBSCRIPTION } from "../../app/config/endpoints";
import { postRequest, getRequest } from "../../app/httpClient/axiosClient";
import {
  removeFromLocalStorage,
  setOnLocalStorage,
} from "../../utils/localStorage";
import { AXIOS_ERROR_CODE } from "../../app/constants";
import { getErrorMessage } from "../../utils/helpers/apiErrorResponse";
import toast from "react-hot-toast";

function* login(action) {
  try {
    let { status, data } = yield call(() =>
      postRequest(
        `${AUTH.GENERATE_HASHCODE}?password=${action.payload.password}`,
        null
      )
    );

    if (status === RESPONSE_CODE[200]) {
      const { status: loginStatus, data: loginData } = yield call(() =>
        postRequest(
          AUTH.LOGIN,
          JSON.stringify({
            emailAddress: action.payload.email,
            password: data,
            userStaticTypeId: action.payload.staticTypeId,
            isBusiness: action.payload.isBusiness,
          })
        )
      );

      if (loginStatus === RESPONSE_CODE[200]) {
        const { httpStatusCode } = loginData;
        if (httpStatusCode === RESPONSE_CODE[200]) {
          const payloadData = authUserData(loginData.data);

          // * opt verification is no longer require untill further instruction
          // if (!loginData?.data?.isOTPVerified) {
          //   const { callback } = action.payload;
          //   callback();
          // }

          //.......
          yield put({
            type: actions.LOGIN_SUCCESS,
            payload: payloadData,
          });
          // try {
          //   const response = yield call(() => postRequest(SUBSCRIPTION.ACTIVE, { "avatarIds": 0 }));
          // } catch (error) {
          //   const errorMessage = getErrorMessage(error);
          //   console.log(errorMessage)
          //   if (errorMessage === RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].SUBSCRIPTION_ALREADY_ACTIVE) {
          //     yield put({
          //       type: actions.UPDATE_USER_SUBSCRIPTION,
          //     });

          //   }
          // }
          //.......

          const { callback } = action.payload;
          callback();


        } else if (httpStatusCode === RESPONSE_CODE[400]) {
          const { friendyMessageList } = loginData;
          yield put({
            type: actions.LOGIN_FAILURE,
            payload: { errorMessage: friendyMessageList[0] },
          });
        }
      } else {
        const LOCALE = DEFAULT_VALUE.LOCALE;
        yield put({
          type: actions.LOGIN_FAILURE,
          payload: { errorMessage: RESPONSE_MESSAGES[LOCALE].LOGIN_FAILURE },
        });
      }
    } else {
      const LOCALE = DEFAULT_VALUE.LOCALE;
      yield put({
        type: actions.SIGNUP_FAILURE,
        payload: { errorMessage: RESPONSE_MESSAGES[LOCALE].SIGNUP_FAILURE },
      });
    }
  } catch (error) {
    var errorMessatge = getErrorMessage(error);
    yield put({
      type: actions.LOGIN_FAILURE,
      payload: { errorMessage: errorMessatge },
    });
  }
}

function* signup(action) {
  try {
    let { status, data } = yield call(() =>
      postRequest(
        `${AUTH.GENERATE_HASHCODE}?password=${action.payload.password}`,
        null
      )
    );

    if (status === RESPONSE_CODE[200]) {
      let { status: signupStatus, data: signupData } = yield call(() =>
        postRequest(
          `${AUTH.SIGNUP}`,
          JSON.stringify({
            firstName: action.payload.firstName,
            lastName: action.payload.lastName,
            emailAddress: action.payload.emailAddress,
            staticTypeId: action.payload.staticTypeId,
            isInvited: action.payload.isInvited,
            companyName: action.payload.companyName,
            password: data,
            ...(action.payload?.isBusiness && {
              isBusiness: action.payload.isBusiness,
            }),
          })
        )
      );

      if (signupStatus === RESPONSE_CODE[200]) {
        const { data: _data } = signupData;
        const payloadData = {
          isAuthenticated: true,
          loader: false,
          errorMessage: null,
          email: _data.emailAddress,
          accessToken: _data.token,
          emailVerified: false,
          userData: {
            ..._data,
            ...(action.payload?.isBusiness && {
              isBusiness: action.payload.isBusiness,
            }),
          },
        };
        setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, payloadData);
        yield put({
          type: actions.SIGNUP_SUCCESS,
          payload: payloadData,
        });
        action.FnCallback();
      } else {
        const LOCALE = DEFAULT_VALUE.LOCALE;
        yield put({
          type: actions.SIGNUP_FAILURE,
          payload: { errorMessage: RESPONSE_MESSAGES[LOCALE].SIGNUP_FAILURE },
        });
      }
    } else {
      const LOCALE = DEFAULT_VALUE.LOCALE;
      yield put({
        type: actions.SIGNUP_FAILURE,
        payload: { errorMessage: RESPONSE_MESSAGES[LOCALE].SIGNUP_FAILURE },
      });
    }
  } catch (error) {
    var friendyMessageList = getErrorMessage(error);
    yield put({
      type: actions.SIGNUP_FAILURE,
      payload: { errorMessage: friendyMessageList },
    });
    toast.error(friendyMessageList);
  }
}

function* verifyOtp(action) {
  try {
    let { status, data } = yield call(() =>
      postRequest(
        `${AUTH.VERIFY_OTP}`,
        JSON.stringify({ otp: action.payload.otp })
      )
    );
    if (
      status === RESPONSE_CODE[200] &&
      data.httpStatusCode === RESPONSE_CODE[200]
    ) {
      updateOtpVerification();
      yield put({
        type: actions.VERIFY_OTP_SUCCESS,
      });
    } else {
      const LOCALE = DEFAULT_VALUE.LOCALE;
      yield put({
        type: actions.VERIFY_OTP_FAILURE,
        payload: { errorMessage: RESPONSE_MESSAGES[LOCALE].SIGNUP_FAILURE },
      });
    }
  } catch (error) {
    const { data } = error;
    var friendyMessageList = getErrorMessage(error);
    yield put({
      type: actions.VERIFY_OTP_FAILURE,
      payload: { errorMessage: friendyMessageList },
    });
  }
}

function* getAuthUser() {
  try {
    const response = yield call(() => getRequest("auth/user"));
    yield put({ type: actions.GET_AUTH_USER_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: actions.GET_AUTH_USER_FAILURE });
  }
}

function* updateProfile(action) {
  const _data = action.payload;
  setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, _data);
}

function* emailVerifyProcess(action) {
  let _data = JSON.parse(localStorage.getItem(STORAGE_INDEXES.APP_STORAGE));
  _data["emailVerified"] = null;
  setOnLocalStorage(STORAGE_INDEXES.APP_STORAGE, _data);
}

function* logout() {
  try {
    const payloadData = defaultInitialState(STORAGE_INDEXES.APP_STORAGE);
    yield put({
      type: actions.LOGOUT_SUCCESS,
      payload: payloadData,
    });

    yield put({
      type: fa_actions.RESET,
    });

    yield put({
      type: ra_actions.RESET,
    });
    removeFromLocalStorage("AI_AVATAR_CONVERSATION");
  } catch (error) {
    // further execution
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.LOGIN, login),
    takeLatest(actions.SIGNUP, signup),
    takeLatest(actions.EMAIL_VERIFY_PROCESS, emailVerifyProcess),
    takeLatest(actions.VERIFY_OTP, verifyOtp),
    takeLatest(actions.LOGOUT, logout),
    takeLatest(actions.GET_AUTH_USER, getAuthUser),
    takeLatest(actions.UPDATE_PROFILE, updateProfile),
  ]);
}
