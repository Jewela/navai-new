import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import actions, {
  ACTION_SERVICES,
} from "../../../../../redux/authenticate/actions";

import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ENUM_AVTAR } from "../../../../../app/constants/enums";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faArrowLeft,
  faCircleXmark,
  faFileCircleXmark,
} from "@fortawesome/free-solid-svg-icons";
import {
  postRequest,
  putRequest,
} from "../../../../../app/httpClient/axiosClient";
import { AVATAR_PARAMS, RESPONSE_CODE } from "../../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../../app/constants";
import { AVTAR, BASEURL, PREFIX } from "../../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../../utils/helpers/apiErrorResponse";
import { validateStoryArrayProp } from "../../../../../utils/helpers/validate";
import { RESPONSE_MESSAGES } from "../../../../../app/constants/localizedStrings";
import toast from "react-hot-toast";
import { getDocument } from "pdfjs-dist";
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { readDocx, readPdf, readText } from "./readUploadFile";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import { getToken } from "../../../../../app/Auth";

const defultFamilyDetails = {
  fatherName: "",
  motherName: "",
  lovedOneName: "",
  children: [""],
};

function Stories(props) {
  const dispatch = useDispatch();
  const { loader, errorMessage } = useSelector((state) => state.auth);
  const [chatbotLoading, setChatbotLoading] = useState(false);
  const [addStoryValidation, setAddStoryValidation] = useState({
    childhood: false,
    adult: false,
    importantLife: false,
    vacation: false,
    sad: false,
    school: false,
    work: false,
  });

  const { avatarStories } = props.avatar;

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

  // getting story sections list
  const [childhoodStory, setChildhoodStory] = useState([]);
  const [adultStory, setAdultStory] = useState([]);
  const [importantLifeStory, setImportantLifeStory] = useState([]);
  const [vacationStory, setVcationStory] = useState([]);
  const [sadStory, setSadStory] = useState([]);
  const [schoolStory, setSchoolStory] = useState([]);
  const [workStory, setWorkStory] = useState([]);
  const [deltedStories, setDeltedStories] = useState([]);

  useEffect(() => {
    if (avatarStories.length > 0) {
      const _childhood = [],
        _adult = [],
        _importantLife = [],
        _vacation = [],
        _sad = [],
        _school = [],
        _work = [];

      avatarStories.forEach(({ avatarStoryEnum, ...rest }) => {
        switch (avatarStoryEnum) {
          case ENUM_AVTAR.STORY.SAD:
            _sad.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          case ENUM_AVTAR.STORY.VACATION:
            _vacation.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          case ENUM_AVTAR.STORY.CHILDHOOD:
            _childhood.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          case ENUM_AVTAR.STORY.ADULT:
            _adult.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          case ENUM_AVTAR.STORY.IMPORTANTLIFE:
            _importantLife.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          case ENUM_AVTAR.STORY.SCHOOL:
            _school.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          case ENUM_AVTAR.STORY.WORK:
            _work.push({ ...rest, avatarStoryEnum: avatarStoryEnum });
            break;

          default:
            break;
        }
      });

      setChildhoodStory(_childhood);
      setAdultStory(_adult);
      setImportantLifeStory(_importantLife);
      setVcationStory(_vacation);
      setSadStory(_sad);
      setSchoolStory(_school);
      setWorkStory(_work);
    } else {
      setChildhoodStory(DEFAULT_VALUE.AVTAR.STORY.CHILDHOOD);
      setAdultStory(DEFAULT_VALUE.AVTAR.STORY.ADULT);
      setImportantLifeStory(DEFAULT_VALUE.AVTAR.STORY.IMPORTANTLIFE);
      setVcationStory(DEFAULT_VALUE.AVTAR.STORY.VACATION);
      setSadStory(DEFAULT_VALUE.AVTAR.STORY.SAD);
      setSchoolStory(DEFAULT_VALUE.AVTAR.STORY.SCHOOL);
      setWorkStory(DEFAULT_VALUE.AVTAR.STORY.WORK);
    }
  }, []);

  const validationSchema = yup.object().shape({
    childhoodStory: yup.array().of(
      yup.object().shape({
        story: yup.string().required("Story is required"),
      })
    ),
  });

  const stateMap = {
    childhood: setChildhoodStory,
    adult: setAdultStory,
    importantLife: setImportantLifeStory,
    vacation: setVcationStory,
    sad: setSadStory,
    school: setSchoolStory,
    work: setWorkStory,
  };

  const handleDetailsInputChange = useMemo(
    () => (event) => {
      const { value } = event.target;
      const propKey = event.target.dataset.propkey;
      const index = parseInt(event.target.dataset.index);
      const stateKey = event.target.dataset.statekey;

      stateMap[stateKey]((prevStoryDetails) => {
        const updatedChildren = [...prevStoryDetails];
        updatedChildren[index][propKey] = value;
        return updatedChildren;
      });

      // ----
      setAddStoryValidation((prevState) => {
        const updatedValidation = { ...prevState };
        for (const key in updatedValidation) {
          updatedValidation[key] = false;
        }
        return updatedValidation;
      });
    },
    [
      childhoodStory,
      adultStory,
      importantLifeStory,
      vacationStory,
      sadStory,
      schoolStory,
      workStory,
    ]
  );

  const handleAddDetailInputs = (type, stateKey) => {
    if (
      validateStoryArrayProp(stateKey, "story", setAddStoryValidation, type)
    ) {
      let newStory = {
        avatarStoryEnum: ENUM_AVTAR.STORY[type.toUpperCase()],
        story: "",
      };
      if (props.avatar.familyDetail) {
        newStory["storyId"] = 0;
      }
      stateMap[type]([...stateKey, newStory]);
    }
  };

  const handleRemoveDetailInputs = (type, index, storyId) => {
    if (storyId) setDeltedStories([...deltedStories, storyId]);
    stateMap[type]((prevStoryDetails) => {
      return [
        ...prevStoryDetails.slice(0, index),
        ...prevStoryDetails.slice(index + 1),
      ];
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    setError,
    trigger,
  } = useForm({
    mode: "onTouched",
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    // console.log("================================");

    const _childhood = validateStoryArrayProp(
      childhoodStory,
      "story",
      null,
      "childhood"
    );
    const _adult = validateStoryArrayProp(adultStory, "story", null, "adult");
    const _importantLife = validateStoryArrayProp(
      importantLifeStory,
      "story",
      null,
      "importantLife"
    );
    const _vacation = validateStoryArrayProp(
      vacationStory,
      "story",
      null,
      "vacation"
    );
    const _sad = validateStoryArrayProp(sadStory, "story", null, "sad");
    const _school = validateStoryArrayProp(
      schoolStory,
      "story",
      null,
      "school"
    );
    const _work = validateStoryArrayProp(workStory, "story", null, "work");

    if (
      _childhood ||
      _adult ||
      _importantLife ||
      _vacation ||
      _sad ||
      _school ||
      _work
    ) {
      try {
        console.log(props.avatar);
        dispatch(ACTION_SERVICES(actions.API_PROCESS));
        let payloadData = {
          avatarId: props.avatar[AVATAR_PARAMS.avatarid],
          avatarStories: [
            ...childhoodStory,
            ...adultStory,
            ...importantLifeStory,
            ...vacationStory,
            ...sadStory,
            ...schoolStory,
            ...workStory,
          ],
          deletedStoryIds: deltedStories,
        };

        console.log(payloadData);

        payloadData.avatarStories = payloadData.avatarStories.filter(
          (item) => item.story !== ""
        );
        let response;
        if (avatarStories.length > 0) {
          response = await putRequest(AVTAR.UPDATE_AVATAR_STORY, payloadData);
        } else {
          response = await postRequest(AVTAR.UPLOAD_AVATAR_STORY, payloadData);
        }

        const {
          status,
          data: { result, httpStatusCode },
        } = response;

        if (
          httpStatusCode === RESPONSE_CODE[200] &&
          status === RESPONSE_CODE[200]
        ) {
          dispatch({
            type: actions.API_PROCESS_SUCCESS,
            payload: { loader: false, successMessage: "" },
          });
          toast.success("Story updated successfully");

          props.setProfileOption(null);
        }
        dispatch(ACTION_SERVICES(actions.API_PROCESS, false));
      } catch (error) {
        console.log(error);
        const _errorMessage = getErrorMessage(error);
        dispatch(
          ACTION_SERVICES(actions.API_PROCESS_FAILURE, false, _errorMessage)
        );
      }
    } else {
      dispatch(
        ACTION_SERVICES(
          actions.API_PROCESS_FAILURE,
          false,
          RESPONSE_MESSAGES[DEFAULT_VALUE.LOCALE].REQUIRED_AVATAR_STORY
        )
      );
    }
  };

  useEffect(() => {
    dispatch({ type: actions.PROCESS_INIT });
  }, []);

  // upload doc function
  const [uploadType, setUploadType] = useState("");
  const [fileText, setFileText] = useState("");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    try {
      if (
        (file &&
          (file.type === "application/pdf" ||
            file.type ===
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document")) ||
        file.type === "text/plain"
      ) {
        const fileText = await readFile(file);
        setFileText(fileText);
      } else {
        alert("Please upload a PDF or DOCX or Text file.");
      }
    } catch (error) {
      alert(
        "Something is error from your upload file . Change your upload or fix issue"
      );
    }
  };

  const readFile = async (file) => {
    const fileType = file.type;
    if (fileType === "application/pdf") {
      return await readPdf(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return await readDocx(file);
    } else if (fileType === "text/plain") {
      return await readText(file);
    }
  };

  // submit for chat
  const { id } = useParams();
  const token = getToken();

  async function handleSubmitForChatbot() {
    try {
      setChatbotLoading(true);
      if (id) {
        const avaterInfo = await axios.post(
          AVTAR.AVATER_BY_ID,
          { id: Number(id) },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (avaterInfo) {
          const res = await axios.post(AVTAR.ADD_DOC_TO_CHAT_BOT, {
            data: avaterInfo.data,
          });
          if (res.data) {
            toast.success("Avater info add in chatbot successfully");
          }
        }
      }
      setChatbotLoading(false);
    } catch (error) {
      setChatbotLoading(false);
      console.log("error123", error);
    }
  }
  useEffect(() => {
    if (uploadType === "doc1") {
      setChildhoodStory([
        { ...childhoodStory, avatarStoryEnum: 2, story: fileText },
      ]);
    }
    if (uploadType === "doc2") {
      setAdultStory([{ ...adultStory, avatarStoryEnum: 3, story: fileText }]);
    }
    if (uploadType === "doc3") {
      setImportantLifeStory([
        { ...importantLifeStory, avatarStoryEnum: 0, story: fileText },
      ]);
    }
    if (uploadType === "doc4") {
      setVcationStory([
        { ...vacationStory, avatarStoryEnum: 4, story: fileText },
      ]);
    }
    if (uploadType === "doc5") {
      setSadStory([{ ...sadStory, avatarStoryEnum: 1, story: fileText }]);
    }
    if (uploadType === "doc6") {
      setSchoolStory([{ ...schoolStory, avatarStoryEnum: 5, story: fileText }]);
    }
    if (uploadType === "doc7") {
      setWorkStory([{ ...workStory, avatarStoryEnum: 6, story: fileText }]);
    }
  }, [fileText, uploadType]);

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
                  <h2 className="h3 mb-0 mt-2">Add Documents</h2>
                </div>
                <div className="box-body">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="row">
                      <div className="col-md-12 mb-5 ">
                        <label htmlFor="">Document 1</label>
                        {childhoodStory.length > 0 ? (
                          childhoodStory.map((childhood, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`childhood-story-${index}`}
                                  type="text"
                                  name="childhoodStory"
                                  value={childhood.story}
                                  data-enums={childhood.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="childhood"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>
                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "childhood",
                                      index,
                                      childhood.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}

                        {addStoryValidation.childhood && (
                          <p className="text-error">This field is required.</p>
                        )}

                        <div>
                          {childhoodStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs(
                                    "childhood",
                                    childhoodStory
                                  )
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc1")}
                            className={
                              uploadType === "doc1"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc1" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 mb-5 input-div">
                        <label htmlFor="">Document 2</label>
                        {adultStory.length > 0 ? (
                          adultStory.map((adult, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`adult-story-${index}`}
                                  type="text"
                                  name="adultStory"
                                  value={adult.story}
                                  data-enums={adult.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="adult"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>

                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "adult",
                                      index,
                                      adult.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}
                        {addStoryValidation.adult && (
                          <p className="text-error">This field is required.</p>
                        )}
                        <div>
                          {adultStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs("adult", adultStory)
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc2")}
                            className={
                              uploadType === "doc2"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc2" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 mb-5 input-div">
                        <label htmlFor="">Document 3</label>
                        {importantLifeStory.length > 0 ? (
                          importantLifeStory.map((importantLife, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`life-story-${index}`}
                                  type="text"
                                  name="importantLifeStory"
                                  value={importantLife.story}
                                  data-enums={importantLife.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="importantLife"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>

                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "importantLife",
                                      index,
                                      importantLife.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}
                        {addStoryValidation.importantLife && (
                          <p className="text-error">This field is required.</p>
                        )}
                        <div>
                          {importantLifeStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs(
                                    "importantLife",
                                    importantLifeStory
                                  )
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc3")}
                            className={
                              uploadType === "doc3"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc3" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 mb-5 input-div">
                        <label htmlFor="">Document 4</label>
                        {vacationStory.length > 0 ? (
                          vacationStory.map((vacation, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`life-story-${index}`}
                                  type="text"
                                  name="vacationStory"
                                  value={vacation.story}
                                  data-enums={vacation.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="vacation"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>

                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "vacation",
                                      index,
                                      vacation.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}
                        {addStoryValidation.vacation && (
                          <p className="text-error">This field is required.</p>
                        )}
                        <div>
                          {vacationStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs(
                                    "vacation",
                                    vacationStory
                                  )
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc4")}
                            className={
                              uploadType === "doc4"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc4" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 mb-5 input-div">
                        <label htmlFor="">Document 5</label>
                        {sadStory.length > 0 ? (
                          sadStory.map((sad, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`life-story-${index}`}
                                  type="text"
                                  name="sadStory"
                                  value={sad.story}
                                  data-enums={sad.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="sad"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>

                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "sad",
                                      index,
                                      sad.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}
                        {addStoryValidation.sad && (
                          <p className="text-error">This field is required.</p>
                        )}

                        <div>
                          {sadStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs("sad", sadStory)
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc5")}
                            className={
                              uploadType === "doc5"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc5" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 mb-5 input-div">
                        <label htmlFor="">Document 6</label>
                        {schoolStory.length > 0 ? (
                          schoolStory.map((school, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`life-story-${index}`}
                                  type="text"
                                  name="sadStory"
                                  value={school.story}
                                  data-enums={school.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="school"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>

                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "school",
                                      index,
                                      school.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}
                        {addStoryValidation.school && (
                          <p className="text-error">This field is required.</p>
                        )}

                        <div>
                          {schoolStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs("school", schoolStory)
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc6")}
                            className={
                              uploadType === "doc6"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc6" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      <div className="col-md-12 mb-5 input-div">
                        <label htmlFor="">Document 7</label>
                        {workStory.length > 0 ? (
                          workStory.map((work, index) => (
                            <>
                              <div className="input-div input-control">
                                <textarea
                                  key={`life-story-${index}`}
                                  type="text"
                                  name="workStory"
                                  value={work.story}
                                  data-enums={work.avatarStoryEnum}
                                  onChange={handleDetailsInputChange}
                                  data-index={index}
                                  data-propkey="story"
                                  data-statekey="work"
                                  placeholder="Add Content here"
                                  className="form-control mb-2"
                                ></textarea>

                                <span
                                  key={`childhood-story-p-${index}`}
                                  onClick={() =>
                                    handleRemoveDetailInputs(
                                      "work",
                                      index,
                                      work.storyId
                                    )
                                  }
                                  className="remove-story"
                                >
                                  <FontAwesomeIcon icon={faCircleXmark} />
                                </span>
                              </div>
                            </>
                          ))
                        ) : (
                          <p className="text-error">No story created.</p>
                        )}
                        {addStoryValidation.work && (
                          <p className="text-error">This field is required.</p>
                        )}

                        <div>
                          {workStory.length === 0 && (
                            <span
                              onClick={() =>
                                loader
                                  ? false
                                  : handleAddDetailInputs("work", workStory)
                              }
                              className="add-child-story add-more"
                            >
                              <FontAwesomeIcon icon={faPlus} /> Add more
                            </span>
                          )}
                          <span
                            onClick={() => setUploadType("doc7")}
                            className={
                              uploadType === "doc7"
                                ? "d-none"
                                : "add-child-story add-more m-2"
                            }
                          >
                            Upload Doc
                          </span>
                          <input
                            className={
                              uploadType === "doc7" ? "m-2" : "d-none m-2"
                            }
                            onChange={handleFileChange}
                            type="file"
                            accept=".pdf,.docx,.txt"
                          />
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="col-md-12 mt-1 mb-1">
                          <span className="text-error">{errorMessage}</span>
                        </div>
                      )}

                      <div className="col-md-12 mt-3">
                        <button
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
                          ) : avatarStories.length > 0 ? (
                            "Update"
                          ) : (
                            "Save"
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={handleSubmitForChatbot}
                          className="btn primary-btn m-2"
                          disabled={chatbotLoading}
                        >
                          Add to chat bot&nbsp;{chatbotLoading && <Spinner
                            className="loadmore-btn"
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />}
                        </button>
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

export default Stories;
