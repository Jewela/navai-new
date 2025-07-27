import { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../../app/httpClient/axiosClient";
import actions, { ACTION_SERVICES } from "../../../redux/authenticate/actions";
import {
  AUTH_ROUTE_SLUGS,
  DEFAULT_VALUE,
  PROTECTED_ROUTE_SLUGS,
  RESPONSE_CODE,
} from "../../../app/constants";
import AuthJubmotron from "../../../container/banner/";
import Spinner from "react-bootstrap/Spinner";
import { AVTAR, MEDIA } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { RESPONSE_MESSAGES } from "../../../app/constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { seoFriendlyName } from "../../../utils/helpers/functions";
import toast from "react-hot-toast";
import ChangePasswordForm from "../change-password-form";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loader,
    errorMessage,
    userData: { id: userId, isBusiness, companyName = "", ...props },
  } = useSelector((state) => state.auth);

  const [isLoading, setLoading] = useState(false);
  const [changePasswordStatus, setChangePasswordStatus] = useState(false);
  const avatarImgRef = useRef(null);
  const [isAvtarImgLoading, setAvtarImgLoading] = useState(false);

  const [isEditable, setEditable] = useState(false);

  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    image: null,
    companyName: "",
  });

  const handleInputChange = useMemo(
    () => (event) => {
      const { name, value } = event.target;
      setUserDetails({ ...userDetails, [name]: value });
    },
    [userDetails]
  );

  const handleEditable = () => {
    setEditable(true);
  };

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        firstName: yup.string().required("First name is required"),
        lastName: yup.string().required("Last name is required"),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    trigger,
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);

    const payloadData = {
      firstName: data.firstName,
      lastName: data.lastName,
    };

    try {
      const response = await putRequest(AVTAR.UPDATE_USER_PROFILE, payloadData);
      const { status, data } = response;
      if (
        status === RESPONSE_CODE[200] &&
        data.httpStatusCode === RESPONSE_CODE[200]
      ) {
        toast.success("Profile updated successfully");
        setLoading(false);
        setEditable(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleAvatarImgChange = (event) => {
    setAvtarImgLoading(true);
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

      try {
        const response = await postRequest(MEDIA.UPLOAD_IMAGE, payloadData);
        const { status, data: imageUploadData } = response;
        if (
          status === RESPONSE_CODE[200] &&
          imageUploadData.httpStatusCode === RESPONSE_CODE[200]
        ) {
          const { imageId } = imageUploadData.data;
          const {
            contentType: IMGcontentType,
            fileName: IMGfileName,
            imageBlobUrl: IMGimageBlobUrl,
          } = imageUploadData?.data;
          // return

          const avatarPayload = {
            id: userId,
            fileName: IMGfileName,
            imageBlobUrl: IMGimageBlobUrl,
            contentType: IMGcontentType,
          };

          try {
            const avtarProfileResponse = await postRequest(
              AVTAR.UPLOAD_PROFILE_IMAGE,
              avatarPayload
            );
            const {
              status: avtarResStatus,
              data: { httpStatusCode },
            } = avtarProfileResponse;
            if (
              avtarResStatus === RESPONSE_CODE[200] &&
              httpStatusCode === RESPONSE_CODE[200]
            ) {
              setAvtarImgLoading(false);
              toast.success("Avatar image updated successfully!");
              // setAvatarImage(encodedFormatFile);
              setUserDetails({
                ...userDetails,
                image: { imageBlobUrl: IMGimageBlobUrl },
              });

              dispatch({
                type: actions.UPDATE_PROFILE_IMAGE,
                payload: { imageUrl: IMGimageBlobUrl },
              });

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

  const handleChangePassword = (event) => {
    setChangePasswordStatus((prevState) => !prevState);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }

  useEffect(() => {
    async function getProfile(url) {
      dispatch(ACTION_SERVICES(actions.API_PROCESS));
      const LOCALE = DEFAULT_VALUE.LOCALE;
      try {
        const {
          status,
          data: { httpStatusCode },
          data: { data },
        } = await getRequest(url);

        if (
          status === RESPONSE_CODE[200] &&
          httpStatusCode === RESPONSE_CODE[200]
        ) {
          setUserDetails(data);
          dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
          setValue("firstName", data.firstName);
          setValue("lastName", data.lastName);
          setValue("image", data.image);
          if (isBusiness) {
            setValue("companyName", companyName);

          }
        } else {
          dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);

        if (errorMessage === "Please verify OTP.") {

          // navigate(PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY);
        } else {
          dispatch(
            ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, errorMessage)
          );
        }
      }
    }
    getProfile(AVTAR.PROFILE);
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  if (loader) {
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
          <p className="">{DEFAULT_VALUE.PROCESSING_TEXT.LOADING}</p>
        </div>
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <AuthJubmotron title="My Profile" />
        <section className="edit-avator spacer-lg">
          <div className="container text-center">
            <div className="row">
              <h2 className="h3 text-error mb-3">{errorMessage}!</h2>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <AuthJubmotron title="My Profile" />

      <section className="profile spacer-lg">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="profile-blk">
                {changePasswordStatus
                  ? <><ChangePasswordForm
                    changePasswordStatus={changePasswordStatus}
                    setChangePasswordStatus={setChangePasswordStatus}
                  /></>
                  : <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="form__fields mb-3">
                      <div className="profile-img">
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
                        <span
                          onClick={() => avatarImgRef.current.click()}
                          role="button"
                        >
                          {/* <span> */}
                          <svg
                            aria-hidden="true"
                            focusable="false"
                            data-prefix="fas"
                            data-icon="pen"
                            className="svg-inline--fa fa-pen "
                            role="img"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                          >
                            <path
                              fill="currentColor"
                              d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z"
                            ></path>
                          </svg>
                        </span>
                        {userDetails.image ? (
                          <img
                            src={userDetails.image.imageBlobUrl}
                            className={`rounded-10 w-100 ${isAvtarImgLoading && "bg-overlay"
                              }`}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon={faCircleUser}
                            style={{ color: "#808ce3", fontSize: "10em" }}
                            className={`rounded-10  w-100 ${isAvtarImgLoading && "bg-overlay"
                              }`}
                          />
                        )}
                        <input
                          ref={avatarImgRef}
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={handleAvatarImgChange}
                        />
                      </div>
                    </div>
                    <div className="form__fields mb-3">
                      <label>First name</label>
                      <input
                        {...register("firstName")}
                        readOnly={!isEditable}
                        type="text"
                        placeholder="First name"
                        className={`form-control ${!isEditable ? "readonly" : ""
                          }`}
                      />
                      {errors.firstName && isEditable && (
                        <p className="text-error">{errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="form__fields mb-3">
                      <label>Last name</label>
                      <input
                        {...register("lastName")}
                        readOnly={!isEditable}
                        type="text"
                        placeholder="Last Name"
                        className={`form-control ${!isEditable ? "readonly" : ""
                          }`}
                      />
                      {errors.lastName && isEditable && (
                        <p className="text-error">{errors.lastName.message}</p>
                      )}
                    </div>
                    {isBusiness &&
                      <div className="form__fields mb-3">
                        <label>Company name</label>
                        <input
                          {...register("companyName")}
                          readOnly
                          type="text"
                          placeholder="Company Name"
                          className={`form-control ${!isEditable ? "readonly" : ""
                            }`}
                        />
                      </div>
                    }
                    <div className="form__fields mb-3">
                      <label>Email address</label>
                      <input
                        readOnly
                        type="email"
                        name="emailAddress"
                        value={userDetails.emailAddress}
                        placeholder="Email address"
                        className="form-control readonly"
                      />
                    </div>
                    <div className="form__fields">
                      <div className="button-group">
                        <button
                          type="button"
                          onClick={() => handleEditable()}
                          className="btn primary-btn"
                        >
                          Edit
                        </button>
                        <button
                          disabled={!isEditable || isLoading}
                          type="submit"
                          className="btn primary-btn"
                        >
                          Sav{!isLoading && "e"}
                          {isLoading && (
                            <>
                              <span>ing&nbsp;</span>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                              />
                            </>
                          )}
                        </button>
                      </div>
                      <div className="mt-3 d-flex justify-content-center">
                        <button
                          type="button"
                          onClick={() => handleChangePassword()}
                          className="btn primary-btn"
                        >
                          Change Password
                        </button>
                      </div>
                    </div>
                  </form>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
