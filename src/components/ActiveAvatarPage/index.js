import { useEffect, useState } from "react";
import { getRequest, postRequest } from "../../app/httpClient/axiosClient";
import { AVTAR, GENERAL, SUBSCRIPTION } from "../../app/config/endpoints";
import { getErrorMessage } from "../../utils/helpers/apiErrorResponse";
import AvtarLists from "./AvatarLists";
import { PUBLIC_ROUTES_SLUGS, RESPONSE_CODE, DEFAULT_VALUE } from "../../app/constants";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function ActiveAvatarList() {
  const { isAuthenticated, userData: { isBusiness, userType = "" } } = useSelector((state) => state.auth);
  const _userType = userType.toLowerCase();
  const [avtarList, setSetAvtarList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setLoading] = useState(true);

  const isOrgLogin = (isAuthenticated && isBusiness);

  // console.log({ isOrgLogin, isAuthenticated, isBusiness })
  // currenlty this code is doing nothing. added by adnaan, neither commented the purpose of this call here.

  // const getavatarmedia = async () => {
  //   try {
  //     const res = await postRequest(AVTAR.GET_AVATAR_MEDIA, {
  //       take: 10,
  //       skip: 0,
  //       filter: {
  //         logic: "and",
  //         filters: [
  //           {
  //             field: "avatarId",
  //             operator: "eq",
  //             value: "238",
  //           },
  //           {
  //             field: "mediaCategory",
  //             operator: "eq",
  //             value: 0,
  //           },
  //         ],
  //       },
  //     });
  //   } catch (error) {
  //     console.log("er", error);
  //   }
  // };

  // --------------------------

    useEffect(() => {
        async function getAvtar(url, filterRequired) {
            const LOCALE = DEFAULT_VALUE.LOCALE;
            let payloadData = {
                take: 10,
                skip: 0,
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
                //   ],
                // },
            };
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


            // if (isOrgLogin) {
            // payloadData['filter']['filters'].push({
            //   field: "avatarCategoryEnum",
            //   operator: "eq",
            //   value: true,
            // })
            // }

            const _payloadData = JSON.stringify(payloadData);
            try {
                let activeAvatarList = [];
                const { data: res } = await getRequest(SUBSCRIPTION.GET_ALL_USER_SUBSCRIBED_AVATARS);
                activeAvatarList = res?.data || [];
                const response = await postRequest(url, _payloadData);
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
                    status === RESPONSE_CODE[200] &&
                    data.length > 0
                ) {
                    const dataMap = new Map(data.map((item) => [item.id, item]));

                    // final list = activeAvatarList but with profileImage merged from data
                    const finalList = activeAvatarList.map((av) => {
                    const match = dataMap.get(av.avatarId);
                        return {
                            ...av,
                            profileImage: match?.profileImage || null, // merge profileImage
                        };
                    });
                    setSetAvtarList(finalList);
                    setLoading(false);
                } else {
                    setErrorMessage("error message...");
                    setLoading(false);
                }
            } catch (error) {
                const errorMessage = getErrorMessage(error);
                console.warn({ errorMessage });
            }
        }

        let _URL = GENERAL.GET_AVTAR
        let filterRequired = true;
        if (isOrgLogin) {
            if (_userType === "guest") {
                _URL = GENERAL.GET_AVTAR_FOR_AVATAR;
            } else {
                _URL = GENERAL.GET_ADMIN_OR_PLAYGROUND_AVTAR
                filterRequired = false;
            }
        }

        getAvtar(_URL, filterRequired);
    }, [isAuthenticated]);

  return (
    <>
      <section className="spacer-lg text-center avator text-white">
        <div className="container">
          <div className="row">
            <div className="col-md-10 mx-auto">
              <div className="section__heading">
                <h2 className="h1 text-uppercase">Subscribed Avatars</h2>
              </div>
            </div>
          </div>
          <div className="row mt-5">
            <div className="col-md-12">
              {/* <div className="avator-listing"> */}
              <AvtarLists isLoading={isLoading} avtarList={avtarList} />
              {/* </div> */}
              {/* {!isLoading && avtarList.length > 0 && (
                <Link
                  to={PUBLIC_ROUTES_SLUGS.AVATORS}
                  className="btn secondary-btn mt-5"
                >
                  Browse More
                </Link>
              )} */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ActiveAvatarList;
