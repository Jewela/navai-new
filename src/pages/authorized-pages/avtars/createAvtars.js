import { useEffect, useState } from "react";
import { useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import actions, { ACTION_SERVICES } from "../../../redux/authenticate/actions";
import { AVTAR, MEDIA } from "../../../app/config/endpoints";
import { seoFriendlyName } from "../../../utils/helpers/functions";
import { postRequest } from "../../../app/httpClient/axiosClient";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../app/constants/enums";
import {
  AUTH_ROUTE_SLUGS,
  CHATBOT_URL,
  DEFAULT_VALUE,
  EMBEDED_CHATBOT_URL,
  RESPONSE_CODE,
} from "../../../app/constants";
import { RESPONSE_MESSAGES } from "../../../app/constants/localizedStrings";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import AvatarMenu from "./AvatarMenu";

function CreateAvtars() {
  const navigate = useNavigate();
  const {
    loader,
    errorMessage,
    userData: { id, isBusiness, companyName },
  } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [file, setFile] = useState(null);
  const profileImgRef = useRef(null);
  const [isPrivateChecked, setIsPrivateChecked] = useState(false);
  const [aiAgent, setAiAgent] = useState(false);
  const [isMarkedAsPet, setIsMarkedAsPet] = useState(false);

  const validationSchema = yup.object().shape({
    avtarFullName: yup.string().required("Name is required"),
    ...(isBusiness
      ? {
        agentType: yup.string().required("Agent type is required"),
      }
      : {
        avtarGender: yup.string().required("Gender is required"),
        avatarType: yup.string().required("Avatar type is required"),
      }),
    avtarProfileImage: yup
      .mixed()
      .required("Please upload an image")
      .test(
        "fileType",
        "Only image files with extensions jpeg, jpg, png, or mpeg are allowed",
        (value) => {
          if (!value || !value[0]) {
            return true; // no file uploaded, validation passed
          }

          const fileExtension = value[0].name.split(".").pop().toLowerCase();
          const validTypes = ["jpeg", "jpg", "png", "mpeg"];

          const fileType = fileExtension;
          return validTypes.includes(fileType);
        }
      ),
  });

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      // defaultValues,
      // validatingFields,
      // isLoading,
      // isDirty,
      // isValid,
      // isValidating,
    },
    setValue,
    trigger,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      avtarProfileImage: null,
      ...(isBusiness && {
        avatarType: ENUM_AVTAR.TYPE.HUMAN,
        companyName: companyName,
      }),
    },
  });

  const onSubmit = (data) => {
    console.log("data: ", data);
    console.log(getCategoryEnum(aiAgent))
    // return false;
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
        encodedFormatFile,
        fileName: fileName,
        contentType: contentType,
      };

      const LOCALE = DEFAULT_VALUE.LOCALE;

      try {
        dispatch(ACTION_SERVICES(actions.API_PROCESS));
        const response = await postRequest(MEDIA.UPLOAD_IMAGE, payloadData);
        const { status, data: imageUploadData } = response;
        if (
          status === RESPONSE_CODE[200] &&
          imageUploadData.httpStatusCode === RESPONSE_CODE[200]
        ) {
          const { imageId } = imageUploadData.data;

          const avtarPayloadData = {
            name: data.avtarFullName,
            avatarGenderEnum: data.avtarGender,
            avatarTypeEnum: data.agentType,
            imageId,
            isPublic: !isPrivateChecked,
            ...(isBusiness && {
              // avatarCategoryEnum: +(aiAgent == "business"),
              // interal ai agent enum will be 3 // confirmed.
              // avatarCategoryEnum: aiAgent == "business" ? 0 : 2,
              avatarCategoryEnum: getCategoryEnum(aiAgent),
            }),
            businessName: data?.companyName
          };

          try {
            const avtarResponse = await postRequest(
              AVTAR.CREATE,
              avtarPayloadData
            );
            const { status: avtarResStatus, data: avtarResData } =
              avtarResponse;

            if (
              avtarResStatus === RESPONSE_CODE[200] &&
              avtarResData.httpStatusCode === RESPONSE_CODE[200]
            ) {
              const { avatarId } = avtarResData.data;
              updateAvatarEmbededDetails(avatarId)
              // dispatch(ACTION_SERVICES(actions.API_PROCESS_SUCCESS, false));
              // toast.success("Avatar created successfully!");
              // navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);
            } else {
              dispatch(
                ACTION_SERVICES(
                  actions.API_PROCESS_FAILURE,
                  false,
                  RESPONSE_MESSAGES[LOCALE].AVTAR_CREATE_FAILED
                )
              );
              toast.error(RESPONSE_MESSAGES[LOCALE].AVTAR_CREATE_FAILED);
            }
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            dispatch(
              ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, errorMessage)
            );
            toast.error(errorMessage);
            if (
              errorMessage ===
              RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].ERROR_OTP_VERIFICATION
            ) {
              navigate(`/email-verify`);
            }
          }
        } else {
          dispatch(
            ACTION_SERVICES(
              actions.API_PROCESS_FAILURE,
              false,
              RESPONSE_MESSAGES[LOCALE].IMAGE_UPLOAD_FAILED
            )
          );
          toast.error(RESPONSE_MESSAGES[LOCALE].IMAGE_UPLOAD_FAILED);
        }
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        dispatch(
          ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, errorMessage)
        );
        toast.error(errorMessage);
        if (
          errorMessage ===
          RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].ERROR_OTP_VERIFICATION
        ) {
          navigate(`/email-verify`);
        }
      }
    };
  };

  const getCategoryEnum = (type) => {
    switch (type) {
      case "business":
        return 0
      case "content":
        return 2;
      case "internal":
        return 3
    }
  }

  const updateAvatarEmbededDetails = async (avatarId) => {
    try {
      // AVTAR.UPLOAD_PROFILE_SECTION
      const payloadData = {
        avatarId: avatarId,
        personalDetail: {
          avatarEmbeddedText: `<script src="${EMBEDED_CHATBOT_URL.replace('{AVATAR_ID}', avatarId)}"></script>`,
          shareAvatarUrl: CHATBOT_URL.replace('{AVATAR_ID}', avatarId),
          businessName: companyName
        }
      };

      console.log(payloadData);
      const { status, data: { httpStatusCode, data } } = await postRequest(AVTAR.UPLOAD_PROFILE_SECTION, payloadData);
      console.log({ status, httpStatusCode, data });

      dispatch(ACTION_SERVICES(actions.API_PROCESS_SUCCESS, false));
      toast.success("Avatar created successfully!");
      navigate(AUTH_ROUTE_SLUGS.AVTAR.LIST);

    } catch (error) {
      console.error("Getting error while updating avatar embeded details", error);
      dispatch(ACTION_SERVICES(actions.API_PROCESS_SUCCESS, false));
    }
  }

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setValue("avtarProfileImage", (e) => {
      const newValue = e.target.files[0];
      // perform validation here if needed
      return newValue;
    });
    trigger("avtarProfileImage");
  };

  const handleRemoveImg = () => {
    setFile(null);
    setValue("avtarProfileImage");
    trigger("avtarProfileImage");
  };

  const handleCheckboxChange = (event) => {
    if (isBusiness) {
      setAiAgent(event.target.value);
      setValue("agentType", +(event.target.value == "business"));
    } else setIsPrivateChecked(event.target.checked);
  };

  const handleAvatarTypeChange = (event) => {
    const {
      target: { checked },
    } = event;

    if (!checked) {
      setIsMarkedAsPet(checked);
      return setValue("avatarType", ENUM_AVTAR.TYPE.HUMAN);
    }
    setIsMarkedAsPet(checked);
    setValue("avatarType", null);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    // let avatarId = 12222;
    // const payloadData = {
    //   avatarEmbeddedText: `<script src="${EMBEDED_CHATBOT_URL.replace('{AVATAR_ID}', avatarId)}"></script>`,
    //   shareAvatarUrl: CHATBOT_URL.replace('{AVATAR_ID}', avatarId)
    // };
    // console.log(payloadData);
  }, []);

  return (
    <>
      <section className="page-heading light-bg py-5">
        <div className="container">
          <div className="row position-relative">
            <div className="col-md-12 text-center position-relative">
              <h1 className="mb-0 h2 fw-bold">
                {isBusiness ? "Create AI Agent" : "Create Avatar"}
              </h1>
            </div>
            {isBusiness &&
              <AvatarMenu />
            }
          </div>
        </div>
      </section>
      <section className="profile spacer-lg">
        <div className="container">
          <div className="row">
            <div className="col-md-9 mx-auto">
              {isBusiness ? (
                <div className="box-wrap">
                  <div className="box-header">
                    <h2 className="h3 mb-0">Create AI Agent</h2>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="">Name</label>
                          <input
                            type="text"
                            {...register("avtarFullName")}
                            name="avtarFullName"
                            placeholder="Avtar name"
                            className="form-control"
                          />
                          {errors.avtarFullName && (
                            <p className="error-message">
                              {errors.avtarFullName.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="">Company Name</label>
                          <input
                            type="text"
                            {...register("companyName")}
                            name="companyName"
                            placeholder="Company Name"
                            className="form-control opacity-0p5 cursor-not-allowed"
                            readOnly
                          />
                        </div>
                        <div className="col-md-12 mb-3">
                          <label htmlFor="">Upload Image</label>
                          <div
                            onClick={() => file ? undefined : profileImgRef.current.click()}
                            className="drop-zone"
                          >
                            {file ? (
                              <>
                                <div className="img-preivew">
                                  <img
                                    className="img-thumbnail rounded mx-auto d-block"
                                    src={URL.createObjectURL(file)}
                                    alt="profile-picture"
                                  />
                                  <FontAwesomeIcon
                                    onClick={handleRemoveImg}
                                    className="text-danger"
                                    icon={faCircleXmark}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="drop-zone__prompt">
                                  Click to upload
                                </span>
                                <input
                                  {...register("avtarProfileImage")}
                                  ref={profileImgRef}
                                  type="file"
                                  accept="image/*"
                                  name="avtarProfileImage"
                                  className="d-none"
                                  onChange={handleProfileImgChange}
                                />
                              </>
                            )}
                          </div>
                          {errors.avtarProfileImage && (
                            <p className="error-message">
                              {errors.avtarProfileImage.message}
                            </p>
                          )}
                        </div>

                        <div className="col-md-12 mb-3">
                          <input
                            id="asBusiness"
                            type="checkbox"
                            checked={aiAgent == "business"}
                            onChange={handleCheckboxChange}
                            value={"business"}
                            name="private"
                          />
                          <label
                            className="csr-pointer d-inline-block mb-0 pb-0 mx-2"
                            htmlFor="asBusiness"
                          >
                            Business Support AI Agent
                          </label>
                        </div>
                        <div className="col-md-12 mb-3">
                          <input
                            id="asContent"
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            checked={aiAgent == "content"}
                            value={"content"}
                            name="private"
                          />
                          <label
                            className="csr-pointer d-inline-block mb-0 pb-0 mx-2"
                            htmlFor="asContent"
                          >
                            Content AI Agent
                          </label>
                        </div>
                        <div className="col-md-12 mb-3">
                          <input
                            id="asinternal"
                            type="checkbox"
                            onChange={handleCheckboxChange}
                            checked={aiAgent == "internal"}
                            value={"internal"}
                            name="private"
                          />
                          <label
                            className="csr-pointer d-inline-block mb-0 pb-0 mx-2"
                            htmlFor="asinternal"
                          >
                            Internal AI Agent
                          </label>
                        </div>

                        <div className="col-md-12 mt-4">
                          <button
                            disabled={loader || !aiAgent}
                            className="btn primary-btn"
                          >
                            {loader ? "Please Wait..." : "Create"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="box-wrap">
                  <div className="box-header">
                    <h2 className="h3 mb-0">Create Avatar</h2>
                  </div>
                  <div className="box-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="">Name</label>
                          <input
                            type="text"
                            {...register("avtarFullName")}
                            name="avtarFullName"
                            placeholder="Avtar name"
                            className="form-control"
                          />
                          {errors.avtarFullName && (
                            <p className="error-message">
                              {errors.avtarFullName.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="">Gender</label>
                          <select
                            {...register("avtarGender")}
                            name="avtarGender"
                            className="form-control"
                          >
                            <option value="">Please select gender</option>
                            <option value={ENUM_AVTAR.GENDER.MALE}>Male</option>
                            <option value={ENUM_AVTAR.GENDER.FEMALE}>
                              Female
                            </option>
                          </select>
                          {errors.avtarGender && (
                            <p className="error-message">
                              {errors.avtarGender.message}
                            </p>
                          )}
                        </div>
                        <div className="col-md-12 mb-3">
                          <label htmlFor="">Upload Image</label>
                          <div
                            onClick={() => profileImgRef.current.click()}
                            className="drop-zone"
                          >
                            {file ? (
                              <>
                                <div className="img-preivew">
                                  <img
                                    className="img-thumbnail rounded mx-auto d-block"
                                    src={URL.createObjectURL(file)}
                                    alt="profile-picture"
                                  />
                                  <FontAwesomeIcon
                                    onClick={handleRemoveImg}
                                    className="text-danger"
                                    icon={faCircleXmark}
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <span className="drop-zone__prompt">
                                  Click to upload
                                </span>
                                <input
                                  {...register("avtarProfileImage")}
                                  ref={profileImgRef}
                                  type="file"
                                  accept="image/*"
                                  name="avtarProfileImage"
                                  className="d-none"
                                  onChange={handleProfileImgChange}
                                />
                              </>
                            )}
                          </div>
                          {errors.avtarProfileImage && (
                            <p className="error-message">
                              {errors.avtarProfileImage.message}
                            </p>
                          )}
                        </div>

                        <div className="col-md-12 mb-3">
                          <input
                            id="asPrivate"
                            type="checkbox"
                            checked={isPrivateChecked}
                            onChange={handleCheckboxChange}
                            name="private"
                          />
                          <label
                            className="csr-pointer d-inline-block mb-0 pb-0 mx-2"
                            htmlFor="asPrivate"
                          >
                            Private
                          </label>
                        </div>

                        <div className="col-md-12 mb-3">
                          <input
                            id="avatarTypeId"
                            type="checkbox"
                            checked={isMarkedAsPet}
                            onChange={handleAvatarTypeChange}
                          />
                          <label
                            className="csr-pointer d-inline-block mb-0 pb-0 mx-2"
                            htmlFor="avatarTypeId"
                          >
                            Is this avatar is for your pet?
                          </label>
                        </div>
                        {isMarkedAsPet && (
                          <>
                            <div className="col-md-12 mb-3">
                              <label htmlFor="">Avatar type</label>
                              <select
                                {...register("avatarType")}
                                name="avatarType"
                                className="form-control"
                              >
                                <option value="">
                                  Please select avatar type
                                </option>
                                <option value={ENUM_AVTAR.TYPE.CAT}>Cat</option>
                                <option value={ENUM_AVTAR.TYPE.DOG}>Dog</option>
                              </select>
                              {errors.avatarType && (
                                <p className="error-message">
                                  {errors.avatarType.message}
                                </p>
                              )}
                            </div>
                            <div className="col-md-12">
                              {errorMessage ? (
                                <p className="error-message">{errorMessage}</p>
                              ) : (
                                ""
                              )}
                            </div>
                          </>
                        )}

                        <div className="col-md-12 mt-4">
                          <button disabled={loader} className="btn primary-btn">
                            {loader ? "Please Wait..." : "Create"}
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default CreateAvtars;
