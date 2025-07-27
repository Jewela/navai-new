import { useState, useEffect, lazy } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  ALLOWED_USERID,
  AUTH_ROUTE_SLUGS,
  DEFAULT_VALUE,
  PUBLIC_ROUTES_SLUGS,
  RESPONSE_CODE,
  USER_TYPES,
} from "../../../app/constants";
import { postRequest } from "../../../app/httpClient/axiosClient";
import { GENERAL } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { RESPONSE_MESSAGES } from "../../../app/constants/localizedStrings";

const UserAvatar = lazy(() => import("./userAvatars"));

import AvatarMenu from "./AvatarMenu";
function Avtar() {
  const {
    userData,
    // : { id, isBusiness },
  } = useSelector((state) => state.auth);
  const IfBusinessUser = userData?.isBusiness;
  const _userType = userData?.userType.toLowerCase();

  const [avatarList, setAvtarList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isFavAvatarLoading, setFavAvatarLoading] = useState(true);
  const [favAvatars, setFavAvatars] = useState([]);
  const navigate = useNavigate();
  // Prepare data for the chart



  useEffect(() => {
    async function getAvtar(url) {
      const LOCALE = DEFAULT_VALUE.LOCALE;
      let payloadData = JSON.stringify({
        take: 50,
        skip: 0,
        // filter: {
        //   logic: "and",
        //   filters: [
        //     {
        //       field: "CreatedById",
        //       operator: "eq",
        //       value: userData?.id,
        //     },
        //   ],
        // },
      });

      try {
        const response = await postRequest(url, payloadData);
        const {
          status,
          data: {
            result,
            httpResponseDetail: { httpStatusCode },
          },
        } = response;
        const { data } = result;
        if (
          httpStatusCode === RESPONSE_CODE[200] &&
          status === RESPONSE_CODE[200]
        ) {
          setAvtarList(data);
        } else {
          setErrorMessage(RESPONSE_MESSAGES[LOCALE].AVTAR_LIST_FAILURE);
        }
        setLoading(false);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.warn({ error, errorMessage });
        setErrorMessage(errorMessage);
      }
    }
    // getAvtar(GENERAL.GET_AVTAR);
    // getAllFavorite();
    window.scrollTo({
      top: 0,
      left: 0,
    });

    if (!ALLOWED_USERID.includes(userData?.id)) {
      // navigate(PUBLIC_ROUTES_SLUGS.ROOT);
    }
    if (IfBusinessUser && _userType === USER_TYPES.GUEST) {
      navigate(PUBLIC_ROUTES_SLUGS.ROOT);
    } else {
      // getAvtar(GENERAL.GET_AVTAR);
      getAvtar(GENERAL.GET_ADMIN_OR_PLAYGROUND_AVTAR);
    }
    // getAllFavorite();
  }, []);

  return (
    <>
      <section className="page-heading light-bg py-5">
        <div className="container">
          <div className="row position-relative">
            <div className="col-md-12 text-center position-relative">
              <h1 className="mb-0 h2 fw-bold">
                {userData?.isBusiness ? "Admin Dashboard" : "My Avatars"}
              </h1>
            </div>
            <AvatarMenu />
          </div>
        </div>
      </section>

      <section className="spacer-md avator py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <div className="d-flex align-items-center justify-content-between">
                <h2 className="h3 mb-0">
                  All {userData?.isBusiness ? "Agents" : "Avatars"}
                </h2>
                {/* <div className="d-flex gap-2">
                  <Link
                    to={
                      userData?.isBusiness
                        ? AUTH_ROUTE_SLUGS.AVTAR.CREATE
                        : AUTH_ROUTE_SLUGS.AVTAR.CREATE
                    }
                    className={`btn primary-btn ${userData?.isSubscriptionActive == false
                      ? "pe-none disabled-btn"
                      : ""
                      }`}
                  >
                    {userData?.isBusiness ? "Create AI Agent" : "Create Avatar"}
                  </Link>
                  <Link
                    to="/playground"
                    className={`btn primary-btn ${userData?.isSubscriptionActive == false
                      ? "pe-none disabled-btn"
                      : ""
                      }`}
                  >
                    Playground
                  </Link>
                </div> */}
              </div>
            </div>
          </div>
          <div className="row mt-4 avtor-wrapper">
            <UserAvatar
              isLoading={isLoading}
              errorMessage={errorMessage}
              avatarList={avatarList}
              favAvatars={favAvatars}
              isFavAvatarLoading={isFavAvatarLoading}
              userId={userData?.id}
            />
            {/* <div className="row mt-5">
                        <div className="col-md-12 text-center">
                            <Link to={AUTH_ROUTE_SLUGS.AVTAR.CREATE} className="btn primary-btn">Create more Avatar</Link>
                        </div>
                    </div> */}
          </div>
        </div>
      </section>
    </>
  );
}

export default Avtar;
