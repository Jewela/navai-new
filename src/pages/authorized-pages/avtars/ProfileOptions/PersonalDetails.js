import { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, {
  ACTION_SERVICES,
} from "../../../../redux/authenticate/actions";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import DatePicker from "react-date-picker";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../../app/constants/enums";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  postRequest,
  putRequest,
} from "../../../../app/httpClient/axiosClient";
import { RESPONSE_CODE } from "../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../app/constants";
import { AUTH_ROUTE_SLUGS } from "../../../../app/constants";
import { AVTAR } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import AuthJubmotron from "../../../../container/banner";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";
import {
  validateArray,
  validateArrayProp,
  validateEducationArrayProp,
} from "../../../../utils/helpers/validate";
import "react-date-picker/dist/DatePicker.css";
import "react-calendar/dist/Calendar.css";

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
};

function PersonalDetails(props) {
  const dispatch = useDispatch();
  const { loader, errorMessage } = useSelector((state) => state.auth);

  const [addChlidValidation, setAddChlidValidation] = useState(false);
  const [addEducationSchoolValidation, setEducationSchoolValidation] =
    useState(false);
  const [addEducationUnivValidation, setEducationUnivValidation] =
    useState(false);
  const [addWorkHistoryValidation, setWorkHistoryValidation] = useState(false);
  const [addHobbyValidation, setHobbyValidation] = useState(false);
  const [deletedProfileSectionIds, setDeletedProfileSectionIds] = useState([]);

  const { profileSections } = props.avatar;
  console.log("pereonsl");

  // getting family details
  const {
    fatherName,
    motherName,
    lovedOneName,
    children: _children,
  } = props.avatar.familyDetail
    ? props.avatar.familyDetail
    : defultFamilyDetails;
  const [familyDetails, setFamilyDetails] = useState({
    fatherName: fatherName,
    motherName: motherName,
    lovedOneName: lovedOneName,
    children: Array.isArray(_children) ? _children : _children.split(","),
  });

  const { dob, birthPlace, doNormalChildhood, doHaveSibling, lifeSummary } =
    props.avatar.personalDetailDto
      ? props.avatar.personalDetailDto
      : defultPersonalDetailsTo;
  const [personalDetailsTo, setPersonalDetailsTo] = useState({
    dob: dob,
    birthPlace: birthPlace,
    doNormalChildhood: doNormalChildhood,
    doHaveSibling: doHaveSibling,
    lifeSummary: lifeSummary,
  });

  // converting time to MM-DD-YYYY to display
  const dateObj = new Date(personalDetailsTo.dob);
  const _dateObj = dateObj
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
  const [personDob, setPersonDob] = useState(
    personalDetailsTo.dob ? _dateObj : null
  );

  // getting profile sections list
  const [educationDetails, setEducationDetails] = useState({
    SCHOOL: [],
    UNIVERSITY: [],
  });
  const [hobbiesDetails, setHobbiesDetails] = useState([]);
  const [workHistoryDetails, setWorkHistoryDetails] = useState([]);

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
              // _education.push({...rest, subSectionTitleEnum:subSectionTitleEnum, sectionTitleEnum:sectionTitleEnum});
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

      setEducationDetails(_education);
      setHobbiesDetails(_hobbies);
      setWorkHistoryDetails(_workHistory);
    } else {
      setEducationDetails(DEFAULT_VALUE.AVTAR.PROFILE_SECTIOINS.EDUCATION);
      setHobbiesDetails(DEFAULT_VALUE.AVTAR.PROFILE_SECTIOINS.HOBBY);
      setWorkHistoryDetails(DEFAULT_VALUE.AVTAR.PROFILE_SECTIOINS.WORK_HISTORY);
    }
  }, []);

  console.log(
    "================================================================"
  );
  console.log("educationDetails ", educationDetails);
  // console.log("profileSections.length ", profileSections.length);
  // console.log({ educationDetails, hobbiesDetails, workHistoryDetails });

  const validationSchema = useMemo(
    () =>
      yup.object().shape({
        fatherName: yup.string().required("Father Name is required"),
        motherName: yup.string().required("Mother Name is required"),
        lovedOneName: yup.string().required("Spouse name is required"),
        dob: yup.string().required("Date of birth  is required"),
        birthPlace: yup.string().required("Birth place is required"),
        // doNormalChildhood: yup.string().required('Normal childhood is required'),
        lifeSummary: yup.string().required("Life summary is required"),
      }),
    []
  );

  const handleInputChange = useMemo(
    () => (event) => {
      const { name, value } = event.target;

      if (name === "children") {
        const updatedChildren = [...familyDetails.children];
        updatedChildren[event.target.dataset.index] = value;
        setFamilyDetails({ ...familyDetails, [name]: updatedChildren });
      } else {
        setFamilyDetails({ ...familyDetails, [name]: value });
      }
    },
    [familyDetails]
  );

  const handlePersonalInputChange = useMemo(
    () => (event) => {
      const { name, value } = event.target;
      if (name === "doHaveSibling") {
        setPersonalDetailsTo({
          ...personalDetailsTo,
          [name]: value === "false" ? true : false,
        });
      } else {
        setPersonalDetailsTo({ ...personalDetailsTo, [name]: value });
      }
    },
    [personalDetailsTo]
  );

  const stateMap = {
    education: setEducationDetails,
    workHistory: setWorkHistoryDetails,
    hobby: setHobbiesDetails,
  };

  const handleDetailsInputChange = useMemo(
    () => (event) => {
      const { value } = event.target;
      const propKey = event.target.dataset.propkey;
      const index = parseInt(event.target.dataset.index);
      const stateKey = event.target.dataset.statekey;

      stateMap[stateKey]((prevEducationDetails) => {
        const updatedChildren = [...prevEducationDetails];
        updatedChildren[index][propKey] = value;
        return updatedChildren;
      });
    },
    [educationDetails]
  );

  const handleEduDetailsInputChange = useMemo(
    () => (event) => {
      const { value } = event.target;
      const propKey = event.target.dataset.propkey;
      const index = parseInt(event.target.dataset.index);
      const stateKey = event.target.dataset.statekey;
      const subsection = event.target.dataset.subsection;

      setEducationDetails((prevEducationDetails) => {
        const updatedChildren = [...prevEducationDetails[subsection]];
        const updatedChild = { ...updatedChildren[index], [propKey]: value };
        updatedChildren[index] = updatedChild;
        return { ...prevEducationDetails, [subsection]: updatedChildren };
      });
    },
    [educationDetails]
  );

  const stateValidateMap = {
    schoolEducation: setEducationSchoolValidation,
    univEducation: setEducationUnivValidation,
    workHistory: setWorkHistoryValidation,
    hobby: setHobbyValidation,
  };

  const handleAddSchooDetailInputs = (type, stateKey, subsection) => {
    if (
      validateEducationArrayProp(
        educationDetails.SCHOOL,
        "description",
        setEducationSchoolValidation
      )
    ) {
      let newEducation = {
        sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE[type.toUpperCase()],
        subSectionTitleEnum: ENUM_AVTAR.SUBSECTION_TITLE.SCHOOL,
        avatarProfileSectionId: 0,
        description: "",
      };

      setEducationDetails((prevEducationDetails) => {
        return {
          ...prevEducationDetails,
          [subsection]: [...prevEducationDetails[subsection], newEducation],
        };
      });
    }
  };

  const removeEducationInputs = (subsection, index, avatarProfileSectionId) => {
    console.log(
      "removeEducationInput: ",
      index,
      subsection,
      avatarProfileSectionId
    );
    if (subsection) {
      setEducationDetails((prevEducationDetails) => {
        return {
          ...prevEducationDetails,
          [subsection]: [
            ...prevEducationDetails[subsection].slice(0, index),
            ...prevEducationDetails[subsection].slice(index + 1),
          ],
        };
      });
    }

    if (avatarProfileSectionId) {
      setDeletedProfileSectionIds((prev) => [...prev, avatarProfileSectionId]);
    }
  };

  const handleAddUnivDetailInputs = (type, stateKey, subsection) => {
    console.log(type, stateKey, subsection);

    if (
      validateEducationArrayProp(
        educationDetails.UNIVERSITY,
        "description",
        setEducationUnivValidation
      )
    ) {
      let newEducation = {
        sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE[type.toUpperCase()],
        subSectionTitleEnum: ENUM_AVTAR.SUBSECTION_TITLE.UNIVERSITY,
        avatarProfileSectionId: 0,
        description: "",
      };

      setEducationDetails((prevEducationDetails) => {
        return {
          ...prevEducationDetails,
          [subsection]: [...prevEducationDetails[subsection], newEducation],
        };
      });
    }
  };

  // converting time to YYYY-MM-DD to send over API
  const onDobChange = (_date) => {
    console.log(_date);
    if (!_date) {
      setPersonDob(null);
      setPersonalDetailsTo({ ...personalDetailsTo, dob: "" });
      setValue("dob", "");
      trigger();
    } else {
      // const date = new Date(_date);
      const inputDate = new Date(_date);

      const year = inputDate.getFullYear();
      const month = String(inputDate.getMonth() + 1).padStart(2, "0");
      const day = String(inputDate.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;
      // const formattedDate = date.toISOString().slice(0, 10);
      console.log(formattedDate); // Output: "2023-05-25"
      setPersonalDetailsTo({ ...personalDetailsTo, dob: formattedDate });
      setPersonDob(_date);
      setValue("dob", "formattedDate");
    }
  };

  const handleAddDetailInputs = (type, stateKey) => {
    if (validateArrayProp(stateKey, "description", stateValidateMap[type])) {
      let newEducation = {
        sectionTitleEnum: ENUM_AVTAR.SECTION_TITLE[type.toUpperCase()],
        description: "",
      };
      if (props.avatar.familyDetail) {
        newEducation["avatarProfileSectionId"] = 0;
      }
      stateMap[type]([...stateKey, newEducation]);
    }
  };

  const handleRemoveInput = (type, index, avatarProfileSectionId) => {
    stateMap[type]((prev) => {
      return [...prev.slice(0, index), ...prev.slice(index + 1)];
    });

    if (avatarProfileSectionId) {
      setDeletedProfileSectionIds((prev) => [...prev, avatarProfileSectionId]);
    }
  };

  const handleAddChild = () => {
    if (validateArray(familyDetails.children, setAddChlidValidation)) {
      const newChild = [...familyDetails.children, ""];
      setFamilyDetails({ ...familyDetails, children: newChild });
    }
  };

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
    let _familyDetails = familyDetails;
    _familyDetails = {
      ..._familyDetails,
      children: _familyDetails.children.toString(),
    };
    const _presonalDetailsTo = personalDetailsTo;
    let _educationDetails = [];
    // console.log("==> ", _familyDetails);
    try {
      dispatch(ACTION_SERVICES(actions.API_PROCESS));

      let payloadData = {
        avatarId: props.avatar.id,
        familyDetail: _familyDetails,
        personalDetail: _presonalDetailsTo,
        profileSections: [...workHistoryDetails, ...hobbiesDetails],
      };

      if (Object.keys(educationDetails).length > 0) {
        Object.keys(educationDetails).forEach((item) => {
          educationDetails[item].forEach((subsectioItem) => {
            _educationDetails.push(subsectioItem);
          });
        });
      }

      if (_educationDetails.length > 0) {
        payloadData["profileSections"] = [
          ...payloadData.profileSections,
          ..._educationDetails,
        ];
      }
      if (deletedProfileSectionIds.length > 0) {
        payloadData["deletedProfileSectionIds"] = deletedProfileSectionIds;
      }
      let response;
      if (props.avatar.familyDetail) {
        response = await putRequest(AVTAR.UPDATE_PROFILE_SECTION, payloadData);
      } else {
        response = await postRequest(AVTAR.UPLOAD_PROFILE_SECTION, payloadData);
      }

      const {
        status,
        data: { result, httpStatusCode },
      } = response;

      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        props.propSuccessMessage("Profile updated successfully");
        props.setProfileOption(null);
      }
      dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
    } catch (error) {
      const _errorMessage = getErrorMessage(error);
      dispatch(
        ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, _errorMessage)
      );
    }
  };

  useEffect(() => {
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
                    <span
                      onClick={() => props.setProfileOption(null)}
                      role="button"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </span>
                  </div>
                  <h2 className="h3 mb-0 mt-2">Personal Details</h2>
                </div>
                <div className="box-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-12 mb-3">
                        <span className="h4">Family Details</span>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="">Father Name</label>
                        <input
                          readOnly={loader}
                          {...register("fatherName")}
                          type="text"
                          name="fatherName"
                          value={familyDetails.fatherName}
                          onChange={handleInputChange}
                          placeholder="Enter father name"
                          className="form-control"
                        />
                        {errors.fatherName && (
                          <p className="text-error">
                            {errors.fatherName.message}
                          </p>
                        )}
                      </div>
                      <div className="col-md-6 mb-3">
                        <label htmlFor="">Mother Name</label>
                        <input
                          readOnly={loader}
                          {...register("motherName")}
                          type="text"
                          name="motherName"
                          value={familyDetails.motherName}
                          onChange={handleInputChange}
                          placeholder="Enter mother name"
                          className="form-control"
                        />
                        {errors.motherName && (
                          <p className="text-error">
                            {errors.motherName.message}
                          </p>
                        )}
                      </div>
                      <div className="col-md-12 mb-3">
                        <label htmlFor="">Husband/Wife</label>
                        <input
                          readOnly={loader}
                          {...register("lovedOneName")}
                          type="text"
                          name="lovedOneName"
                          value={familyDetails.lovedOneName}
                          onChange={handleInputChange}
                          placeholder="Enter husband/wife"
                          className="form-control"
                        />
                        {errors.lovedOneName && (
                          <p className="text-error">
                            {errors.lovedOneName.message}
                          </p>
                        )}
                      </div>

                      <div className="col-md-12 mb-3">
                        <label htmlFor="">Children</label>
                        {familyDetails.children.length > 0
                          ? familyDetails.children.map((child, index) => (
                              <input
                                key={index}
                                readOnly={loader}
                                type="text"
                                name="children"
                                value={child}
                                placeholder="Enter children name"
                                className="form-control mb-2"
                                onChange={handleInputChange}
                                data-index={index}
                              />
                            ))
                          : ""}
                        {addChlidValidation ? (
                          <p className="text-error">This field is required.</p>
                        ) : (
                          ""
                        )}
                        <span
                          onClick={() => (loader ? false : handleAddChild())}
                          className="add-child-story add-more"
                        >
                          <FontAwesomeIcon icon={faPlus} /> Add more children
                        </span>
                      </div>

                      <div className="col-md-12 mb-3 mt-5">
                        <span className="h4">Personal Details</span>
                      </div>
                      {/* <div className="col-md-6 mb-3">
                                            <label htmlFor="">Birth place</label>
                                            <input
                                                readOnly={loader}
                                                {...register('birthPlace')}
                                                type="text" name="birthPlace" value={personalDetailsTo.birthPlace}
                                                onChange={handlePersonalInputChange}
                                                placeholder="Enter birth place" className="form-control"
                                            />
                                            {errors.birthPlace && <p className='text-error'>{errors.birthPlace.message}</p>}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label htmlFor="">Date of birth</label>
                                            <DatePicker
                                                className="form-control"
                                                format="MM-dd-yyyy"
                                                onChange={(e) => onDobChange(e)}
                                                value={personDob}
                                            />
                                            <input
                                                readOnly={loader}
                                                {...register('dob')}
                                                type="hidden" name="dob" value={personalDetailsTo.dob}
                                                placeholder="Enter date of birth" className="form-control"
                                            />
                                            {errors.dob && <p className='text-error'>{errors.dob.message}</p>}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <label htmlFor="">Did you have a Normal Childhood?</label>
                                            <input
                                                readOnly={loader}
                                                {...register('doNormalChildhood')}
                                                type="text" name="doNormalChildhood" value={personalDetailsTo.doNormalChildhood}
                                                onChange={handlePersonalInputChange}
                                                placeholder="Did you have a Normal Childhood? Describe" className="form-control"
                                            />
                                            {errors.doNormalChildhood && <p className='text-error'>{errors.doNormalChildhood.message}</p>}
                                        </div>
                                        <div className="col-md-12 mb-3">
                                            <div className="d-flex">
                                                <input
                                                    readOnly={loader}
                                                    {...register('doHaveSibling')}
                                                    type="checkbox"
                                                    name="doHaveSibling"
                                                    id="doHaveSibling"
                                                    defaultChecked={personalDetailsTo.doHaveSibling}
                                                    value={personalDetailsTo.doHaveSibling}
                                                    className=""
                                                    onChange={handlePersonalInputChange}
                                                />
                                                <label htmlFor="doHaveSibling" className="mb-0 ms-2">Do have sibling?</label>
                                            </div>
                                            <div>
                                                {errors.doHaveSibling && <p className='text-error'>{errors.doHaveSibling.message}</p>}
                                            </div>
                                        </div> */}
                      <div className="col-md-12 mb-3">
                        <label htmlFor="">lifeSummary</label>
                        <textarea
                          readOnly={loader}
                          {...register("lifeSummary")}
                          type="text"
                          name="lifeSummary"
                          value={personalDetailsTo.lifeSummary}
                          onChange={handlePersonalInputChange}
                          placeholder="Life summary"
                          className="form-control"
                        />
                        {errors.lifeSummary && (
                          <p className="text-error">
                            {errors.lifeSummary.message}
                          </p>
                        )}
                      </div>

                      <div className="col-md-12 mb-3 mt-5">
                        <span className="h4">Education Details</span>
                      </div>

                      <div className="col-md-12 mb-4">
                        <div className="row">
                          <div className="col-md-6 ">
                            <label className="">School</label>
                            {educationDetails &&
                              educationDetails.SCHOOL.length > 0 &&
                              educationDetails.SCHOOL.map((school, index) => (
                                <>
                                  <div
                                    key={`school-education-${index}`}
                                    className="input-control"
                                  >
                                    <input
                                      readOnly={loader}
                                      key={`eductation-details-school-${index}`}
                                      type="text"
                                      name="educationDetails"
                                      data-propkey="description"
                                      data-statekey="education"
                                      data-enums={school.sectionTitleEnum}
                                      value={school.description}
                                      placeholder="Enter school details"
                                      className="form-control mb-2"
                                      onChange={handleEduDetailsInputChange}
                                      data-index={index}
                                      data-subsection="SCHOOL"
                                    />
                                    <span
                                      onClick={() =>
                                        removeEducationInputs(
                                          "SCHOOL",
                                          index,
                                          school.avatarProfileSectionId
                                        )
                                      }
                                      key={`remove-school-item-${index}`}
                                      className="remove-story"
                                    >
                                      <FontAwesomeIcon icon={faCircleXmark} />
                                    </span>
                                  </div>
                                </>
                              ))}
                            {addEducationSchoolValidation && (
                              <p className="text-error">
                                This field is required.
                              </p>
                            )}
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddSchooDetailInputs(
                                      "education",
                                      educationDetails,
                                      "SCHOOL"
                                    )
                              }
                              className="add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more school
                            </span>
                          </div>

                          <div className="col-md-6">
                            <label className="">University</label>
                            {educationDetails &&
                              educationDetails.UNIVERSITY.length > 0 &&
                              educationDetails.UNIVERSITY.map(
                                (university, index) => (
                                  <>
                                    <div
                                      key={`univ-education-${index}`}
                                      className="input-control"
                                    >
                                      <div className=""></div>
                                      <input
                                        readOnly={loader}
                                        key={`eductation-details-university${index}`}
                                        type="text"
                                        name="educationDetails"
                                        data-propkey="description"
                                        data-statekey="education"
                                        data-enums={university.sectionTitleEnum}
                                        value={university.description}
                                        placeholder="Enter college/university details"
                                        className="form-control mb-2"
                                        onChange={handleEduDetailsInputChange}
                                        data-index={index}
                                        data-subsection="UNIVERSITY"
                                      />
                                      <span
                                        onClick={() =>
                                          removeEducationInputs(
                                            "UNIVERSITY",
                                            index,
                                            university.avatarProfileSectionId
                                          )
                                        }
                                        key={`remove-univ-item-${index}`}
                                        className="remove-story"
                                      >
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                      </span>
                                    </div>
                                  </>
                                )
                              )}
                            {addEducationUnivValidation && (
                              <p className="text-error">
                                This field is required.
                              </p>
                            )}
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddUnivDetailInputs(
                                      "education",
                                      educationDetails,
                                      "UNIVERSITY"
                                    )
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                              University
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12 mb-3 mt-5">
                        <span className="h4">Rcent History</span>
                      </div>
                      <div className="col-md-12 mb-3">
                        {workHistoryDetails.length > 0 &&
                          workHistoryDetails.map((work, index) => (
                            <>
                              <div
                                key={`work-history-div-${index}`}
                                className="input-control"
                              >
                                <input
                                  readOnly={loader}
                                  key={`work-history-${index}`}
                                  type="text"
                                  name="workHistoryDetails"
                                  data-propkey="description"
                                  data-statekey="workHistory"
                                  data-enums={work.sectionTitleEnum}
                                  value={work.description}
                                  placeholder="Enter recent job details"
                                  className="form-control mb-2"
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                />
                                <span
                                  onClick={() =>
                                    handleRemoveInput(
                                      "workHistory",
                                      index,
                                      work.avatarProfileSectionId
                                    )
                                  }
                                  key={`remove-work-item-${index}`}
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))}
                        {addWorkHistoryValidation ? (
                          <p className="text-error">This field is required.</p>
                        ) : (
                          ""
                        )}
                        <span
                          onClick={() =>
                            loader
                              ? false
                              : handleAddDetailInputs(
                                  "workHistory",
                                  workHistoryDetails
                                )
                          }
                          className="add-child-story add-more"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          &nbsp;Add more
                        </span>
                      </div>

                      <div className="col-md-12 mb-3 mt-5">
                        <span className="h4">Hobby</span>
                      </div>
                      <div className="col-md-12 mb-3">
                        {hobbiesDetails.length > 0 &&
                          hobbiesDetails.map((work, index) => (
                            <>
                              <div
                                key={`hobby-details-div-${index}`}
                                className="input-control"
                              >
                                <input
                                  readOnly={loader}
                                  key={`hobby-details-${index}`}
                                  type="text"
                                  name="hobbiesDetails"
                                  data-propkey="description"
                                  data-statekey="hobby"
                                  data-enums={work.sectionTitleEnum}
                                  value={work.description}
                                  placeholder="Enter hobby details"
                                  className="form-control mb-2"
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                />
                                <span
                                  onClick={() =>
                                    handleRemoveInput(
                                      "hobby",
                                      index,
                                      work.avatarProfileSectionId
                                    )
                                  }
                                  key={`remove-hobby-details-${index}`}
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))}
                        {addHobbyValidation ? (
                          <p className="text-error">This field is required.</p>
                        ) : (
                          ""
                        )}
                        <span
                          onClick={() =>
                            loader
                              ? false
                              : handleAddDetailInputs("hobby", hobbiesDetails)
                          }
                          className="add-child-story add-more"
                        >
                          <FontAwesomeIcon icon={faPlus} />
                          &nbsp;Add more
                        </span>
                      </div>

                      {errorMessage ? (
                        <div className="col-md-12 mt-1 mb-1">
                          <span className="text-error">{errorMessage}</span>
                        </div>
                      ) : (
                        ""
                      )}

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
                          ) : props.avatar.familyDetail ? (
                            "Update"
                          ) : (
                            "Create"
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
    </>
  );
}

export default PersonalDetails;
