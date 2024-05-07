import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography, Grid } from "@material-ui/core";
import { IconUser, IconUserExclamation } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  bannerStyle: {
    display: "flex",
    padding: theme.spacing(2),
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(1),
    borderRadius: "12px",
    border: `1px dashed ${theme.palette.primary.main}`,
    color: theme.palette.text.primary,
    justifyContent: "start",
    alignItems: "center",
  },
  iconStyle: {
    color: theme.palette.primary.main,
    marginRight: "16px",
    marginLeft: "8px",
  },
  messageStyle: {
    color: theme.palette.text.primary,
    fontSize: "0.875rem",
    lineHeight: "1.5",
  },
  noteStyle: {
    color: theme.palette.text.primary,
    fontSize: "1.0rem",
    fontWeight: 800,
    marginRight: theme.spacing(2),
  },
}));

// ============================================================
// PROPS MAP
// title = string (optional)
// children = string (required)

const NoteBanner = (props, { children }) => {
  const classes = useStyles();

  return (
    <Grid
      item
      xs={12}
      className={classes.bannerStyle}
      style={{ maxWidth: props.maxwidth ? props.maxwidth : "100%" }}
    >
      {" "}
      <Box sx={{ flexShrink: 0 }}>
        {/* <IconUserExclamation className={classes.iconStyle} /> */}
        <Typography className={classes.noteStyle}>
          <em>{props.title ? props.title : "Note"}:</em>
        </Typography>
      </Box>
      <Box sx={{ flexGrow: 1 }}>
        <Typography className={classes.messageStyle}>
          {props.children}
        </Typography>
      </Box>
    </Grid>
  );
};

export default NoteBanner;
