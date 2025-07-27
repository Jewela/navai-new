import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";

import { postRequest } from "../../../../app/httpClient/axiosClient";
import actions from "../../../../redux/authenticate/actions";
import {
  RESPONSE_CODE,
  DEFAULT_VALUE,
  STORAGE_INDEXES,
} from "../../../../app/constants";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";
import { ADMIN } from "../../../../app/config/endpoints";
import { ENUM_AVTAR } from "../../../../app/constants/enums";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const validationSchema = yup.object().shape({
  question: yup.string().required("Question is required."),
  answer: yup.string().required("Answer is required."),
  tag: yup.string().required("This field is required."),
});

function AvatarInterceptQustionsModal(props) {
  const dispatch = useDispatch();
  const [apiProcess, setApiProcess] = useState({});
  const { isLoading, errorMessage, successMessage } = apiProcess;

  const LOCALE = DEFAULT_VALUE.LOCALE;

  const {
    setModalShow,
    getFamilyQuestions,
    questionDetail: {
      childQuestionCount,
      hasChildQuestion,
      questionId: id,
      parentQuestion,
      parentQuestionId,
      question,
      answer,
      questionBelongTo,
      questionRepetition,
    },
  } = props;
  const _extractBraces = answer.match(/{(.*)}/);
  const _tag = _extractBraces ? _extractBraces[1] : ``;
  const _answer = answer.replace(`{${_tag}}`, "");
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
    defaultValues: {
      question: question,
      answer: _answer,
      tag: _tag,
    },
  });
  console.log({ id });
  const onSubmit = async (data) => {
    const { question, answer, tag } = data;
    setApiProcess({
      isLoading: true,
      errorMessage: "",
      successMessage: "",
    });

    let payloadData = JSON.stringify({
      question: question,
      answer: `${answer}{${tag}}`,
      id: id,
    });
    console.log({ payloadData });

    try {
      const {
        status,
        data: { httpStatusCode, friendyMessageList },
      } = await postRequest(ADMIN.INTERCEPT_QUESTION.UPDATE, payloadData);

      if (
        status === RESPONSE_CODE[200] &&
        httpStatusCode === RESPONSE_CODE[200]
      ) {
        setApiProcess({
          isLoading: false,
          errorMessage: "",
          successMessage: RESPONSE_MESSAGES[LOCALE].SUCCESS_UPDATE_QUESTIONS,
        });

        dispatch({
          type: actions.TOAST_PROCESS,
          payload: {
            [STORAGE_INDEXES.TOAST_STATUS]: true,
            [STORAGE_INDEXES.TOAST_TYPE]: "success",
            [STORAGE_INDEXES.TOAST_MESSAGE]:
              RESPONSE_MESSAGES[LOCALE].SUCCESS_UPDATE_QUESTIONS,
          },
        });
        setModalShow(false);
        getFamilyQuestions();
      } else {
        setApiProcess({
          isLoading: false,
          errorMessage: RESPONSE_MESSAGES[LOCALE].ERROR_UPDATING_QUESTIONS,
          successMessage: "",
        });
      }
    } catch (error) {
      setApiProcess({
        isLoading: false,
        errorMessage: RESPONSE_MESSAGES[LOCALE].ERROR_UPDATING_QUESTIONS,
        successMessage: "",
      });
    }

    return false;
  };

  useEffect(() => {
    setApiProcess({
      isLoading: false,
      errorMessage: "",
      successMessage: "",
    });
  }, [id]);

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      backdrop="static"
      keyboard={false}
      centered
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            Edit Question
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-2 mt-2">
            <textarea
              {...register("question")}
              name="question"
              className="form-control"
              disabled={isLoading}
            />
            {errors.question && (
              <p className="text-error fs-1-5">{errors.question.message}</p>
            )}
          </div>
          <div className="mb-2 mt-2">
            <textarea
              {...register("answer")}
              name="answer"
              className="form-control"
              disabled={isLoading}
            />
            {errors.answer && (
              <p className="text-error fs-1-5">{errors.answer.message}</p>
            )}
          </div>
          <div className="mb-2 mt-2">
            <select {...register("tag")} className="form-control">
              <option></option>
              {Object.keys(ENUM_AVTAR.INTERCEPT_QUESTION.TAG).map(
                (item, index) => {
                  return (
                    <option
                      value={ENUM_AVTAR.INTERCEPT_QUESTION.TAG[item]}
                      key={index}
                    >
                      {`{${ENUM_AVTAR.INTERCEPT_QUESTION.TAG[item]}}`}
                    </option>
                  );
                }
              )}
            </select>
            {errors.tag && (
              <p className="text-error fs-1-5">{errors.tag.message}</p>
            )}
          </div>
          {errorMessage && <p className="text-error fs-1-5">{errorMessage}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button
            disabled={isLoading}
            type="submit"
            className="btn primary-btn btn-xs"
          >
            {isLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="grow"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                &nbsp;<span>Updating...</span>
              </>
            ) : (
              "Update"
            )}
          </Button>
          <Button
            disabled={isLoading}
            className="btn primary-btn btn-xs"
            onClick={props.onHide}
          >
            Close
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}

export default AvatarInterceptQustionsModal;
