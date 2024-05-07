import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography, Grid } from "@material-ui/core";

// local imports
import DynamicButton from "ui-component/buttons/DynamicButton";
import GeneralWrapper from "ui-component/wrappers/GeneralWrapper";
import UserProfileBanner from "ui-component/banners/UserProfileBanner";
import { SET_MENU } from "actions/types";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";

// style constant
const useStyles = makeStyles((theme) => ({
  surveyCard: {
    display: "flex",
    marginLeft: "20%",
    marginRight: "20%",
    marginTop: "2%",
    justifyContent: "center",
    border: `2px solid ${theme.palette.primary.main}`,
    "@media (max-width: 600px)": {
      margin: "0 auto",
    },
  },
}));

// ==============================================================

const ProspectLanding = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef();
  const customization = useSelector((state) => state.customization);
  const auth = useSelector((state) => state.auth);

  // grab the query parameters
  const queryParams = new URLSearchParams(location.search);

  // mode states
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // if there are no attributes detected, then make the user login.
    if (!auth.attributes || Object.entries(auth.attributes).length === 0) {
      navigate("/login");
    } else if (!!customization.opened) {
      dispatch({ type: SET_MENU, opened: false });
    }
    setIsLoading(false);
  }, [customization]);

  // handle user search
  const handleRequest = async () => {
    history.pushState(null, null, "/advisory/client/messages/");
    window.location.href = "https://www.rally.markets/advisor-finder/";
  };

  return (
    <>
      {!!isLoading ? (
        <GeneralWrapper className={classes.surveyCard}>
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading..." />
          </Box>
        </GeneralWrapper>
      ) : (
        <GeneralWrapper className={classes.surveyCard}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Typography variant="h2" sx={{ marginBottom: 3 }}>
              Welcome to Rally!
            </Typography>
          </Box>
          <Box sx={{ mb: 2, maxWidth: "600px" }}>
            <Typography
              variant="body1"
              sx={{ textAlign: "center", marginBottom: 3 }}
            >
              The next step is to find someone to provide you with the right
              financial advice. Head to the Advisor Finder by selecting
              "Continue" below.
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
                name="Continue"
                color="primary"
                variant="contained"
                onClick={handleRequest}
              />
            </Grid>
          </Box>
        </GeneralWrapper>
      )}
    </>
  );
};

export default ProspectLanding;
