import { useState, useEffect, useMemo, useRef } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import "./StripeApp.css";
// const stripePromise = loadStripe("pk_test_51PBKo6SD3zgPmo1OqWjoe6kRLQtqztLyCVVIMgowyIFULSRYQr5RzY6Rd7ZSqCUblECTQQx2lQcLgVV9DipJSBQu00y9JcvSJ3");
const stripePromise = loadStripe(
  "pk_test_51Kjf1aHgx5IfzWEDsNKgsQfIczJpw2tNsF6GA72KvmCpQNVcUrPFRYP1Ix6HoglF8CmVP6n4uUG671ZxqDkdKFoo00cZKCTXz5"
);

import AuthJubmotron from "../../../container/banner/";
import { postRequest } from "../../../app/httpClient/axiosClient";
import CheckoutForm from "./CheckoutForm";
import { Spinner } from "react-bootstrap";

function BecomeMember() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const getPaymentIntent = async () => {
    const payload = { price: 1 };
    const response = await postRequest(
      "http://127.0.0.1:3001/api/CreateStripeIntent",
      payload
    );

    const {
      status,
      data: {
        data: { clientSecret },
      },
    } = response;
    console.log(clientSecret);
    setClientSecret(clientSecret);
    setIsLoading(false);
  };

  useEffect(() => {
    getPaymentIntent();
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

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

  return (
    <>
      <AuthJubmotron title="My Profile" />

      <section className="profile spacer-lg">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mx-auto">
              <div className="profile-blk">
                <div className="" id="payment_popup">
                  <div className="">
                    {isLoading && (
                      <div className="text-center">
                        <Spinner />
                      </div>
                    )}
                    {clientSecret && (
                      <Elements options={options} stripe={stripePromise}>
                        <CheckoutForm />
                      </Elements>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default BecomeMember;
