import React, { useRef } from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Typography } from "@material-ui/core";

// style constant
const useStyles = makeStyles((theme) => ({
  container: {
    border: `1px solid ${theme.palette.grey[300]}`,
    padding: "4px 8px",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.spacing(1),
  },
  textStyle: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
}));

// ====================================================
/* PROPS MAP
text: string for label text
textStyle: css class for text
*/

const CustomLabel = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const boxRef = useRef(null);

  let backColor = "";
  let textColor = "";
  switch (props.text) {
    case "open":
      backColor = theme.palette.background.paper; // white
      textColor = theme.palette.grey[900]; // black
      break;
    case "complete":
      backColor = theme.palette.success.main; // green
      textColor = theme.palette.background.paper; // white
      break;
    case "declined":
      backColor = theme.palette.warning.main; // yellow
      textColor = theme.palette.grey[900]; // white
      break;
    case "disputed":
      backColor = theme.palette.orange.main; // orange
      textColor = theme.palette.background.paper; // white
      break;
    case "refunded":
      backColor = theme.palette.error.main; // red
      textColor = theme.palette.background.paper; // white
      break;
    case "cancelled":
      backColor = theme.palette.grey[600]; // grey
      textColor = theme.palette.background.paper; // white
      break;
    default:
      backColor = "#ffffff";
  }

  return (
    <Box
      className={classes.container}
      style={{ backgroundColor: `${backColor}`, color: `${textColor}` }}
    >
      <Typography
        sx={props.textStyle ? { ...props.textStyle } : { ...classes.textStyle }}
      >
        {props.text}
      </Typography>
    </Box>
  );
};

export default CustomLabel;
