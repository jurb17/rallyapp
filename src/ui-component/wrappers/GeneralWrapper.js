import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";

// project import
import MainCard from "ui-component/cards/MainCard";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    "& > *": {
      flexGrow: 1,
      flexBasis: "50%",
    },
    Height: "100%",
    [theme.breakpoints.down("sm")]: {
      margin: "20px",
    },
    [theme.breakpoints.down("lg")]: {
      maxWidth: "400px",
    },
  },
  content: {
    padding: `${theme.spacing(5)} !important`,
    [theme.breakpoints.down("lg")]: {
      padding: `${theme.spacing(3)} !important`,
    },
  },
}));

// ===========================|| AUTHENTICATION CARD WRAPPER ||=========================== //

const GeneralWrapper = ({ children, ...other }) => {
  const classes = useStyles();

  return (
    <MainCard
      className={classes.card}
      contentClass={classes.content}
      {...other}
    >
      {children}
    </MainCard>
  );
};

GeneralWrapper.propTypes = {
  children: PropTypes.node,
};

export default GeneralWrapper;
