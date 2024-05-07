import React from "react";
// import { loadStripe } from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import StripeMerchantButton from "./StripeMerchantButton";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

// ========================================================

const StripeMerchant = (props) => {
  return (
    <StripeMerchantButton
      buttonName={props.buttonName}
      color={props.color}
      variant={props.variant}
      stripePromise={stripePromise}
    />
  );
};

export default StripeMerchant;
