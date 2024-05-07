import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// service imports
import advisoryService from "services/advisory.service";

// mui imports
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// project imports
import EarningCardDark from "./components/EarningCardDark";
import TotalGrowthBarChart from "./components/TotalGrowthBarChart";
import { gridSpacing } from "store/constant";
import { SET_MENU } from "actions/types";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";

// styles constant
const useStyles = makeStyles((theme) => ({
  blurDiv: {
    // filter: "blur(5px)",
    // marginTop: "12px",
  },
}));

// =====================================================

const Dashboard = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);
  const { opened } = useSelector((state) => state.customization);

  // if the side menu is closed on mount, open it.
  useEffect(() => {
    if (opened === false) {
      dispatch({ type: SET_MENU, opened: true });
    }
  }, []);

  // const [isLoading, setIsLoading] = useState(true);
  const [dashUrl, setDashUrl] = useState("https://dashboard.stripe.com/login");

  useEffect(async () => {
    // make a request so tokens update
    await advisoryService.getDashboard({}).then((response) => {});
  }, []);

  const getDashboardLink = async () => {
    await advisoryService
      .getDashboard({})
      .then((response) => {
        if (response.data.payload.success) {
          setDashUrl(response.data.payload.url);
          window.open(response.data.payload.url, "_blank");
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
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

  const handleNewClick = () => {
    if (attributes.MERCHANT === 1) {
      getDashboardLink();
    } else {
      alert(
        "You do not have access to the Stripe Dashboard without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    }
  };

  return (
    <>
      {/* <Box className="modalStyle">
        <Typography variant="h3">Dashboard coming soon!</Typography>
      </Box> */}
      <GenericPage
        pageHeader="Dashboard"
        noHrule={true}
        buttonlist={[
          {
            text: "View Stripe Dashboard",
            color: "primary",
            variant: "contained",
            onClick: handleNewClick,
          },
        ]}
      >
        <Grid container spacing={gridSpacing} className={classes.blurDiv}>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            {/* Pending Prospects */}
            <EarningCardDark number="30" subtitle="Pending Prospects" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            {/* Pending Invites */}
            <EarningCardDark number="4" subtitle="Pending Invites" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            {/* Pending Payments */}
            <EarningCardDark number="$1,620" subtitle="Pending Payments" />
          </Grid>
          <Grid item lg={3} md={6} sm={6} xs={12}>
            {/* Profile Views over time - grouped by week, month, year and with trendline potentially */}
            {/* <TotalOrderLineChartCard /> */}
            <EarningCardDark
              number="$12,670"
              subtitle="Rolling Monthly Revenue"
            />
          </Grid>
          <Grid item lg={12} md={12} sm={12} xs={12}>
            <TotalGrowthBarChart />
          </Grid>
        </Grid>
      </GenericPage>
    </>
  );
};

export default Dashboard;
