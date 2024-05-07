import React, { useEffect, useState, useReducer } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
// material-ui
import { Grid, Button, Box } from "@material-ui/core";

// project imports
import EarningCard from "./EarningCard";
import PopularCard from "./PopularCard";
import TotalOrderLineChartCard from "./TotalOrderLineChartCard";
import TotalIncomeDarkCard from "./TotalIncomeDarkCard";
import TotalIncomeLightCard from "./TotalIncomeLightCard";
import TotalGrowthBarChart from "./TotalGrowthBarChart";
import { gridSpacing } from "store/constant";
import BajajAreaChartCard from "./BajajAreaChartCard";
import CardSecondaryAction from "ui-component/cards/CardSecondaryAction";
import MainCard from "ui-component/cards/MainCard";
import SubCard from "ui-component/cards/SubCard";

// ===========================|| DEFAULT DASHBOARD ||=========================== //

const Dashboard = () => {
  return (
    <Grid container spacing={gridSpacing}>
      <Grid item xs={12}>
        <Grid container spacing={gridSpacing}>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            {/* <EarningCard isLoading={isLoading} /> //Total clients */}
            <EarningCard /> //Total clients
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalOrderLineChartCard /> // New messages
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <BajajAreaChartCard /> // Bajaj Area Chart
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <Grid container direction="column" spacing={gridSpacing}>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TotalIncomeDarkCard /> // Total Income Dark
              </Grid>
              <Grid item lg={6} md={6} sm={6} xs={12}>
                <TotalIncomeLightCard /> // Total Income Light
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <PopularCard /> // PopularCard
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <CardSecondaryAction /> // Card Secondary Action
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <MainCard /> // Main Card
              </Grid>
              <Grid item lg={4} md={6} sm={6} xs={12}>
                <SubCard /> // Sub Card
              </Grid>
            </Grid>
          </Grid>
          <Grid item lg={4} md={6} sm={6} xs={12}>
            <TotalGrowthBarChart /> // Total Growth
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Dashboard;
