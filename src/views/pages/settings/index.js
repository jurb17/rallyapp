import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// custom imports
import SettingsBanner from "ui-component/banners/SettingsBanner";
import StripeVerification from "./stripe-verification/StripeVerification";
import StripeMerchant from "./stripe-merchant/StripeMerchant";
import ChangePassword from "ui-component/modals/ChangePassword";
import StripeCustomer from "./stripe-customer/StripeCustomer";
import SupportRequest from "ui-component/modals/SupportRequest";
import GenericPage from "ui-component/pages/GenericPage";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import { IconHeadset, IconKey } from "@tabler/icons";
import accountService from "services/account.service";
import AccountInfoForm from "./AccountInfoForm";
import { showSnackbar } from "actions/main";
import { refreshTokens } from "actions/auth";
import tokenService from "services/token.service";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================

const UserSettings = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);

  // data states
  const [accountPayload, setAccountPayload] = useState({});

  // mode states
  const [changePassword, setChangePassword] = useState(false);
  const [openSupportRequest, setOpenSupportRequest] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // if the user selects change password, present modal.
  const handleChangePassword = () => {
    setChangePassword(true);
  };

  // get user profile data
  const getUserProfile = async () => {
    await accountService.getAccount({}).then((response) => {
      if (!!response.data.payload.success) {
        setAccountPayload(response.data.payload);
      } else {
        dispatch(showSnackbar("Error getting user profile", true, "error"));
      }
      setIsLoading(false);
    });
  };

  // get user tokens and send a token refresh request.
  const updateUser = async () => {
    // get the user's tokens from the url
    let token;
    const currentrefresh = tokenService.getSessionRefreshToken();
    const localrefresh = tokenService.getLocalRefreshToken();
    if (!!currentrefresh) {
      token = currentrefresh;
    } else if (!!localrefresh) {
      token = localrefresh;
    }

    await tokenService.refreshTokenRequest(token).then(async (response) => {
      if (!!response.data.payload.success) {
        // update the user's tokens in the browser storage
        let remember = tokenService.getLocalRememberMe();
        const accesstoken = response.data.payload.tokens.accesstoken;
        const refreshtoken = response.data.payload.tokens.refreshtoken;
        // console.log("tokens", accesstoken, refreshtoken);
        dispatch(refreshTokens(accesstoken, refreshtoken, remember));
        await updateStripe();
      } else {
        console.log("error", response);
      }
    });
  };

  // send api requests to update attributes
  const updateStripe = async () => {
    if (attributes.CUSTOMER === -1) {
      await accountService.getStripeLinkCustomer({});
    }
    if (attributes.MERCHANT === -1) {
      await accountService.getStripeLinkMerchant({});
    }
    if (attributes.IDENTITY === -1) {
      await accountService.getStripeLinkIdentity({});
    }
  };

  // retrieve profile data from the server and update attributes
  useEffect(async () => {
    if (
      location.pathname.indexOf("/settings/check") !== -1 &&
      (attributes.CUSTOMER === -1 ||
        attributes.MERCHANT === -1 ||
        attributes.IDENTITY === -1)
    ) {
      await updateUser();
    }
    getUserProfile();
  }, []);

  // when submit button is selected.
  const handleConfirm = async (title, message) => {
    // send support request to hubspot
    await accountService
      .postSupport({
        title: title,
        message: message,
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          dispatch(showSnackbar("Support request sent", true, "success"));
          setOpenSupportRequest(false);
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          setOpenSupportRequest(false);
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
      });
  };

  const attributesObject = {};
  Object.entries(attributes).forEach(([key, value]) => {
    attributesObject[key] = {};
    // adding value, status, and additional message values for each attribute
    switch (value) {
      case 2:
        attributesObject[key]["value"] = 2;
        attributesObject[key]["status"] = "pending";
        attributesObject[key]["message"] =
          " requires approval from the Rally team. Please wait.";
        attributesObject[key]["color"] = "primary";
        attributesObject[key]["variant"] = "outlined";
        break;
      case 1:
        attributesObject[key]["value"] = 1;
        attributesObject[key]["status"] = "complete";
        attributesObject[key]["message"] =
          " is complete. No other action is necessary at this time.";
        attributesObject[key]["color"] = "primary";
        attributesObject[key]["variant"] = "outlined";
        break;
      case 0:
        attributesObject[key]["value"] = 0;
        attributesObject[key]["status"] = "false";
        attributesObject[key]["message"] = " has been rejected.";
        attributesObject[key]["color"] = "primary";
        attributesObject[key]["variant"] = "outlined";
        break;
      case -1:
        attributesObject[key]["value"] = -1;
        attributesObject[key]["status"] = "required";
        attributesObject[key]["message"] =
          " requires setup. Please complete the setup process.";
        attributesObject[key]["color"] = "secondary";
        attributesObject[key]["variant"] = "contained";
        break;
      case -2:
        attributesObject[key]["value"] = -2;
        attributesObject[key]["status"] = "error";
        attributesObject[key]["message"] = " is experiencing an error.";
        attributesObject[key]["color"] = "secondary";
        attributesObject[key]["variant"] = "contained";
        break;
      default:
        attributesObject[key]["status"] = "false";
    }
    // adding button and more message values for each attribute
    if (key === "ACCOUNT") {
      attributesObject[key]["message"] = "";
    } else if (key === "ADVISOR") {
      attributesObject[key]["message"] =
        "Your advisor profile with Rally Financial" +
        attributesObject[key]["message"];
    } else if (key === "RIA") {
      attributesObject[key]["message"] =
        "Your RIA profile with Rally Financial" +
        attributesObject[key]["message"];
    } else if (key === "IDENTITY") {
      attributesObject[key]["message"] =
        "Your identity verification process with Stripe" +
        attributesObject[key]["message"];
      attributesObject[key]["button"] = (
        <StripeVerification
          buttonName={"Identity Verification"}
          color={attributesObject[key]["color"]}
          variant={attributesObject[key]["variant"]}
        />
      );
    } else if (key === "MERCHANT") {
      attributesObject[key]["message"] =
        "Your merchant account with Stripe" + attributesObject[key]["message"];
      attributesObject[key]["button"] = (
        <StripeMerchant
          buttonName={"Merchant Account"}
          color={attributesObject[key]["color"]}
          variant={attributesObject[key]["variant"]}
        />
      );
    } else if (key === "CUSTOMER") {
      attributesObject[key]["message"] =
        "Your customer account with Stripe" + attributesObject[key]["message"];
      attributesObject[key]["button"] = (
        <StripeCustomer
          buttonName={"Customer Account"}
          color={attributesObject[key]["color"]}
          variant={attributesObject[key]["variant"]}
        />
      );
    }
  });

  return (
    <>
      <ChangePassword
        open={changePassword}
        handleCancel={() => setChangePassword(false)}
        handleConfirm={() => setChangePassword(false)}
      />
      <SupportRequest
        open={openSupportRequest}
        header={"Support Request"}
        handleCancel={() => setOpenSupportRequest(false)}
        handleConfirm={handleConfirm}
      />
      <GenericPage
        pageHeader="Account Settings"
        buttonlist={[
          {
            name: "Change Password",
            color: "primary",
            variant: "outlined",
            startIcon: <IconKey stroke={1.25} />,
            onClick: handleChangePassword,
          },
          {
            name: "Contact Support",
            color: "primary",
            variant: "outlined",
            startIcon: <IconHeadset stroke={1.25} />,
            onClick: () => setOpenSupportRequest(true),
          },
        ]}
      >
        <SubsectionWrapper
          title="Account Information"
          tipBody="Your account information is used to identify you and your account with Rally Financial. If you have any questions about your account, please contact us using the Contact Support form."
        >
          {!isLoading ? (
            <AccountInfoForm profile={accountPayload.user} />
          ) : (
            <div>Loading...</div>
          )}
        </SubsectionWrapper>
        <SubsectionWrapper
          mt={2}
          title="Account Attributes"
          tipBody="Your account attributes manage your access to features around the app. If you have any questions about your account, please contact us using the Contact Support form."
        >
          {!isLoading ? (
            Object.entries(attributesObject).map(([key, value]) => {
              if (value.status !== "false" && value.message.length > 0) {
                return (
                  <Grid
                    item
                    key={key}
                    xs={12}
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      mt: 1,
                      mb: 2,
                    }}
                  >
                    <SettingsBanner
                      status={value.status}
                      message={value.message}
                    >
                      {value.button && value.button}
                    </SettingsBanner>
                  </Grid>
                );
              }
            })
          ) : (
            <div>Loading...</div>
          )}
        </SubsectionWrapper>
      </GenericPage>
    </>
  );
};

export default UserSettings;
