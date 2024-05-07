import React from "react";
// import { loadStripe } from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import StripeCustomerButton from "./StripeCustomerButton";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

// ========================================================

const StripeCustomer = (props) => {
  return (
    <StripeCustomerButton
      buttonName={props.buttonName}
      color={props.color}
      variant={props.variant}
      stripePromise={stripePromise}
    />
  );
};

export default StripeCustomer;
