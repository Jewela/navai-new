import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";

import { postRequest } from "../../../../app/httpClient/axiosClient";
import { RESPONSE_CODE } from "../../../../app/constants";
import { DEFAULT_VALUE } from "../../../../app/constants";
import { AUTH_ROUTE_SLUGS } from "../../../../app/constants";
import { AVTAR } from "../../../../app/config/endpoints";
import { getErrorMessage } from "../../../../utils/helpers/apiErrorResponse";
import AuthJubmotron from "../../../../container/banner";
import { RESPONSE_MESSAGES } from "../../../../app/constants/localizedStrings";

function AvtarById() {
  const params = useParams();
  const [isLoading, setLoading] = useState(true);
  const [processingText, setProcessingText] = useState({
    type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_REGULAR,
    message: DEFAULT_VALUE.PROCESSING_TEXT.LOADING,
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [avtarDetail, setAvtarDetail] = useState({});
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
          // setLoading(false);
        } else {
          setProcessingText({
            type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_ERROR,
            message: RESPONSE_MESSAGES[LOCALE].GET_AVTAR_ELSE_CASE,
          });
        }
        setLoading(false);
      } catch (error) {
        const { friendyMessageList } = getErrorMessage(error);
        setProcessingText({
          type: DEFAULT_VALUE.PROCESSING_TEXT.TYPE_ERROR,
          message: friendyMessageList[0],
        });
        setLoading(false);
      }
    }
    getAvtarById(AVTAR.EDIT);
  }, [params.id]);

  if (isLoading || Object.keys(avtarDetail).length === 0) {
    return (
      <>
        <h3
          className={`${isLoading ? `text-loading` : `text-error`} pre-loading`}
        >
          {processingText.message}
        </h3>
      </>
    );
  }

  return (
    <>
      <AuthJubmotron title="Edit Avator" />
      <section className="edit-avator spacer-lg">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-9 mx-auto mb-5">
              <h2 className="h3">Edit {avtarDetail.name}</h2>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-md-3">
              <div className="edit-avator__img position-relative">
                <img
                  src="/images/avator-4.jpg"
                  alt="avator"
                  className="rounded-10 w-100"
                />
                <a href="#">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path
                      d="M12.8995 6.85431L17.1421 11.0969L7.24264 20.9964H3V16.7538L12.8995 6.85431ZM14.3137 5.44009L16.435 3.31877C16.8256 2.92825 17.4587 2.92825 17.8492 3.31877L20.6777 6.1472C21.0682 6.53772 21.0682 7.17089 20.6777 7.56141L18.5563 9.68273L14.3137 5.44009Z"
                      fill="#000"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>

            <div className="col-md-6 ps-4">
              <div className="profile__options">
                <Link
                  to={`${AUTH_ROUTE_SLUGS.AVTAR.PERSONAL_DETAILS}/${avtarDetail.id}`}
                  className="primary-btn p-5 w-100 h3 d-block rounded-10 text-center mb-3"
                >
                  Personal Details
                </Link>
                <a
                  href=""
                  className="primary-btn p-5 w-100 h3 d-block rounded-10 text-center mb-3"
                >
                  Stories
                </a>
                <a
                  href=""
                  className="primary-btn p-5 w-100 h3 d-block rounded-10 text-center"
                >
                  Photo Album
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AvtarById;
