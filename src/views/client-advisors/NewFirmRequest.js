import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography, Grid, IconButton } from "@material-ui/core";
import { IconInfoCircle } from "@tabler/icons";

// local imports
import adviceService from "services/advice.service";
import RequestFirmForm from "./forms/RequestFirmForm";
import DynamicButton from "ui-component/buttons/DynamicButton";
import { attributesNavigation } from "utils/navigation";
import { showSnackbar } from "actions/main";
import GeneralWrapper from "ui-component/wrappers/GeneralWrapper";
import HtmlTip from "ui-component/extended/HtmlTip";
import UserProfileBanner from "ui-component/banners/UserProfileBanner";
import { SET_MENU } from "actions/types";
import tokenService from "services/token.service";
import SupportRequest from "ui-component/modals/SupportRequest";
import accountService from "services/account.service";

// style constant
const useStyles = makeStyles((theme) => ({
  surveyCard: {
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "2%",
    border: `2px solid ${theme.palette.primary.main}`,
    "@media (max-width: 600px)": {
      margin: "0 auto",
    },
  },
}));

// ==============================================================

const NewFirmRequest = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef();
  const customization = useSelector((state) => state.customization);
  const auth = useSelector((state) => state.auth);

  // check the session storage for the survey
  const survey = tokenService.getSessionSurvey();

  // grab the query parameters
  const queryParams = new URLSearchParams(location.search);
  const firmParam = queryParams.get("firmslug");

  // data states
  const [slug, setSlug] = useState(firmParam ? firmParam : "");
  const [message, setMessage] = useState("");
  // 'Provide a brief introduction about you and what you would like to accomplish with the help of an advisor. \n\n"Hello, I am newly married and graduated college 5 years ago. I am looking for help outlining a financial plan that will help me achieve my retirement goals..."'
  const [firmData, setFirmData] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [noFirm, setNoFirm] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [openSupportRequest, setOpenSupportRequest] = useState(false);

  // handle retrieving chat/advisor data
  const getFirmData = async (firmslug) => {
    return new Promise(async (resolve, reject) => {
      await adviceService
        .getAdvisor({ firmslug: firmslug }, {})
        .then((response) => {
          if (!!response.data.payload.success && !!response.data.payload.firm) {
            let firmData = response.data.payload.firm;
            resolve(firmData);
          } else {
            reject(response.data.details.text);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // get firm profile information, including image and name
  useEffect(() => {
    if (slug) {
      getFirmData(slug)
        .then((firmData) => {
          setFirmData(firmData);
          setIsLoading(false);
        })
        // if the firm data fails to be retrieved, send the user to login.
        .catch((error) => {
          setNoFirm(true);
          console.log("caught error", error);
          setIsLoading(false);
        });
    }
  }, []);

  useEffect(() => {
    // if there are no attributes detected, then make the user login.
    if (!auth.attributes || Object.entries(auth.attributes).length === 0) {
      navigate("/login");
    } else if (!slug) {
      history.pushState(null, null, "/advisory/client/messages/");
      window.location.href = "https://www.rally.markets/advisor-finder/";
    }
    // close the side menu if it is open
    if (!!customization.opened) {
      dispatch({ type: SET_MENU, opened: false });
    }
  }, []);

  // handle message change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim().length > 0) {
      setShowContinueButton(true);
    } else {
      setShowContinueButton(false);
    }
  };

  // handle user search
  const handleRequest = async () => {
    if (
      formRef.current.errors &&
      Object.entries(formRef.current.errors).length > 0
    ) {
      setErrorInfo(formRef.current.errors);
      setShowFormError(true);
      return null;
    } else {
      // make this client a prospect
      await adviceService
        .postAdvisorRequest({ firm_slug: slug, text: message })
        .then((response) => {
          if (!!response.data.payload.success) {
            dispatch(
              showSnackbar("Request sent successfully", true, "success")
            );
            setTimeout(() => {
              attributesNavigation(navigate, location);
            }, 1000);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            console.log("caught error", response.data.details.text);
          }
        })
        .catch((error) => {
          // $$$ validate that the firm exists by checking the response for a certain error code.
          dispatch(
            showSnackbar(
              "There seems to be an issue. Please contact support if this issue persists.",
              true,
              "error"
            )
          );
          console.log("uncaught error", error);
        });
    }
  };

  // when submit button is selected.
  const handleConfirm = async (title, message) => {
    // send email to the user with a link to reset their password
    await accountService
      .postSupport({
        title: title,
        message: message,
      })
      .then((response) => {
        setOpenSupportRequest(false);
        dispatch(showSnackbar(response.data.details.text, true, "error"));
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

  return (
    <>
      <SupportRequest
        open={openSupportRequest}
        header={"Support Request"}
        handleCancel={() => setOpenSupportRequest(false)}
        handleConfirm={handleConfirm}
      />
      {!!noFirm && !isLoading ? (
        <GeneralWrapper className={classes.surveyCard}>
          <Box className="horizontal-center">
            <Typography variant="h2" sx={{ marginBottom: 3 }}>
              Firm not found.
            </Typography>
          </Box>
          <Box className="horizontal-center">
            <Typography variant="body1" sx={{ marginBottom: 2 }}>
              We could not find the details of the firm you are searching for.
              Continue your search to find a different advisory firm.
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Grid
              container
              direction="row"
              display="flex"
              justifyContent={"center"}
              mt={1}
            >
              <DynamicButton
                name="Continue Search"
                color="primary"
                variant="contained"
                onClick={() => {
                  window.location.href =
                    "https://www.rally.markets/advisor-finder/?error=" + slug;
                }}
              />
            </Grid>
          </Box>
        </GeneralWrapper>
      ) : !isLoading ? (
        <GeneralWrapper className={classes.surveyCard}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="h2" sx={{ marginBottom: 3 }}>
              Request Advice
            </Typography>
          </Box>
          <Box>
            <UserProfileBanner
              // link the image retrieved from the database upon requesting the firm details.
              image={firmData.image}
              name={firmData.name}
              location={firmData.location}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <RequestFirmForm
              editMode={true}
              data={{ message: message }}
              handleMessageChange={handleMessageChange}
              forwardedFormRef={formRef}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <Grid
              container
              direction="row"
              display="flex"
              justifyContent={"right"}
              mt={1}
            >
              <HtmlTip body="Send a message to start a conversation with an advisor and figure out if they are right for you. You will not be charged for sending messages over chat.">
                <IconButton size="small">
                  <IconInfoCircle />
                </IconButton>
              </HtmlTip>
              <DynamicButton
                name="Send Message"
                color="primary"
                variant="contained"
                onClick={handleRequest}
                disabled={!showContinueButton}
              />
            </Grid>
          </Box>
        </GeneralWrapper>
      ) : (
        <GeneralWrapper className={classes.surveyCard}>
          <Box className="horizontal-center">Loading...</Box>
        </GeneralWrapper>
      )}
    </>
  );
};

export default NewFirmRequest;
