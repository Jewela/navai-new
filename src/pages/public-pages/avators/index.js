import { useEffect, useState } from "react";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { GENERAL } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { DEFAULT_VALUE, PUBLIC_ROUTES_SLUGS } from "../../../app/constants";
import { RESPONSE_CODE } from "../../../app/constants";
import AvtarLists from "../../../components/HomePage/SpecialHighlights/AvtarLists";
import { Spinner } from "react-bootstrap";
import RecentVisit from "../../../components/HomePage/RecentVisit";
import { useSelector } from "react-redux";

const PAGINATIOIN = {
  TAKE: 20,
  SKIP: 0,
  NO_OF_RECORDS: 10,
  TOTAL_RECORDS: 0,
};

function Avators() {
  const { isAuthenticated, userData: { isBusiness, userType = "" } } = useSelector((state) => state.auth);

  const _userType = userType.toLowerCase();
  const isOrgLogin = (isAuthenticated && isBusiness);

  const [avtarList, setSetAvtarList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(true);
  const [takeRecord, setTakeRecord] = useState(PAGINATIOIN.TAKE);
  const [skipRecord, setSkipRecord] = useState(PAGINATIOIN.SKIP);
  const [totalRecords, setTotalRecords] = useState(PAGINATIOIN.TOTAL_RECORDS);
  const [isLimitReached, setIsLimitReached] = useState(false);

  async function getAvtar(url) {
    setLoadMore(true);
    const LOCALE = DEFAULT_VALUE.LOCALE;
    let payloadData = JSON.stringify({
      take: takeRecord,
      skip: skipRecord,
      // filter: {
      //   logic: "and",
      //   filters: [
      //     {
      //       field: "isPublic",
      //       operator: "eq",
      //       value: true,
      //     },
      //     {
      //       field: "isPublished",
      //       operator: "eq",
      //       value: true,
      //     },
      //     // {
      //     //   field: "avatarCategoryEnum",
      //     //   operator: "eq",
      //     //   value: true,
      //     // },
      //   ],
      // },
    });

    if (filterRequired) {
      payloadData['filter'] = {
        logic: "and",
        filters: [
          {
            field: "isPublic",
            operator: "eq",
            value: true,
          },
          {
            field: "isPublished",
            operator: "eq",
            value: true,
          },
        ],
      };
    }


    try {
      const response = await postRequest(url, payloadData);
      const {
        status,
        data: {
          count,
          result,
          httpResponseDetail: { httpStatusCode },
        },
      } = response;
      const { data } = result;

      if (
        httpStatusCode === RESPONSE_CODE[200] &&
        status === RESPONSE_CODE[200]
      ) {
        if (data.length) {
          setSetAvtarList([...avtarList, ...data]);
        } else {
          setIsLimitReached(true);
        }
        setTotalRecords(count);
        setLoading(false);
        setLoadMore(false);
      } else {
        setErrorMessage("error message...");
        setLoadMore(false);
      }
    } catch (error) {
      setLoadMore(false);
      const errorMessage = getErrorMessage(error);
      console.warn({ error, errorMessage });
    }
  }

  useEffect(() => {

    let _URL = GENERAL.GET_AVTAR
    let filterRequired = true;
    if (isOrgLogin) {
      if (_userType === "guest") {
        _URL = GENERAL.GET_AVTAR_FOR_AVATAR;
      } else {
        _URL = GENERAL.GET_ADMIN_OR_PLAYGROUND_AVTAR;
        filterRequired = false
      }
    }

    getAvtar(_URL, filterRequired);
    if (avtarList.length === 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    }
  }, [skipRecord]);

  const loadMoreAvators = () => {
    setSkipRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
    // setTakeRecord(PAGINATIOIN.NO_OF_RECORDS);
    // setTakeRecord((prev) => prev + PAGINATIOIN.NO_OF_RECORDS);
  };

  if (isLoading) {
    return (
      <div className="loading1 mt-5 pre-loading">
        <Spinner
          className="mb-2"
          as="span"
          animation="grow"
          size="lg"
          role="status"
          aria-hidden="true"
        />
        <p>Please wait...</p>
      </div>
    );
  }

  return (
    <>
      <section className="page-heading light-bg py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12 text-center position-relative">
              <h1 className="mb-0 h2 fw-bold">Avatars</h1>
            </div>
          </div>
        </div>
      </section>

      <section className="spacer-md text-center">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <svg
                width="100%"
                height="1050"
                viewBox="0 0 1500 1500"
                className="filter-svg"
              >
                <circle cx="700" cy="700" fill="#53107B" r="650"></circle>
              </svg>
              <AvtarLists isLoading={isLoading} avtarList={avtarList} />

              <button
                className={`m-auto btn primary-btn mt-5 d-flex justify-content-center align-items-center ${loadMore && "btn-loading"
                  }`}
                onClick={loadMoreAvators}
                disabled={isLimitReached}
              >
                Load More{" "}
                {loadMore && (
                  <>
                    &nbsp;
                    <Spinner
                      className="loadmore-btn"
                      as="span"
                      animation="border"
                      size="lg"
                      role="status"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* <RecentVisit /> */}
    </>
  );
}
export default Avators;
