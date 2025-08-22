import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../../app/httpClient/axiosClient";
import actions, { ACTION_SERVICES, CART_ACTIONS } from "../../../redux/authenticate/actions";
import {
  AUTH_ROUTE_SLUGS,
  DEFAULT_VALUE,
  PROTECTED_ROUTE_SLUGS,
  RESPONSE_CODE,
  SUBSCRIPTION_TYPES,
} from "../../../app/constants";
import AuthJubmotron from "../../../container/banner/";
import Spinner from "react-bootstrap/Spinner";
import { AVTAR, MEDIA, SUBSCRIPTION } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { RESPONSE_MESSAGES } from "../../../app/constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck, faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { seoFriendlyName } from "../../../utils/helpers/functions";
import toast from "react-hot-toast";
import ChangePasswordForm from "../change-password-form";

function Subscription() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loader,
    errorMessage,
    userData: { id: userId },
  } = useSelector((state) => state.auth);
  const { avatarDetails } = useSelector((state) => state.cart);

  const [userSubscriptionStatus, setUserSubscriptionStatus] = useState(false);
  
  const [isLoading, setLoading] = useState(true);
  const [cancelSubsLoading, setCancelSubsLoading] = useState(false);
  const [subscriptionList, setSubscriptionList] = useState([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [subscriptionDetail, setSubscriptionDetail] = useState({});

  async function getSubscriptionList(url) {
    setLoading(true);
    const LOCALE = DEFAULT_VALUE.LOCALE;
    try {
      //? old logic
      // const {
      //   status,
      //   data: { httpStatusCode, data: { totalPrice } },
      // } = await getRequest(url);
      // if (
      //   status === RESPONSE_CODE[200] &&
      //   httpStatusCode === RESPONSE_CODE[200]
      // ) {
      //   dispatch({
      //     type: CART_ACTIONS.UPDATE_CART,
      //     payload: {
      //       isBusiness: false,
      //       type: SUBSCRIPTION_TYPES.USER_SUBSCRIPTION,
      //       currency: 'USD',
      //       currencySymbol: '$',
      //       cartItems: [{
      //         quantity: 1,
      //         price: totalPrice,
      //         currency: 'USD',
      //         title: 'User subscription',
      //         subtitle: 'lorem ipsum dummy text',
      //       }],
      //     },
      //   });
      //   navigate(AUTH_ROUTE_SLUGS.SUBSCRIBE.CART)
      // } else {

      // }

      const {
        status,
        data: { httpStatusCode, data },
      } = await getRequest(url);
      if (
        status === RESPONSE_CODE[200] &&
        httpStatusCode === RESPONSE_CODE[200]
      ) {
        console.log(data)
        const sortedData = data.sort((a, b) => a.actualPriceWithoutDiscount - b.actualPriceWithoutDiscount);
        setSubscriptionPlans(sortedData)
        // navigate(AUTH_ROUTE_SLUGS.SUBSCRIBE.CART)
        setLoading(false);
      } else {

      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setLoading(false)
      if (errorMessage === "Please verify OTP.") {
        navigate(PROTECTED_ROUTE_SLUGS.EMAIL_VERIFY);
      }
      toast.error(errorMessage)
    }
  }

  const getActiveSubscriptionList = async (url) => {
    try {
      const { status, data: { httpStatusCode, data } } = await postRequest(url, { "avatarId": 0 });
      setSubscriptionDetail(data);
      setLoading(false);
      setCancelSubsLoading(false);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setLoading(false)
      toast.error(errorMessage);
    }
  }

  const handleCancelSubscription = async () => {
    try {
      setCancelSubsLoading(true);
      const { status, data: { httpStatusCode, data } } = await postRequest(SUBSCRIPTION.CANCEL, {
        "avatarIds": [0]
      });
      // setSubscriptionDetail({})
      // setCancelSubsLoading(false);
      getActiveSubscriptionList(SUBSCRIPTION.ACTIVE);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage);
      setCancelSubsLoading(false)
      toast.error(errorMessage);
    }
  }

  const handleAddToClick = async (totalPrice, duration, durationIn) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_CART,
      payload: {
        isBusiness: false,
        type: SUBSCRIPTION_TYPES.USER_SUBSCRIPTION,
        currency: 'USD',
        currencySymbol: '$',
        durationIn,
        cartItems: [{
          quantity: 1,
          avatarId:avatarDetails?.Avatarid,
          price: totalPrice,
          duration: duration,
          currency: 'USD',
          title: 'User subscription',
          subtitle: 'lorem ipsum dummy text',
        }],
        avatarDetails: avatarDetails
      },
    });
    navigate(AUTH_ROUTE_SLUGS.SUBSCRIBE.CART)

  }

  useEffect(() => {
    //? old logic
    // if (userSubscriptionStatus) {
    //   getActiveSubscriptionList(SUBSCRIPTION.ACTIVE);
    // } else {
    //   getSubscriptionList(SUBSCRIPTION.SUBS_MODEL);
    
    //
    getSubscriptionList(SUBSCRIPTION.SUBS_MODEL);

    // }
    // if (!userSubscriptionStatus) {
    //   getSubscriptionList(SUBSCRIPTION.LIST);
    // }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  if (isLoading) {
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
        <AuthJubmotron title="User Subscription" />
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

  if (userSubscriptionStatus) {
    return (
      <>
        <AuthJubmotron title="User Subscription" />
        <section className="profile spacer-lg">
          <div className="container">
            <div className="row">
              <h5 className="text-success text-center">
                <FontAwesomeIcon icon={faCircleCheck} />&nbsp;Subscription is currently active.&nbsp;
                {Object.keys(subscriptionDetail).length > 0 && subscriptionDetail?.paymentGateway !== "None" &&
                  <button className="btn btn-sm btn-danger" onClick={handleCancelSubscription}>
                    Cancel Subscription&nbsp;
                    {cancelSubsLoading &&
                      <Spinner
                        className="mb-2"
                        as="span"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    }
                  </button>
                }
              </h5>
              {Object.keys(subscriptionDetail).length > 0 &&
                <div className="col-md-6 mx-auto">
                  <table className="table subscription-table">
                    <thead>
                      <tr>
                        <th>Subscription Date</th>
                        <th>Payment Gateway</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{new Date(subscriptionDetail.subscriptionStartedOnUTC).toLocaleDateString()}</td>
                        <td>{subscriptionDetail.paymentGateway}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              }
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <AuthJubmotron title="User Subscription" />
      <section className="profile py-2">
        <div className="container">
          <div className="text-center">
            <h4 className="display-6 fw-bold my-5">Choose Your Plan</h4>
            <p className="lead mx-auto">
              Select the subscription that fits your needs. No hidden fees, cancel anytime.
            </p>
          </div>
        </div>
        <div className="d-flex justify-content-center gap-5">
          {subscriptionPlans.length > 0
            ? subscriptionPlans.map((item, index) => (
              <React.Fragment key={`subs-key-${index}`}>
                <div className="col-md-3">
                  <div className="card plan-card h-100">
                    <div className="card-body">
                      <div className="mb-4"></div>

                      <div className="mb-1">
                        <span className="text-muted fs-4">$</span>
                        <span id="basic-price" className="display-4 fw-bold">{item.actualPriceWithoutDiscount}</span>
                        <span className="text-muted fw-medium"> {item.durationIn === 'Months' ? `/ ${item.forDuration > 1 ? `${item.forDuration} months` : 'month'}` : `/ ${item.forDuration > 1 ? `${item.forDuration} days` : 'day'}`} </span>
                      </div>

                      <div className="mb-4">
                        <span>Duration: </span><strong>{item.durationIn === `Months` ? `${item.forDuration} ${item.durationIn === 'Months' ? `${item.forDuration > 1 ? 'months' : 'month'}` : `${item.forDuration > 1 ? 'days' : 'day'}`}` : 'Custom'}</strong>
                      </div>

                      <button onClick={() => handleAddToClick(item.actualPriceWithoutDiscount, item.forDuration, item.durationIn)} className="btn btn-primary">
                        Add To Cart
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))
            :
            (<>
              <p className="text-danger">Subscription plans not available for now.</p>
            </>)
          }
        </div>
      </section>
    </>
  );
}

export default Subscription;
