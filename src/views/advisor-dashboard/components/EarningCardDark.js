import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles, propsToClassKey } from "@material-ui/styles";
import { Avatar, Grid, Menu, MenuItem, Typography } from "@material-ui/core";

// project imports
import MainCard from "ui-component/cards/MainCard";
import SkeletonEarningCard from "ui-component/cards/Skeleton/EarningCard";

// assets
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.hint,
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
      background: `linear-gradient(210.04deg, ${theme.palette.background.paper} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
      borderRadius: "50%",
      top: "-30px",
      right: "-180px",
    },
    "&:before": {
      content: '""',
      position: "absolute",
      width: "210px",
      height: "210px",
      background: `linear-gradient(140.9deg, ${theme.palette.background.paper} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
      borderRadius: "50%",
      top: "-160px",
      right: "-130px",
    },
    // "&:after": {
    //   content: '""',
    //   position: "absolute",
    //   width: "210px",
    //   height: "210px",
    //   background: theme.palette.secondary[800],
    //   borderRadius: "50%",
    //   zIndex: 1,
    //   top: "-85px",
    //   right: "-95px",
    //   [theme.breakpoints.down("xs")]: {
    //     top: "-105px",
    //     right: "-140px",
    //   },
    // },
    // "&:before": {
    //   content: '""',
    //   position: "absolute",
    //   width: "210px",
    //   height: "210px",
    //   background: theme.palette.secondary[800],
    //   borderRadius: "50%",
    //   zIndex: 1,
    //   top: "-125px",
    //   right: "-15px",
    //   opacity: 0.5,
    //   [theme.breakpoints.down("xs")]: {
    //     top: "-155px",
    //     right: "-70px",
    //   },
    // },
  },
  content: {
    padding: "16px !important",
  },
  avatar: {
    ...theme.typography.commonAvatar,
    ...theme.typography.largeAvatar,
    backgroundColor: theme.palette.secondary[800],
    marginTop: "8px",
  },
  avatarRight: {
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    backgroundColor: theme.palette.secondary.dark,
    color: theme.palette.secondary[200],
    zIndex: 1,
  },
  cardHeading: {
    fontSize: "2.750rem",
    fontWeight: 500,
    marginRight: "8px",
  },
  subHeading: {
    fontSize: "1rem",
    fontWeight: 500,
    color: theme.palette.secondary.main,
  },
  avatarCircle: {
    cursor: "pointer",
    ...theme.typography.smallAvatar,
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.secondary.dark,
  },
  circleIcon: {
    transform: "rotate3d(1, 1, 1, 45deg)",
  },
  menuItem: {
    marginRight: "14px",
    fontSize: "1.25rem",
  },
}));

//= ==========================|| DASHBOARD DEFAULT - EARNING CARD ||===========================//

const EarningCard = (props, { isLoading }) => {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {isLoading ? (
        <SkeletonEarningCard />
      ) : (
        <MainCard
          border={false}
          className={classes.card}
          contentClass={classes.content}
        >
          <Grid container direction="column">
            <Grid item>
              <Grid container alignItems="center">
                <Grid item>
                  <Typography className={classes.cardHeading}>
                    {props.number}
                  </Typography>
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
              </Grid>
            </Grid>
            <Grid item sx={{ mb: 0.5 }}>
              <Typography className={classes.subHeading}>
                {props.subtitle}
              </Typography>
            </Grid>
          </Grid>
        </MainCard>
      )}
    </>
  );
};

EarningCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default EarningCard;
