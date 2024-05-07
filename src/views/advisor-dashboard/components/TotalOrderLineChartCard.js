import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Avatar, Button, Grid, Typography } from "@material-ui/core";

// third-party
import Chart from "react-apexcharts";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SkeletonTotalOrderCard from "ui-component/cards/Skeleton/EarningCard";

import ChartDataMonth from "../chart-data/total-order-month-line-chart";
import ChartDataYear from "../chart-data/total-order-year-line-chart";

// assets
import LocalMallOutlinedIcon from "@material-ui/icons/LocalMallOutlined";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.primary.dark,
    color: "#fff",
    overflow: "hidden",
    position: "relative",
    "&>div": {
      position: "relative",
      zIndex: 5,
    },
    "&:after": {
      content: '""',
      position: "absolute",
      width: "210px",
      height: "210px",
      background: `linear-gradient(210.04deg, ${theme.palette.primary.light} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
      borderRadius: "50%",
      top: "-30px",
      right: "-180px",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      width: "210px",
      height: "210px",
      background: `linear-gradient(140.9deg, ${theme.palette.primary.light} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
      borderRadius: "50%",
      top: "-160px",
      right: "-130px",
    },
  },
  content: {
    padding: "20px !important",
  },
  avatar: {
    ...theme.typography.commonAvatar,
    ...theme.typography.largeAvatar,
    backgroundColor: theme.palette.primary[800],
    color: "#fff",
    marginTop: "8px",
  },
  cardHeading: {
    fontSize: "2.750rem",
    fontWeight: 500,
    marginRight: "8px",
    // marginTop: "14px",
    marginBottom: "6px",
  },
  subHeading: {
    fontSize: "1rem",
    fontWeight: 500,
    color: theme.palette.primary.light,
  },
  avatarCircle: {
    ...theme.typography.smallAvatar,
    cursor: "pointer",
    backgroundColor: theme.palette.light,
    color: theme.palette.primary.dark,
  },
  circleIcon: {
    transform: "rotate3d(1, 1, 1, 45deg)",
  },
}));

// ===========================|| DASHBOARD - TOTAL ORDER LINE CHART CARD ||=========================== //

const TotalOrderLineChartCard = (props, { isLoading }) => {
  const classes = useStyles();

  const [timeValue, setTimeValue] = React.useState("week");
  const handleChangeTime = (event, newValue) => {
    setTimeValue(newValue);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonTotalOrderCard />
      ) : (
        <MainCard
          border={false}
          className={classes.card}
          contentClass={classes.content}
        >
          <Grid container direction="column">
            <Grid item>
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Grid container alignItems="center">
                    <Grid item>
                      {timeValue === "week" ? (
                        <Typography className={classes.cardHeading}>
                          78
                        </Typography>
                      ) : timeValue === "month" ? (
                        <Typography className={classes.cardHeading}>
                          340
                        </Typography>
                      ) : (
                        <Typography className={classes.cardHeading}>
                          1780
                        </Typography>
                      )}
                    </Grid>
                    <Grid item>
                      {props.trending === "up" ? (
                        <Avatar className={classes.avatarCircle}>
                          <ArrowUpwardIcon
                            fontSize="inherit"
                            className={classes.circleIcon}
                          />
                        </Avatar>
                      ) : props.trending === "down" ? (
                        <Avatar className={classes.avatarCircle}>
                          <ArrowUpwardIcon
                            fontSize="inherit"
                            className={classes.circleIcon}
                          />
                        </Avatar>
                      ) : (
                        <p></p>
                      )}
                    </Grid>
                    <Grid item xs={12} sx={{ mb: 1.25 }}>
                      <Typography className={classes.subHeading}>
                        Profile Views
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                {/* <Grid item xs={6}>
                  {timeValue ? (
                    <Chart {...ChartDataMonth} />
                  ) : (
                    <Chart {...ChartDataYear} />
                  )}
                </Grid> */}
                <Grid item xs={8}>
                  <Grid container justifyContent="flex-end">
                    <Grid item>
                      <Button
                        disableElevation
                        variant={timeValue === "week" ? "contained" : "string"}
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={(e) => handleChangeTime(e, "week")}
                      >
                        Week
                      </Button>
                      <Button
                        disableElevation
                        variant={timeValue === "month" ? "contained" : "string"}
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={(e) => handleChangeTime(e, "month")}
                      >
                        Month
                      </Button>
                      <Button
                        disableElevation
                        variant={timeValue === "year" ? "contained" : "string"}
                        size="small"
                        sx={{ mr: 1 }}
                        onClick={(e) => handleChangeTime(e, "year")}
                      >
                        Year
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

TotalOrderLineChartCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default TotalOrderLineChartCard;
