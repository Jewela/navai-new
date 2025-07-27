import { useState, useEffect, useMemo, useRef } from "react";
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
  ROUTE_SLUGS,
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

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { seoFriendlyName } from "../../../utils/helpers/functions";
import toast from "react-hot-toast";
import ChangePasswordForm from "../change-password-form";

import { useLocation } from 'react-router-dom';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

function PaymentCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loader,
    errorMessage,
    userData: { id: userId, ...props },
  } = useSelector((state) => state.auth);

  const { type: cartType, cartItems, currency, currencySymbol, avatarDetails = {} } = useSelector((state) => state.cart);
  const [isLoading, setLoading] = useState(true);
  const [stripeRedirectStatus, setStripeRedirectStatus] = useState(false)
  const [message, setMessage] = useState(cartType === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION
    ? "Payment success. Avatar published successfully"
    : "Payment success. Subscription added successfully");
  const [navigateLink] = useState(cartType === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION
    ? AUTH_ROUTE_SLUGS.AVTAR.LIST
    : ROUTE_SLUGS.HOMEPAGE);
  const [buttonTitle] = useState(cartType === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION
    ? "Go to Admin Dashboard"
    : "Go to Homepage");

  const query = useQuery();

  const type = query.get('type');
  const paymentIntent = query.get('payment_intent');
  const paymentIntentClientSecret = query.get('payment_intent_client_secret');
  const redirectStatus = query.get('redirect_status');
  const paymentStatus = query.get('status');
  console.log({ paymentStatus })

  const handleUserSubscription = async () => {
    try {
      if (cartType === SUBSCRIPTION_TYPES.AVATAR_SUBSCRIPTION) {
        let payloadData = JSON.stringify({
          avatarId: avatarDetails.Avatarid,
          isPublished: true,
        });
        const { status, data: { httpStatusCode } } = await postRequest(AVTAR.PUBLISH, payloadData)
        if (httpStatusCode === RESPONSE_CODE[200] &&
          status === RESPONSE_CODE[200]
        ) {
          toast.success("Avatar publish status updated successfully!");
        } else {
          toast.error(`Couldn't process your request. please try again.`);
        }
      }

      dispatch({
        type: CART_ACTIONS.RESET_ON_SUCCESS,
        payload: {
          type: null,
          currency: 'USD',
          currencySymbol: '$',
          cartItems: [],
          avatarDetails: {}
        },
      })

      dispatch({
        type: actions.UPDATE_USER_SUBSCRIPTION,
        payload: {},
      })
      setLoading(false);
      // setMessage("Payment success. Subscription added successfully");
    } catch (error) {
      console.error(error);
      const errorMessage = getErrorMessage(error)
      toast.error(errorMessage);
    }


    // try {
    //   const payload = { referenceId: paymentIntent };
    //   const response = await postRequest(SUBSCRIPTION.ADD, payload);

    //   const { status, data } = response;
    //   console.log({ status, data });
    //   if (type === 'user-subscription') {

    //     dispatch({
    //       type: CART_ACTIONS.RESET_ON_SUCCESS,
    //       payload: {
    //         isBusiness: null,
    //         type: null,
    //         currency: 'USD',
    //         currencySymbol: '$',
    //         cartItems: [],
    //       },
    //     })

    //     dispatch({
    //       type: actions.UPDATE_USER_SUBSCRIPTION,
    //       payload: {},
    //     })
    //   }

    //   setLoading(false);
    //   setMessage("Payment success. Subscription added successfully")
    // } catch (error) {
    //   toast.error('Getting error while adding subscription.');
    //   setLoading(false);
    //   setMessage('Getting error while adding subscription.');
    // }
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    console.log({
      paymentStatus,
      paymentIntent,
      paymentIntentClientSecret,
      redirectStatus,
    })

    if (paymentStatus === null || paymentStatus === '') {
      navigate(ROUTE_SLUGS.HOMEPAGE)
    }

    if (paymentStatus === "success") {
      setStripeRedirectStatus(true);
      handleUserSubscription();
    } else {
      setStripeRedirectStatus(false);
      setLoading(false);
      setMessage('Payment failed.');
    }

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

  return (
    <>

      <section className="profile spacer-lg">
        <div className="container">
          <div className="row text-center">
            {
              stripeRedirectStatus
                ? <div>
                  <h4 className='text-success'>{message}</h4>
                  <Link className="btn btn-primary" to={navigateLink}>{buttonTitle}</Link>
                </div>
                : <h4 className='text-danger'>{message}</h4>
            }
          </div>
        </div>
      </section>
    </>
  );
}

export default PaymentCallback;
