import React from "react";
import { useDispatch } from "react-redux";
import accountService from "services/account.service";
import DynamicButton from "ui-component/buttons/DynamicButton";
import { showSnackbar } from "actions/main";

// ========================================================
/* PROPS MAP
buttonName = string
color = string
variant = string
*/

const MerchantButton = (props) => {
  const dispatch = useDispatch();

  // define states
  const [isLoading, setIsLoading] = React.useState(false);

  const clickHandler = async (event) => {
    // Block native event handling.
    // event.preventDefault();
    setIsLoading(true);

    // Call your backend to create the VerificationSession.
    await accountService
      .getStripeLinkMerchant({})
      .then((response) => {
        if (!!response.data.payload.success) {
          // When the user clicks on the button, redirect to the session URL.
          window.location.href = response.data.payload.redirect;
        }
      })
      .catch((error) => {
        dispatch(
          showSnackbar(
            "There seems to be an issue. Please contact support if this issue persists.",
            true,
            "error"
          )
        );
        console.log("uncaught error", error);
        setIsLoading(false);
      });
  };

  return (
    <DynamicButton
      role="link"
      name={isLoading ? "Loading..." : props.buttonName}
      disabled={isLoading}
      color={props.color}
      variant={props.variant}
      onClick={clickHandler}
    />
  );
};

export default MerchantButton;
