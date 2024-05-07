import React from "react";

// material-ui
import { makeStyles, styled } from "@material-ui/styles";
import { Typography } from "@material-ui/core";
import Tooltip, { tooltipClasses } from "@material-ui/core/Tooltip";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ============================================================

const HtmlTip = (props) => {
  const classes = useStyles();

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.grey[100],
      color: theme.palette.grey[800],
      maxWidth: 220,
      fontSize: theme.typography.pxToRem(14),
      border: `1px solid ${theme.palette.grey[300]}`,
    },
  }));

  return (
    <HtmlTooltip
      title={
        <React.Fragment>
          <Typography color="inherit">{props.heading}</Typography>
          {props.body}
          {/* <em>{"And here's"}</em> <b>{"some"}</b> <u>{"amazing content"}</u>.{" "}
          {"It's very engaging. Right?"} */}
        </React.Fragment>
      }
    >
      {props.children}
    </HtmlTooltip>
  );
};

export default HtmlTip;
