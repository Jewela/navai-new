import React, { useState, useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, {
  ACTION_SERVICES,
} from "../../../../../redux/authenticate/actions";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../../../app/constants/enums";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  postRequest,
  putRequest,
} from "../../../../../app/httpClient/axiosClient";
import { afterlifeAxios } from "../../../../../app/httpClient/axios/axiosInstance";
import { RESPONSE_CODE } from "../../../../../app/constants";
import { AVTAR, MEDIA } from "../../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";
import toast from "react-hot-toast";
import ImageRadio from "./imgRadio";
import uploadImageFile from "./uploadImageFile";
import DefaultButtons from "./defaultButtons";
import GetUrlEmbedding from "./getUrlEmbedding";
import AgentGroups from "./AgentGroups";

const defultFamilyDetails = {
  fatherName: "",
  motherName: "",
  lovedOneName: "",
  children: [""],
};
const defultPersonalDetailsTo = {
  dob: null,
  birthPlace: "",
  doNormalChildhood: "",
  doHaveSibling: false,
  lifeSummary: "",
  shareAvatarUrl: "",
  avatarEmbeddedText: "",
  backgroundImage: [],
  defaultButton: [],
};

function PersonalDetails(props) {
  const { avatar = {}, setProfileOption } = props;

  const { profileSections, avatarCategoryEnum, groupMaps } = avatar;
  const [mappedGroups, setMappedGroup] = useState(groupMaps);
  const {
    businessName,
    businessUrl,
    lifeSummary,
    logoImageUrl,
    shareAvatarUrl,
    avatarEmbeddedText,
    backgroundImage,
    defaultButton,
    businessLogoImageId,
  } = avatar.personalDetailDto
      ? avatar.personalDetailDto
      : defultPersonalDetailsTo;

  // getting family details
  const {
    fatherName,
    motherName,
    lovedOneName,
    children: _children,
  } = avatar.familyDetail ? avatar.familyDetail : defultFamilyDetails;
  // const [familyDetails, setFamilyDetails] = useState({
  //   fatherName: fatherName,
  //   motherName: motherName,
  //   lovedOneName: lovedOneName,
  //   children: Array.isArray(_children) ? _children : _children.split(","),
  // });
  const [unmapAvatarStatus, setUnmapAvatarStatus] = useState(false);
  const { loader, errorMessage } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  let newAdded = ["Meet The Team", "Products", "Testimonials", "Screenshots"];
  const [chatbotChecks, setChatbotChecks] = useState(
    !!avatar.personalDetailDto?.defaultButton
      ? [...avatar.personalDetailDto?.defaultButton]
        ?.map((v) => v?.name)
        ?.filter((v) => newAdded.includes(v))
      : []
  );
  const [logoUrl, setLogoUrl] = useState(logoImageUrl);
  const [logoImageId, setLogoImageId] = useState(businessLogoImageId);
  const [bgImages, setBgImages] = useState([]);
  const [bgImgUrl, setBgImgUrl] = useState("");
  const [bgImgId, setBgImgId] = useState(null);
  const [defaultButtons, setDefaultButtons] = useState({
    RequestDemo: {
      enabled: false,
      name: "Popup",
      value: "",
    },
    ContactSale: {
      enabled: false,
      name: "Popup",
      value: "",
    },
  });

  const profileImgRef = useRef(null);
  const backgroundImageRef = useRef(null);


  const [agentGroupStatus, setAgentGroupStatus] = useState(false);

  useEffect(() => {
    if (profileSections.length > 0) {
      const _education = { SCHOOL: [], UNIVERSITY: [] },
        _hobbies = [],
        _workHistory = [];

      profileSections.forEach(
        ({ sectionTitleEnum, subSectionTitleEnum, ...rest }) => {
          switch (sectionTitleEnum) {
            case ENUM_AVTAR.SECTION_TITLE.EDUCATION:
              if (subSectionTitleEnum === ENUM_AVTAR.SUBSECTION_TITLE.SCHOOL) {
                _education.SCHOOL.push({
                  ...rest,
                  subSectionTitleEnum: subSectionTitleEnum,
                  sectionTitleEnum: sectionTitleEnum,
                });
              } else if (
                subSectionTitleEnum === ENUM_AVTAR.SUBSECTION_TITLE.UNIVERSITY
              ) {
                _education.UNIVERSITY.push({
                  ...rest,
                  subSectionTitleEnum: subSectionTitleEnum,
                  sectionTitleEnum: sectionTitleEnum,
                });
              }
              break;
            case ENUM_AVTAR.SECTION_TITLE.WORK:
              _workHistory.push({
                ...rest,
                sectionTitleEnum: sectionTitleEnum,
              });
              break;
            case ENUM_AVTAR.SECTION_TITLE.HOBBY:
              _hobbies.push({ ...rest, sectionTitleEnum: sectionTitleEnum });
              break;
            default:
              break;
          }
        }
      );
    }

    if (backgroundImage) {
      setBgImgId(backgroundImage.imageId);
      setBgImgUrl(backgroundImage.imageBlobUrl);
    }
    // GET default background images form API
    (async () => {
      const response = await afterlifeAxios.get(
        "Media/GetDefaultBackgroundImage"
      );

      let defaultImages = response.data.data.images;
      setBgImages(defaultImages);
    })();

    // Set Default Buttons Values from API
    if (defaultButton.length > 0) {
      const newDefaultButtons = { ...defaultButtons };

      defaultButton.map((button) => {
        newDefaultButtons[button.name] = {
          ...button.demoActions[0],
          enabled: true,
        };
      });

      setDefaultButtons(newDefaultButtons);
    }
  }, []);

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        // businessName: yup.string().required("Business name is required"),
        // businessLogo: yup.string().required("Business logo is required"),
        // businessUrl: yup.string().required("Image URL is required"),
        lifeSummary: yup.string().required("Life summary is required"),
      }),
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(validationSchema),
    defaultValues: {
      businessName,
      lifeSummary,
      businessUrl,
    },
  });

  const handleProfileImgChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setLogoUrl(fileUrl);

      (async () => {
        try {
          dispatch(ACTION_SERVICES(actions.API_PROCESS));

          const imageId = await uploadImageFile(file);
          setLogoImageId(imageId);

          dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
        } catch (error) {
          const _errorMessage = getErrorMessage(error);
          dispatch(
            ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, _errorMessage)
          );
        }
      })();
    }
  };

  const handleBackgroundImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setBgImgUrl(fileUrl);

      (async () => {
        try {
          dispatch(ACTION_SERVICES(actions.API_PROCESS));

          const imageId = await uploadImageFile(file);

          setBgImgId(imageId);

          dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
        } catch (error) {
          const _errorMessage = getErrorMessage(error);
          dispatch(
            ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, _errorMessage)
          );
        }
      })();
    }
  };

  const handleRemoveImg = () => {
    setLogoImageId(0);
    setLogoUrl("");
  };

  const handleRemoveBgImg = () => {
    setBgImgId(0);
    setBgImgUrl("");
  };

  const updateBgImageId = (imgId) => {
    setBgImgId(imgId);
  };

  const uploadUpdateProfileSection = async (payloadData) => {
    const removeDuplicate = [
      ...new Set([
        ...chatbotChecks,
        ...[...payloadData.personalDetail.defaultButton].map((v) => v.name),
      ]),
    ];
    console.log(
      "removeDuplicate",
      removeDuplicate,
      payloadData.personalDetail.defaultButton
    );
    payloadData = {
      ...payloadData,
      personalDetail: {
        ...payloadData?.personalDetail,
        defaultButton: [
          ...removeDuplicate.map((v) => ({
            name: v,
            demoActions: [
              // {
              //   name: "popup",
              // },
              payloadData.personalDetail.defaultButton?.find(
                (val) => val.name == v
              )?.demoActions?.[0] || {},
            ],
          })),
        ],
      },
    };
    console.log("dsdsdewewe", payloadData);
    let response;

    response = await putRequest(AVTAR.UPDATE_PROFILE_SECTION, payloadData);

    /* 
    *
      commented following logic because at this moment from now it has to be only update because we are already uploaded the during the creation 
    */
    // if (avatar.personalDetailDto?.lifeSummary) {
    //   response = await putRequest(AVTAR.UPDATE_PROFILE_SECTION, payloadData);
    // } else {
    //   response = await postRequest(AVTAR.UPLOAD_PROFILE_SECTION, payloadData);
    // }

    const {
      status,
      data: { result, httpStatusCode },
    } = response;

    if (
      httpStatusCode === RESPONSE_CODE[200] &&
      status === RESPONSE_CODE[200]
    ) {
      toast.success("Profile updated successfully");
      setProfileOption(null);
    }
  };

  // Submit Data to server
  const onSubmit = async (data) => {
    console.log("onSubmit", data);
    let nextDefaultButton = [];
    if (defaultButtons.RequestDemo.enabled) {
      nextDefaultButton.push({
        name: "RequestDemo",
        demoActions: [
          {
            name: defaultButtons.RequestDemo.name,
            value: defaultButtons.RequestDemo.value,
            value:
              defaultButtons.RequestDemo.name === "Url"
                ? defaultButtons.RequestDemo.value
                : "",
          },
        ],
      });
    }

    if (defaultButtons.ContactSale.enabled) {
      nextDefaultButton.push({
        name: "ContactSale",
        demoActions: [
          {
            name: defaultButtons.ContactSale.name,
            value:
              defaultButtons.ContactSale.name === "Url"
                ? defaultButtons.ContactSale.value
                : "",
          },
        ],
      });
    }

    let payloadData = {
      avatarId: avatar.Avatarid,
      personalDetail: {
        ...data,
        shareAvatarUrl,
        avatarEmbeddedText,
        backgroundImageId: bgImgId,
        defaultButton: nextDefaultButton,
        businessLogoImageId: logoImageId ? logoImageId : businessLogoImageId,
        backgroundImageId: bgImgId ? bgImgId : backgroundImage?.imageId,
      },
    };

    try {
      dispatch(ACTION_SERVICES(actions.API_PROCESS));

      await uploadUpdateProfileSection(payloadData);

      dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
    } catch (error) {
      const _errorMessage = getErrorMessage(error);
      dispatch(
        ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, _errorMessage)
      );
    }
  };

  const handleCheckboxChanges = (e) => {
    const { name } = e.target;
    if (chatbotChecks.includes(name)) {
      setChatbotChecks(chatbotChecks.filter((v) => v !== name));
    } else setChatbotChecks([...chatbotChecks, name]);
  };

  const handleUnmapAvatarGroup = async (groupId) => {
    try {
      setUnmapAvatarStatus(true);
      const payloadData = {
        "avatarId": avatar?.Avatarid,
        "groupId": groupId,
        "disableMapCompleteGroup": true
      }
      const response = await postRequest(AVTAR.REMOVE_GUEST_MAP, payloadData);
      const { status, data: { httpStatusCode } } = response;
      if (httpStatusCode === RESPONSE_CODE[200] && status === RESPONSE_CODE[200]) {
        toast.success("Group unmapped successfully!")
        const _filteredGroup = mappedGroups.filter(group => group.groupId !== groupId);
        setMappedGroup(_filteredGroup);
      }

      setUnmapAvatarStatus(false)
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.warn({ error, errorMessage });
      toast.error(errorMessage);
      setUnmapAvatarStatus(false);
    }
  }

  const handleSelectGroup = (status = false) => {
    setAgentGroupStatus(status)
  }

  useEffect(() => {
    // getavatarmedia();
    dispatch({ type: actions.PROCESS_INIT });
  }, []);

  return (
    <>
      <section className="profile spacer-lg">
        <div className="container">
          <div className="row">
            <div className="col-md-9 mx-auto">
              <div className="box-wrap">
                <div className="box-header profile-option-title flex-column">
                  <div>
                    <span onClick={() => setProfileOption(null)} role="button">
                      <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </span>
                  </div>
                  <h2 className="h3 mb-0 mt-2">Agent Details</h2>
                </div>
                <div className="box-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <label htmlFor="">Description</label>
                        <textarea
                          readOnly={loader}
                          {...register("lifeSummary")}
                          type="text"
                          name="lifeSummary"
                          id="lifeSummary"
                          placeholder="Life summary"
                          className="form-control"
                        />
                        {errors.lifeSummary && (
                          <p className="text-error">
                            {errors.lifeSummary.message}
                          </p>
                        )}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="">Upload Logo Image</label>
                        <div
                          onClick={() => {
                            profileImgRef.current?.click();
                          }}
                          className="drop-zone "
                          style={{ height: "100px" }}
                        >
                          {logoUrl ? (
                            <>
                              <div className="img-preivew">
                                <img
                                  className="img-thumbnail rounded mx-auto d-block"
                                  style={{ height: "100px" }}
                                  src={logoUrl}
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
                                {...register("businessLogo")}
                                ref={profileImgRef}
                                type="file"
                                accept="image/*"
                                name="businessLogo"
                                id="businessLogo"
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

                      <label>Select background image</label>
                      <div className="d-flex gap-2">
                        {bgImages.map((img) => (
                          <ImageRadio
                            key={img?.imageId}
                            id={img?.imageId}
                            name="bgImageId"
                            value={img?.imageId}
                            checked={bgImgId === img?.imageId}
                            onChange={() => updateBgImageId(img?.imageId)}
                            imgSrc={img?.imageBlobUrl}
                            imgAlt="Option 1"
                          />
                        ))}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="backgroundImage">
                          Upload background image
                        </label>
                        <div
                          onClick={() => {
                            backgroundImageRef.current?.click();
                          }}
                          className="drop-zone "
                          style={{ height: "100px" }}
                        >
                          {bgImgUrl ? (
                            <>
                              <div className="img-preivew">
                                <img
                                  className="img-thumbnail rounded mx-auto d-block"
                                  style={{ height: "100px" }}
                                  src={bgImgUrl}
                                  alt="Background Image"
                                />
                                <FontAwesomeIcon
                                  onClick={handleRemoveBgImg}
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
                                ref={backgroundImageRef}
                                type="file"
                                accept="image/*"
                                name="businessLogo"
                                id="businessLogo"
                                className="d-none"
                                onChange={handleBackgroundImageChange}
                              />
                            </>
                          )}
                        </div>
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="">Business Name</label>
                        <input
                          readOnly={loader}
                          {...register("businessName")}
                          type="text"
                          name="businessName"
                          id="businessName"
                          placeholder="Business Name"
                          className="form-control"
                        />
                        {errors.businessName && (
                          <p className="text-error">
                            {errors.businessName.message}
                          </p>
                        )}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="businessUrl">Busisness URL</label>
                        <input
                          readOnly={loader}
                          {...register("businessUrl")}
                          type="text"
                          name="businessUrl"
                          id="businessUrl"
                          placeholder="Enter Business URL"
                          className="form-control"
                        />
                        {errors.businessUrl && (
                          <p className="text-error">
                            {errors.businessUrl.message}
                          </p>
                        )}
                      </div>
                      {avatarCategoryEnum === 3 &&
                        <div className="col-md-12 mb-3">
                          <label htmlFor="businessUrl">Group Details</label>
                          <div className="border border-light rounded p-1 position-relative">
                            {mappedGroups.length
                              ? mappedGroups.map((group, index) => {
                                return <React.Fragment key={`key-emp-id-${group.groupId}`} >
                                  <div id={`emp-id-${group.groupId}`} className="p-2 d-inline-block">
                                    <span className="px-2 py-1 rounded bg-secondary">{group.name}&nbsp;
                                      {unmapAvatarStatus
                                        ? <div className="spinner-border spinner-border-sm" role="status">
                                          <span className="sr-only">Loading...</span>
                                        </div>
                                        : <i
                                          className="ri-close-fill bg-danger rounded"
                                          role="button"
                                          onClick={() => handleUnmapAvatarGroup(group.groupId)}
                                        />
                                      }
                                    </span>
                                  </div>
                                </React.Fragment>
                              })
                              : <p className="text-center text-danger">No group found.</p>
                            }
                          </div>
                          <p role="button" className="btn btn-sm mt-2 p-2 btn-primary" onClick={() => handleSelectGroup(true)}>
                            <i className="ri-group-line me-1"></i>Select group
                          </p>
                        </div>
                      }
                      <DefaultButtons
                        defaultButtons={defaultButtons}
                        setDefaultButtons={setDefaultButtons}
                      />

                      <GetUrlEmbedding
                        shareAvatarUrl={shareAvatarUrl}
                        avatarEmbeddedText={avatarEmbeddedText}
                      />

                      {errorMessage ? (
                        <div className="col-md-12 mt-1 mb-1">
                          <span className="text-error">{errorMessage}</span>
                        </div>
                      ) : (
                        ""
                      )}
                      {newAdded.map((item) => (
                        <div key={item} className="d-flex gap-2 mb-2">
                          <label htmlFor={item}>{item}</label>
                          <input
                            type="checkbox"
                            id={item}
                            name={item}
                            onChange={handleCheckboxChanges}
                            value={chatbotChecks.includes(item)}
                            checked={chatbotChecks.includes(item)}
                          />
                        </div>
                      ))}

                      <div className="col-md-12 mt-3">
                        <Button
                          variant="primary"
                          disabled={loader}
                          type="submit"
                          className="btn primary-btn"
                        >
                          {loader ? (
                            <>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              &nbsp;<span>Loading...</span>
                            </>
                          ) : avatar.familyDetail ? (
                            "Update"
                          ) : (
                            "Save"
                          )}
                        </Button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {agentGroupStatus &&
        <AgentGroups
          show={agentGroupStatus}
          avatar={avatar}
          onHide={() => handleSelectGroup()}
          setMappedGroup={setMappedGroup}
          mappedGroups={mappedGroups}
        />
      }
    </>
  );
}

export default PersonalDetails;
