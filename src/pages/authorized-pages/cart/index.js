import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import {
  getRequest,
  postRequest,
  putRequest,
} from "../../../app/httpClient/axiosClient";
import actions, { ACTION_SERVICES } from "../../../redux/authenticate/actions";
import {
  AUTH_ROUTE_SLUGS,
  DEFAULT_VALUE,
  PROTECTED_ROUTE_SLUGS,
  RESPONSE_CODE,
  ROUTE_SLUGS,
  STRIPE,
  SUBSCRIPTION_TYPES,
} from "../../../app/constants";
import AuthJubmotron from "../../../container/banner/";
import Spinner from "react-bootstrap/Spinner";
import { AVTAR, MEDIA, SUBSCRIPTION } from "../../../app/config/endpoints";
import { getErrorMessage } from "../../../utils/helpers/apiErrorResponse";
import { RESPONSE_MESSAGES } from "../../../app/constants/localizedStrings";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import '../../../assets/css/stripestyles.css'
import './index.css'
// const stripePromise = loadStripe(STRIPE.PUBLISH_KEY);
const stripePromise = loadStripe('pk_test_51Kjf1aHgx5IfzWEDsNKgsQfIczJpw2tNsF6GA72KvmCpQNVcUrPFRYP1Ix6HoglF8CmVP6n4uUG671ZxqDkdKFoo00cZKCTXz5');

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { seoFriendlyName } from "../../../utils/helpers/functions";
import toast from "react-hot-toast";
import ChangePasswordForm from "../change-password-form";
import StripeCheckoutForm from "./StripeCheckoutForm";

function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [avatarImage, setAvatarImage] = useState("/images/avator-4.jpg");
  const { type, cartItems, currency, currencySymbol, avatarDetails = {}, durationIn } = useSelector((state) => state.cart);
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setLoading] = useState(true);
  const [isCheckoutLoading, setCheckoutLoading] = useState(false);
  const [strpeIntententStatus, setStrpeIntententStatus] = useState(false);
  const todayDate = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

  // Default isoDate = tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [isoDate, setIsoDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [dateDifference, setDateDifference] = useState(1);

  const handleChange = (e) => {
    const localDate = e.target.value; // e.g. "2025-08-17"
    const utcDate = new Date(localDate).toISOString();
    setIsoDate(localDate);

    // Convert both dates to Date objects
    const selected = new Date(localDate);
    const today = new Date(todayDate);

    // Difference in milliseconds
    const diffMs = selected.getTime() - today.getTime();

    // Convert to days
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    setDateDifference(diffDays);

  };

  const totalsum = Math.round(
    dateDifference * cartItems.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0) * 100
  ) / 100;

  const haneleCheckout = async () => {
    const [{avatarId, duration, price}] = cartItems
    console.log({cartItems, avatarId, duration, price});
    // return false;
    try {
      setCheckoutLoading(true);
      // const payload = { price: totalsum };
      // const response = await postRequest(SUBSCRIPTION.CREATE_STRIPE_INTENT, payload);
      // const duration = cartItems
      const payload = {
        "avatarIds": [avatarId],
        "duration": duration,
        "amount": totalsum
      };
      if(durationIn === 'Days') {
        payload.subscriptionDateTimeRange = {
          "startDateTime": todayDate,
          "endDateTime": isoDate
        }
        delete payload.duration;
      }
      const response = await postRequest(SUBSCRIPTION.CHECKOUT_SESSION, payload);

      const { status, data: { data } } = response;
      console.log({ status, data });
      window.location = data;
      setClientSecret(clientSecret);
      setCheckoutLoading(false);
      setStrpeIntententStatus(true);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage)
      toast.error(`Unable to create stripe payment intent. Please try again or contact with Administration`);
      setCheckoutLoading(false);
    }
  };

  const appearance = {
    theme: "stripe",
    variables: {
      fontFamily: "Sohne, system-ui, sans-serif",
      fontWeightNormal: "500",
      borderRadius: "8px",
      colorBackground: "#0A2540",
      colorPrimary: "#EFC078",
      accessibleColorOnColorPrimary: "#1A1B25",
      colorText: "white",
      colorTextSecondary: "white",
      colorTextPlaceholder: "#ABB2BF",
      tabIconColor: "white",
      logoColor: "dark",
    },
    rules: {
      ".Input": {
        backgroundColor: "#212D63",
        border: "1px solid var(--colorPrimary)",
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };


  const handlePayPalClick = async () => {
    // Handle the PayPal button click event
    try {
      setCheckoutLoading(true);
      // const payload = { price: totalsum };
      // const response = await postRequest(SUBSCRIPTION.CREATE_STRIPE_INTENT, payload);
      const payload = {
        "avatarId": type === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION ? avatarDetails?.Avatarid : null
      };
      const response = await postRequest(SUBSCRIPTION.CHECKOUT_PAYPAL_SESSION, payload);

      const { status, data: { data } } = response;
      console.log({ status, data });
      window.location = data;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error(errorMessage)
      toast.error(`Unable to create stripe payment intent. Please try again or contact with Administration`);
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    console.log({ type, cartItems });
    if (cartItems.lenght === 0 || type === null) {
      navigate(ROUTE_SLUGS.HOMEPAGE)
    }
    if (type === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION) {
      avatarDetails?.images.forEach(({ isProfile, ...rest }) => {
        if (isProfile) {
          setAvatarImage(rest.imageBlobUrl);
        }
      });
    }
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
    setLoading(false);
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

  return (
    <>
      <AuthJubmotron title="Cart" />
      <section className="profile py-5">
        <div className="container">
          <div className="row">
            {strpeIntententStatus
              ? <React.Fragment>
                <div className="col-md-6">
                  {clientSecret && (
                    <Elements options={options} stripe={stripePromise}>
                      <StripeCheckoutForm stripeSecretIntent={clientSecret} />
                    </Elements>
                  )}
                </div>
              </React.Fragment>
              : <React.Fragment>
                <div className="col-12 col-sm-12 col-md-12 col-lg-8">
                  {type === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION
                    ? <>
                      <hr />
                      <div className="cart-item py-2">
                        <div className="row">
                          <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                            <div className="d-flex justify-content-between mb-3">
                              <div className="mx-3">
                                <h5>{avatarDetails?.name}</h5>
                                <div className="d-flex">
                                  <h4>{`${cartItems[0].currency} ${cartItems[0].price}`}</h4><span className="">/month</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                    : <>
                      {cartItems.map((item, index) => {
                        return <React.Fragment key={`cart-item-key${index}`}>
                          <hr />
                          <div className="cart-item py-2">
                            <div className="row">
                              <div className="col-12 col-sm-12 col-md-6 col-lg-6">
                                <div className="d-flex justify-content-between mb-3">
                                  <div className="mx-3">
                                    <h5>{item.title}</h5>
                                    <div className="d-flex">
                                      <h4>{`${item.currency} ${item.price}`}</h4><span className="mx-2"> for </span> <strong className="">{item.duration} {durationIn === 'Months' ? `${item.duration > 1 ? 'months' : 'month'}` : `${item.duration > 1 ? 'days' : 'day'}`}</strong>
                                    </div>
                                    {durationIn === "Days" && (
                                      <div className="card p-3 shadow-sm rounded-3 w-100 custom-card">
                                        <h6 className="mb-3 fw-bold text-dark">Select Duration</h6>

                                        <div className="row g-3">
                                          {/* From Date */}
                                          <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary">From Date</label>
                                            <input
                                              type="date"
                                              className="form-control custom-input"
                                              value={todayDate}
                                              readOnly
                                            />
                                          </div>

                                          {/* To Date */}
                                          <div className="col-md-6">
                                            <label className="form-label fw-semibold text-secondary">To Date</label>
                                            <input
                                              type="date"
                                              className="form-control custom-input"
                                              value={isoDate}
                                              onChange={handleChange}
                                              min={todayDate}
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </React.Fragment>
                      })}
                    </>
                  }

                </div>
                <div className="col-12 col-sm-12 col-md-8 col-lg-4">
                  <div className="rounded-3 p-4 sticky-top">
                    <h6 className="mb-4">Order Summary</h6>
                    {durationIn === 'Days' && (<div className="d-flex justify-content-between align-items-center">
                      <div>Number of days</div>
                      <div>{dateDifference}</div>
                    </div>)}
                    <div className="d-flex justify-content-between align-items-center">
                      <div>Subtotal</div>
                      <div><strong> {durationIn === 'Days' && <span>{dateDifference} × </span>}{`${currency} ${totalsum}`}</strong></div>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between align-items-center">
                      <div>Total</div>
                      <div><strong>{`${currency} ${totalsum}`}</strong></div>
                    </div>
                    <button
                      disabled={isCheckoutLoading}
                      onClick={() => haneleCheckout()} className="btn btn-primary w-100 mt-4 d-flex justify-content-center align-items-center">
                      <span>Pay with credit card {isCheckoutLoading && <Spinner />}</span>
                    </button>

                    <button
                      onClick={handlePayPalClick}
                      disabled={isCheckoutLoading}
                      className="my-2 btn btn-primary"
                    >
                      <span className="alt-paypal-text">Pay with </span>
                      <img
                        src="./images/paypal-logo.png"
                        alt="PayPal"
                        className="alt-paypal-logo"
                      />
                      {isCheckoutLoading && <Spinner />}
                    </button>
                  </div>
                </div>
              </React.Fragment>
            }
          </div>
        </div>
      </section>
    </>
  );
}

export default Cart;
