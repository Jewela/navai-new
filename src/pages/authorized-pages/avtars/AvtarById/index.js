import { useState, useEffect, lazy, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Chart from "react-apexcharts";
import "./charts.css";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../../../app/httpClient/axiosClient";
import actions, {
  ACTION_SERVICES,
  CART_ACTIONS,
} from "../../../../redux/authenticate/actions";
import {
  AUTH_ROUTE_SLUGS,
  RESPONSE_CODE,
  SUBSCRIPTION_TYPES,
} from "../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../app/constants";
//import { AUTH_ROUTE_SLUGS } from '../../../../app/constants';
import Spinner from "react-bootstrap/Spinner";

import usageData from "./usage.json";
import { AVTAR, MEDIA, SUBSCRIPTION } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import AuthJubmotron from "../../../../container/banner";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";
import ProfileOptions from "../ProfileOptions";
import { useDispatch, useSelector } from "react-redux";
// import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  seoFriendlyName,
  wordsCapping,
} from "../../../../utils/helpers/functions";
import toast, { Toaster } from "react-hot-toast";
import AvatarConfirmModal from "./AvatarConfirmModal";


const SubscriptionDetailDialog = lazy(() => import("./SubscriptionDetailDialog"));
const AvatarTrialDialog = lazy(() => import("./AvatarTrialDialog"));
const DeleteAvatar = lazy(() => import("../DeleteAvatar"));

const ProfileOptionsComponents = {
  personalDetails: "PersonalDetails",
  stories: "Stories",
  photoAlbum: "PhotoAlbum",
};

const CONFIRM_AVATAR_INIT = {
  modalActiveStaus: false,
  confirmTitle: "",
  isLoading: false,
  FnCallback: undefined,
  payloadStatus: undefined,
};

function AvtarById() {
  const {
    loader,
    successMessage,
    errorMessage,
    chatbotData = [],
    userData,
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const avatarImgRef = useRef(null);

  const [isLoading, setLoading] = useState(true);
  const [chartsData, setChartsData] = useState([]);
  const [showChart, setShowChart] = useState(false);
  const [isAvtarImgLoading, setAvtarImgLoading] = useState(false);
  const [isPublished, setPublished] = useState(false);
  const [isPublic, setPublic] = useState(false);

  const [avatarConfirmModal, setAvatarConfirmModal] =
    useState(CONFIRM_AVATAR_INIT);

  const [isDeleted, setIsDeleted] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [processingText, setProcessingText] = useState({
    type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_REGULAR,
    message: DEFAULT_VALUE.PROCESSING_TEXT.LOADING,
  });

  const [profileOptionType, setProfileOption] = useState(null);
  const [avtarDetail, setAvtarDetail] = useState({});
  const [lifeSummary, setLifeSummary] = useState("");
  const [seeMoreBio, setSeemoreBio] = useState(false);
  const [avatarImage, setAvatarImage] = useState("/images/avator-4.jpg");
  const [propSuccessMessage, setPropSuccessMessage] = useState("");
  const [cancelSubsLoading, setCancelSubsLoading] = useState(false);
  const [subscriptionDetail, setSubscriptionDetail] = useState({});
  const [subscriptionDetailStatus, setSubscriptionDetailStatus] = useState(false);
  const [showTrialDialog, setShowTrialDialog] = useState(false);


  const [getSubscriptionListLoading, setGetSubscriptionListLoading] = useState(false);

  const handleSeeMoreBio = () => {
    setSeemoreBio(!seeMoreBio);
  };

  const handleShowTrialDialog = (status = false) => {
    setShowTrialDialog(status);
  };

  const handleSubscriptionDetails = (status = false) => {
    setSubscriptionDetailStatus(status)
  }
  const categories = chartsData.map((v) => v?.date);
  // .map((data) => Object.keys(data).filter((key) => key.includes("2024-")))
  // .flat();

  const seriesData = chartsData.map((data) =>
    Object.values(data).filter((value) => typeof value === "number")
  );

  const chartSeries = [
    {
      name: "Usage",
      data: seriesData.flat(),
    },
  ];

  const getChartsData = async (avatarid) => {
    try {
      const { data } = await postRequest(AVTAR.GET_STATS, {
        avatarid,
      });
      const dataArray = Object.keys(data.response).map(
        (key) => data.response[key]
      );
      setChartsData(dataArray);
    } catch (error) {
      console.log("ressss", error);
    }
  };

  const getActiveSubscriptionList = async (url) => {
    try {
      const { status, data: { httpStatusCode, data } } = await postRequest(url, { "avatarId": params.id });
      setSubscriptionDetail(data);
      setLoading(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setLoading(false)
      toast.error(errorMessage);
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setCancelSubsLoading(true);
      const { status, data: { httpStatusCode, data } } = await postRequest(SUBSCRIPTION.CANCEL, {
        "avatarIds": [params.id]
      });
      setSubscriptionDetail({})
      setCancelSubsLoading(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setCancelSubsLoading(false)
      toast.error(errorMessage);
    }
  }

  useEffect(() => {
    async function getAvtarById(url) {
      const LOCALE = DEFAULT_VALUE.LOCALE;

      let payloadData = JSON.stringify({
        id: params.id,
      });

      try {
        const {
          status,
          data: { httpStatusCode },
          data: { data },
        } = await postRequest(url, payloadData);
        if (
          status === RESPONSE_CODE[200] &&
          httpStatusCode === RESPONSE_CODE[200]
        ) {
          setAvtarDetail(data);
          setLifeSummary(data?.personalDetailDto?.lifeSummary);
          const {
            images,
            isPublished: isAvatarPublished,
            isPublic: isAvatarPublic,
          } = data;
          setPublished(isAvatarPublished);
          setPublic(isAvatarPublic);
          dispatch({
            type: actions.CHATBOT_DATA,
            payload: { chatbotData: data.personalDetailDto?.defaultButton },
          });
          images.forEach(({ isProfile, ...rest }) => {
            if (isProfile) {
              setAvatarImage(rest.imageBlobUrl);
            }
          });

          const albumPhotos = images.filter((item) => item.isProfile === false);

          const separatedData = albumPhotos.reduce((acc, obj) => {
            const { mediaCategory } = obj;

            // Create a new array for the mediaCategory if it doesn't exist
            if (!acc[mediaCategory]) {
              acc[mediaCategory] = [];
            }

            // Add the object to the array for the corresponding mediaCategory
            acc[mediaCategory].push(obj);

            return acc;
          }, {});

          // Convert the result back to an array if needed
          const separatedArray = Object.values(separatedData);
        } else {
          setProcessingText({
            type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_ERROR,
            message: RESPONSE_MESSAGES[LOCALE].GET_AVTAR_ELSE_CASE,
          });
        }
        // setLoading(false);
        getActiveSubscriptionList(SUBSCRIPTION.ACTIVE)
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setProcessingText({
          type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_ERROR,
          message: errorMessage,
        });
        setLoading(false);
      }
    }
    getAvtarById(AVTAR.EDIT);
    getChartsData(params.id);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, [params.id, profileOptionType]);

  // async function publishAvatar() {
  //   try {
  //     dispatch(ACTION_SERVICES(actions.API_PROCESS));
  //     let payloadData = JSON.stringify({ avatarId: params.id });
  //     const {
  //       status,
  //       data: { result, httpStatusCode },
  //     } = await postRequest(AVTAR.PUBLISH, payloadData);
  //     if (
  //       httpStatusCode === RESPONSE_CODE[200] &&
  //       status === RESPONSE_CODE[200]
  //     ) {
  //       dispatch({
  //         type: actions.API_PROCESS_SUCCESS,
  //         payload: {
  //           loader: false,
  //           successMessage: "Avatar published successfully.",
  //         },
  //       });
  //     } else {
  //       dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
  //     }
  //   } catch (error) {
  //     dispatch(
  //       ACTION_SERVICES(
  //         actions.API_PROCESS_FAILURE,
  //         false,
  //         "Getting error while deleting. Please try again."
  //       )
  //     );
  //   }
  //   window.scrollTo(0, 0);
  // }

  const handleProfileOptions = (options) => {
    setProfileOption(options);
  };

  const handleAvatarImgChange = (event) => {
    setAvtarImgLoading(true);
    console.log(event);
    const file = event.target.files[0];
    let encodedFormatFile = null,
      fileName,
      contentType;
    fileName = seoFriendlyName(file.name);
    contentType = file.type;
    const _reader = new FileReader();
    _reader.readAsDataURL(file);
    _reader.onload = async () => {
      encodedFormatFile = _reader.result;
      var payloadData = {
        encodedFormatFile: encodedFormatFile,
        fileName: fileName,
        contentType: contentType,
      };
      console.log(payloadData);

      try {
        const response = await postRequest(MEDIA.UPLOAD_IMAGE, payloadData);
        const { status, data: imageUploadData } = response;
        if (
          status === RESPONSE_CODE[200] &&
          imageUploadData.httpStatusCode === RESPONSE_CODE[200]
        ) {
          const { imageId } = imageUploadData.data;
          console.log(imageId);

          const avatarPayload = {
            avatarId: params.id,
            imageId: imageId,
          };

          try {
            const avtarResponse = await putRequest(
              AVTAR.UPDATE_AVATAR_DP,
              avatarPayload
            );
            console.log(avtarResponse);
            const {
              status: avtarResStatus,
              data: { httpStatusCode },
            } = avtarResponse;
            console.log(avtarResStatus, httpStatusCode);
            if (
              avtarResStatus === RESPONSE_CODE[200] &&
              httpStatusCode === RESPONSE_CODE[200]
            ) {
              setAvtarImgLoading(false);
              toast.success("Avatar image updated successfully!");
              setAvatarImage(encodedFormatFile);
              window.scrollTo({
                top: 0,
                left: 0,
              });
            } else {
              setAvtarImgLoading(false);
              toast.error(`Couldn't update avatar image!`);
            }
          } catch (error) {
            setAvtarImgLoading(false);
            toast.error(`Couldn't update avatar image!`);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
  };

  const resetAvatarConfirmModal = () => {
    setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
  };

  const handlePublishStatus = (event) => {
    console.log(event.target.checked);
    console.log(avtarDetail?.hasAvatarActiveSubscription)
    if (!event.target.checked) {
      publishAvatar(params.id, false);
      return;
    }

    if (avtarDetail?.hasAvatarActiveSubscription) {
      // call publish
      publishAvatar(params.id, true);
    } else {
      // else case logic
      /*
      a. check box publish We need a logic to use trial if available in login data, ask user "Do want to use trial", if yes call publish pass the avatarid, set your local data for userlogin,  "isAvatarTrialAvailable": true,
      b. Trail is not available, use existing logic to publish.
      */
      console.log("isAvatarTrialAvailable: ", userData?.isAvatarTrialAvailable)
      if (userData?.isAvatarTrialAvailable) {
        // if case
        console.log('we got this if case....')
        handleShowTrialDialog(true);
      } else {
        // trail else case; 
        console.log('we got this else case....')
        // handleShowTrialDialog(true);
        handleChangePublishStatus(event);
        return
      }

    }
    //setPublished(event.target.checked);
  }
  const startAvatarTrial = async (avatarId, status) => {
    console.log({ avatarId, status });
    publishAvatar(avatarId, status, true);
    return;
  }

  const updateAvatarTrialAvailable = () => {
    dispatch({ type: actions.UPDATE_AVATAR_TRAIL_AVAILABLE });
  }

  const publishAvatar = async (paramsId = 0, isPublished = false, publishedForTrial = false) => {
    try {
      setAvatarConfirmModal((prevState) => ({ ...prevState, isLoading: true }));
      setGetSubscriptionListLoading(true);
      dispatch(ACTION_SERVICES(actions.API_PROCESS));
      let payloadData = JSON.stringify({
        avatarId: paramsId,
        isPublished: isPublished,
      });
      const {
        status,
        data: { result, httpStatusCode },
      } = await postRequest(AVTAR.PUBLISH, payloadData);
      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        setGetSubscriptionListLoading(false);
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false, successMessage: "" },
        });

        setPublished(isPublished);
        toast.success("Avatar publish status updated successfully!");
        setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
        if (publishedForTrial) {
          updateAvatarTrialAvailable();
        }
      } else {
        toast.error(`Couldn't process your request. please try again.`);
        setGetSubscriptionListLoading(false);
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false },
        });
        setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
      }
    } catch (error) {
      const {
        response: {
          data: { friendyMessageList },
        },
      } = error;
      console.log(friendyMessageList);
      // dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, "Getting error while publishing. Please try again."));
      toast.error(friendyMessageList[0]);
      setGetSubscriptionListLoading(false);
      dispatch({
        type: actions.API_PROCESS_SUCCESS,
        payload: { loader: false },
      });
      setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
    }
  }

  const handleChangePublishStatus = (event) => {
    handleAvatarPublishStatus(event.target.checked);
    // setAvatarConfirmModal({
    //   modalActiveStaus: true,
    //   confirmTitle: `Are you sure you want to <span className='text-${isPublished ? "danger text-danger1" : "success text-success1"
    //     }'>${isPublished ? "Unpublish" : "Publish/Add Subscription"}</span> it?`,
    //   // confirmTitle: `Publish/Add Subscription`,
    //   isLoading: false,
    //   FnCallback: handleAvatarPublishStatus,
    //   payloadStatus: event.target.checked,
    // });
  };

  async function getSubscriptionList(url) {
    setGetSubscriptionListLoading(true);

    const LOCALE = DEFAULT_VALUE.LOCALE;
    const payload = { avatarIds: avtarDetail?.Avatarid };
    try {
      const {
        status,
        data: {
          httpStatusCode,
          data: { totalPrice },
        },
      } = await getRequest(url, payload);
      console.log({ status, httpStatusCode });

      console.log(typeof totalPrice);

      if (
        status === RESPONSE_CODE[200] &&
        httpStatusCode === RESPONSE_CODE[200]
      ) {
        dispatch({
          type: CART_ACTIONS.UPDATE_CART,
          payload: {
            isBusiness: true,
            type: SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION,
            currency: "USD",
            currencySymbol: "$",
            cartItems: [
              {
                quantity: 1,
                price: totalPrice,
                currency: "USD",
                title: "Avatar subscription",
                subtitle: "lorem ipsum dummy text",
              },
            ],
            avatarDetails: avtarDetail,
          },
        });
        navigate(AUTH_ROUTE_SLUGS.SUBSCRIBE.CART);
      } else {
      }
      setGetSubscriptionListLoading(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setGetSubscriptionListLoading(false);
      if (errorMessage === "Please verify OTP.") {
        navigate(PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY);
      }
      toast.error(errorMessage);
    }
  }

  const handleAvatarPublishStatus = async (isPublished) => {
    console.log({ isPublished });
    console.log(avtarDetail?.hasAvatarActiveSubscription);

    // handling avatar subsription
    /**
     * hasAvatarActiveSubscription filter param key. navigate to cart with avatar id if false, if true publish
     *
     */
    if (!avtarDetail?.hasAvatarActiveSubscription && isPublished) {
      console.log("good to go....");
      getSubscriptionList(SUBSCRIPTION.LIST);
      return false;
    }
    // end of handling avatar subsription

    try {
      setAvatarConfirmModal((prevState) => ({ ...prevState, isLoading: true }));
      setGetSubscriptionListLoading(true);
      dispatch(ACTION_SERVICES(actions.API_PROCESS));
      let payloadData = JSON.stringify({
        avatarId: params.id,
        isPublished: isPublished,
      });
      const {
        status,
        data: { result, httpStatusCode },
      } = await postRequest(AVTAR.PUBLISH, payloadData);
      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        setGetSubscriptionListLoading(false);
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false, successMessage: "" },
        });

        setPublished(isPublished);
        toast.success("Avatar publish status updated successfully!");
        setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
      } else {
        toast.error(`Couldn't process your request. please try again.`);
        setGetSubscriptionListLoading(false);
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false },
        });
        setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
      }
    } catch (error) {
      const {
        response: {
          data: { friendyMessageList },
        },
      } = error;
      console.log(friendyMessageList);
      // dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, "Getting error while publishing. Please try again."));
      toast.error(friendyMessageList[0]);
      setGetSubscriptionListLoading(false);
      dispatch({
        type: actions.API_PROCESS_SUCCESS,
        payload: { loader: false },
      });
      setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
    }
    window.scrollTo(0, 0);
  };

  const handleChangePublicStatus = (event) => {
    setAvatarConfirmModal({
      modalActiveStaus: true,
      confirmTitle: `Are you sure you want to make avatar as <span className='text-${isPublic ? "danger text-danger1" : "success text-success1"
        }'>${isPublic ? "Private" : "Public"}</span>?`,
      isLoading: false,
      FnCallback: handleAvatarPublicStatus,
      payloadStatus: !event.target.checked,
    });
  };

  const handleAvatarPublicStatus = async (isPublic) => {
    try {
      setAvatarConfirmModal((prevState) => ({ ...prevState, isLoading: true }));
      dispatch(ACTION_SERVICES(actions.API_PROCESS));
      let payloadData = JSON.stringify({
        avatarId: params.id,
        isPublic: isPublic,
      });
      const {
        status,
        data: { result, httpStatusCode },
      } = await postRequest(AVTAR.PUBLIC, payloadData);
      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false, successMessage: "" },
        });
        setPublic(isPublic);
        toast.success("Avatar public status updates successfully!");
        setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
      } else {
        toast.error(`Couldn't process your request. please try again.`);
        dispatch({
          type: actions.API_PROCESS_SUCCESS,
          payload: { loader: false },
        });
        setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
      }
    } catch (error) {
      const {
        response: {
          data: { friendyMessageList },
        },
      } = error;
      console.log(friendyMessageList);
      // dispatch(ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, "Getting error while publishing. Please try again."));
      toast.error(friendyMessageList[0]);
      dispatch({
        type: actions.API_PROCESS_SUCCESS,
        payload: { loader: false },
      });
      setAvatarConfirmModal(CONFIRM_AVATAR_INIT);
    }
    window.scrollTo(0, 0);
  };

  if (isLoading) {
    return (
      <>
        <div className="loading1 mt-5 pre-loading">
          <Spinner
            className="mb-2"
            as="span"
            animation="grow"
            size="lg"
            role="status"
            aria-hidden="true"
          />
        </div>
      </>
    );
  }

  if (processingText.message && Object.keys(avtarDetail).length === 0) {
    return (
      <>
        <AuthJubmotron title="Edit Avator" />
        <section className="edit-avator spacer-lg">
          <div className="container text-center">
            <div className="row">
              <h2 className="h3 text-error mb-3">{processingText.message}!</h2>
            </div>
            <Button className="mm-auto" onClick={() => navigate("/avtars")}>
              Go to avatars
            </Button>
          </div>
        </section>
      </>
    );
  }

  if (isDeleted) {
    return (
      <>
        <AuthJubmotron title="Edit Avator" />
        <section className="edit-avator spacer-lg">
          <div className="container text-center">
            <div className="row">
              <h2 className="h3 mb-3">Avatar has deleted successfully!</h2>
            </div>
            <Button
              className="mx-auto btn primary-btn"
              onClick={() => navigate("/avtars")}
            >
              Go to avatars
            </Button>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="page-heading light-bg py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 col-lg-12 position-relative text-center">
              {/* <h1 className="mb-0 h2 fw-bold">Edit {avtarDetail.name}</h1> */}
              <h1 className="mb-0 h2 fw-bold">Admin Dashboard</h1>
              {!showChart && (
                <Button
                  className="position-absolute end-0 top-0"
                  onClick={() => setShowChart(true)}
                >
                  Show Usage
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      {profileOptionType ? (
        <ProfileOptions
          propSuccessMessage={setPropSuccessMessage}
          option={profileOptionType}
          avatar={avtarDetail}
          setProfileOption={setProfileOption}
        />
      ) : (
        <div className="position--relative">
          {showChart ? (
            <div
              className="dsdsdsdsd"
              style={{
                paddingLeft: "20%",
              }}
            >
              <span
                onClick={() => setShowChart(false)}
                style={{ cursor: 'pointer' }}
                className="text-white text-sm"
              >
                <i className="ri-arrow-left-line"></i> Back
              </span>
              <Chart
                className=""
                options={{
                  dataLabels: {
                    enabled: false,
                  },
                  tooltip: {
                    style: { fontSize: "16px" },
                  },
                  chart: {
                    // locales

                    toolbar: {
                      show: true,
                      offsetX: 0,
                      offsetY: 0,
                      tools: {
                        download: true,
                        selection: true,
                        zoom: true,
                        zoomin: true,
                        zoomout: true,
                        pan: true,
                        reset:
                          true |
                          '<img src="/static/icons/reset.png" width="20">',
                        customIcons: [],
                      },
                      export: {
                        csv: {
                          filename: undefined,
                          columnDelimiter: ",",
                          headerCategory: "category",
                          headerValue: "value",
                          categoryFormatter(x) {
                            return new Date(x).toDateString();
                          },
                        },
                        svg: {
                          filename: undefined,
                        },
                        png: {
                          filename: undefined,
                        },
                      },
                      autoSelected: "zoom",
                    },

                    type: "bar",
                  },
                  xaxis: {
                    categories,
                  },
                  title: {
                    text: "Usage Chart",
                    align: "center",
                  },
                }}
                series={chartSeries}
                type="bar"
                width={"70%"}
                height={350}
              />
            </div>
          ) : (
            <section className="edit-avator mt-5">
              <div className="container">
                {propSuccessMessage != "" && (
                  <div className="row justify-content-center">
                    <div className="text-success mx-auto col-md-9 mb-3">
                      <span className="h4">{propSuccessMessage}</span>
                    </div>
                  </div>
                )}

                {successMessage && (
                  <div className="row justify-content-center">
                    <div className="text-success mx-auto col-md-9 mb-3">
                      <span className="h4">{successMessage}</span>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <div className="row justify-content-center">
                    <div className="text-error mx-auto col-md-9 mb-3">
                      <span className="h4">{errorMessage}</span>
                    </div>
                  </div>
                )}

                <div className="row justify-content-center">
                  <div className="col-md-8 mx-auto">
                    <div className="edit-avator__inner">
                      <div className="edit-avator__img position-relative text-center">
                        {/* <div className="fav">
                                        <input type="checkbox" id={avtarDetail.name} />
                                        <label htmlFor={avtarDetail.name}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.52853C14.35 2.42 17.98 2.49 20.2426 4.75736C22.5053 7.02472 22.583 10.637 20.4786 12.993L11.9999 21.485L3.52138 12.993C1.41705 10.637 1.49571 7.01901 3.75736 4.75736C6.02157 2.49315 9.64519 2.41687 12.001 4.52853Z"></path></svg>
                                        </label>
                                    </div> */}

                        {isAvtarImgLoading && (
                          <div className="cls-absolute">
                            <div
                              className="spinner-border text-primary"
                              role="status"
                            >
                              <span className="sr-only">Loading...</span>
                            </div>
                          </div>
                        )}
                        <img
                          src={avatarImage}
                          alt={avtarDetail.name}
                          className={`rounded-10 w-100 ${isAvtarImgLoading && "bg-overlay"
                            }`}
                        />
                        <span
                          className="pointer"
                          onClick={() => avatarImgRef.current.click()}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            width="20"
                            height="20"
                          >
                            <path
                              d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"
                              fill="#906ab9"
                            ></path>
                          </svg>
                        </span>
                        <input
                          ref={avatarImgRef}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleAvatarImgChange}
                        />
                      </div>

                      <div className="edit-avator__details">
                        <h2 className="h3 text-capitalize mb-3">
                          {avtarDetail.name}
                        </h2>
                        {lifeSummary &&
                          lifeSummary.length >= 150 &&
                          !seeMoreBio ? (
                          <>
                            <p className="mb-0">
                              <span>{wordsCapping(lifeSummary, 150)}</span>
                              <span
                                className="mx-2 text-highlight fw-bold"
                                onClick={handleSeeMoreBio}
                                role="button"
                              >
                                See more
                              </span>
                            </p>
                          </>
                        ) : (
                          <p className="mb-0">
                            <span>{lifeSummary}</span>
                            {lifeSummary &&
                              lifeSummary.length >= 150 &&
                              seeMoreBio && (
                                <span
                                  className="mx-2 text-highlight fw-bold"
                                  onClick={handleSeeMoreBio}
                                  role="button"
                                >
                                  See less
                                </span>
                              )}
                          </p>
                        )}
                        {/* <button className='btn btn-xs btn-info mt-3' onClick={() => publishAvatar()}>Publish Avatar</button> */}

                        <button
                          className="btn primary-btn mt-4"
                          onClick={() => setDeleteModalShow(true)}
                        >
                          Delete Avatar
                        </button>

                        {Object.keys(subscriptionDetail).length > 0 && subscriptionDetail?.paymentGateway !== "None" &&
                          <>
                            <button className="btn btn-sm btn-danger mt-4 ms-2" onClick={handleCancelSubscription}>
                              Cancel Subscription&nbsp;
                              {cancelSubsLoading &&
                                <Spinner
                                  className="mb-2"
                                  as="span"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              }
                            </button>
                            <button className="btn btn-sm primary-btn mt-4 ms-2" onClick={handleSubscriptionDetails}>
                              Subscription Details&nbsp;
                              {cancelSubsLoading &&
                                <Spinner
                                  className="mb-2"
                                  as="span"
                                  size="sm"
                                  role="status"
                                  aria-hidden="true"
                                />
                              }
                            </button>
                          </>
                        }

                        {/* <div className="mt-3">
                          <input
                            className="business-ai-avatar"
                            type="checkbox"
                            id="publish-avatarId"
                            checked={isPublished}
                            onChange={(event) =>
                              loader
                                ? undefined
                                : handleChangePublishStatus(event)
                            }
                            disabled={getSubscriptionListLoading}
                          />
                          <label className="mx-2" htmlFor="publish-avatarId">
                            Publish/Add Subscription
                          </label>
                          {getSubscriptionListLoading && (
                            <Spinner
                              className="loadmore-btn"
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                        </div> */}
                        <div className="mt-3">
                          <input
                            className="business-ai-avatar"
                            type="checkbox"
                            id="publish-avatarId"
                            checked={isPublished}
                            onChange={(event) =>
                              loader
                                ? undefined
                                : handlePublishStatus(event)
                            }
                            disabled={getSubscriptionListLoading}
                            role="button"
                          />
                          <label className="mx-2" htmlFor="publish-avatarId" role="button">
                            Publish
                          </label>
                          {getSubscriptionListLoading && (
                            <Spinner
                              className="loadmore-btn"
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        <div className="mt-3" >
                          <input
                            className="business-ai-avatar"
                            type="checkbox"
                            id="subscription-avatarId"
                            checked={Object.keys(subscriptionDetail).length > 0 && subscriptionDetail?.paymentGateway !== "None" ? true : false}
                            onChange={(event) =>
                              loader
                                ? undefined
                                : getSubscriptionList(SUBSCRIPTION.LIST)
                            }
                            disabled={(getSubscriptionListLoading) || (Object.keys(subscriptionDetail).length > 0 && subscriptionDetail?.paymentGateway !== "None")}
                            role="button"

                          />
                          <label className="mx-2" htmlFor="subscription-avatarId" role="button">
                            Add Subscription
                          </label>
                          {getSubscriptionListLoading && (
                            <Spinner
                              className="loadmore-btn"
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          )}
                        </div>
                        {/* <div className="mt-3">
                        <input
                          className=""
                          type="checkbox"
                          id="private-status"
                          checked={!isPublic}
                          onChange={(event) =>
                            loader ? undefined : handleChangePublicStatus(event)
                          }
                        />
                        <label className="mx-2" htmlFor="private-status">
                          Privatse
                        </label>
                      </div> */}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-9 mt-5 mx-auto">
                    <div className="profile__options">
                      <div
                        onClick={() =>
                          handleProfileOptions(
                            ProfileOptionsComponents.personalDetails
                          )
                        }
                        className={`csr-pointer h3 rounded-10 ${userData?.isSubscriptionActive == false
                          ? "pe-none disabled-btn"
                          : ""
                          }`}
                      >
                        <i className="ri-user-line"></i>
                        <div className="h4">Agent Details</div>
                        <span> Click here</span>
                      </div>
                      <div
                        onClick={() =>
                          handleProfileOptions(ProfileOptionsComponents.stories)
                        }
                        className={`csr-pointer h3 rounded-10 ${userData?.isSubscriptionActive == false
                          ? "pe-none disabled-btn"
                          : ""
                          }`}
                      >
                        <i className="ri-chat-4-line"></i>
                        <div className="h4">Document</div>
                        <span> Click here</span>
                      </div>
                      <div
                        onClick={() =>
                          handleProfileOptions(
                            ProfileOptionsComponents.photoAlbum
                          )
                        }
                        className={`csr-pointer h3 rounded-10 ${userData?.isSubscriptionActive == false
                          ? "pe-none disabled-btn"
                          : ""
                          }`}
                      >
                        <i className="ri-image-line"></i>
                        <div className="h4">Photos</div>
                        <span> Click here</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {avatarConfirmModal.modalActiveStaus && (
                <AvatarConfirmModal
                  propDetails={avatarConfirmModal}
                  onHide={resetAvatarConfirmModal}
                  getSubscriptionListLoading={getSubscriptionListLoading}

                // modalActiveStaus={avatarConfirmModal.modalActiveStaus}
                // confirmTitle={avatarConfirmModal.confirmTitle}
                // isLoading={avatarConfirmModal.isLoading}
                // FnCallback={avatarConfirmModal.FnCallback}
                // payloadStatus={avatarConfirmModal.payloadStatus}
                />
              )}
            </section>
          )}
          <DeleteAvatar
            setIsDeleted={setIsDeleted}
            setProfileOption={setProfileOption}
            id={params.id}
            show={deleteModalShow}
            onHide={() => setDeleteModalShow(false)}
          />
          {showTrialDialog &&
            <AvatarTrialDialog
              show={showTrialDialog ? true : false}
              onHide={() => handleShowTrialDialog()}
              FnCallback={() => startAvatarTrial(params.id, true, true)}
              backdrop="static"
              keyboard={false}
            />
          }
          {subscriptionDetailStatus &&
            <SubscriptionDetailDialog
              show={subscriptionDetailStatus ? true : false}
              onHide={() => handleSubscriptionDetails()}
              backdrop="static"
              keyboard={false}
              subscriptionDetail={subscriptionDetail}
            />
          }
        </div>
      )}
    </>
  );
}

export default AvtarById;
