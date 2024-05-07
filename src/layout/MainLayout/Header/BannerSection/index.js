import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Button, Typography, useMediaQuery } from "@material-ui/core";
import { IconAlertTriangle } from "@tabler/icons";

// project imports
import DynamicButton from "ui-component/buttons/DynamicButton";

// style constant
const useStyles = makeStyles((theme) => ({
  banner: {
    display: "flex",
    flexGrow: 1,
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: theme.palette.warning.light,
    border: "2px solid",
    borderColor: theme.palette.secondary.main,
    height: "52px",
    width: "calc(100vw - 260px - 114px - 16px)",
    margin: "0px 16px",
    padding: "0px 16px",
    borderRadius: "12px",
    color: theme.palette.text.primary,
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("md")]: {
      width: "calc(100vw - 60px - 114px - 16px)",
      padding: "0px 8px",
    },
  },
  warningIcon: {
    color: theme.palette.secondary.main,
    marginRight: "8px",
    flexShrink: 0,
  },
}));

// ================================================================

const Banner = () => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { attributes } = useSelector((state) => state.auth);

  const clickHandler = () => {
    if (
      attributes.ACCOUNT === 1 &&
      (attributes.CUSTOMER === -1 || attributes.CUSTOMER === 1) &&
      attributes.ADVISOR === 0 &&
      attributes.RIA === 0
    ) {
      navigate("/client/settings");
    } else {
      navigate("/adv/settings");
    }
  };

  return (
    <>
      {!location.pathname.includes("/adv/settings") &&
      !location.pathname.includes("/client/settings") &&
      !location.pathname.includes("/signup") &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/onboarding") &&
      !location.pathname.includes("/advisors/new") ? (
        <Box className={classes.banner}>
          {" "}
          {!matchDownSm ? (
            <>
              <IconAlertTriangle className={classes.warningIcon} />
              <Typography variant="body1">
                Your account setup is not complete. Please continue setting up
                your account.
              </Typography>
              <Box>
                <DynamicButton
                  name="Continue"
                  color="secondary"
                  variant="contained"
                  onClick={clickHandler}
                />
              </Box>
            </>
          ) : (
            <Box
              component={Button}
              onClick={clickHandler}
              color="black"
              lineHeight={1.5}
              startIcon={<IconAlertTriangle className={classes.warningIcon} />}
            >
              Account incomplete.
            </Box>
          )}
        </Box>
      ) : (
        <p></p>
      )}
    </>
  );
};

export default Banner;
