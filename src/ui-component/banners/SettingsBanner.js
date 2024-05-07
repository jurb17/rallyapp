import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Divider, Typography } from "@material-ui/core";
import {
  IconAlertTriangle,
  IconFileAlert,
  IconFileSearch,
  IconFileCheck,
} from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  bannerStyle: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    color: theme.palette.text.primary,
    justifyContent: "space-between",
    alignItems: "center",
  },
  iconStyle: {
    marginRight: "16px",
    marginLeft: "8px",
  },
  pending: {
    color: theme.palette.primary.main,
  },
  error: {
    color: theme.palette.error.main,
  },
  required: {
    color: theme.palette.secondary.main,
  },
  complete: {
    color: theme.palette.grey[800],
  },
  childrenStyle: {
    marginTop: "8px",
    display: "flex",
    justifyContent: "start",
  },
}));

// ============================================================

const SettingsBanner = (props, { children }) => {
  const classes = useStyles();
  const theme = useTheme();

  let backgroundColor = null;
  switch (props.status) {
    case "pending": // light gray
      backgroundColor = theme.palette.grey[300];
      break;
    case "error": // light red
      backgroundColor = theme.palette.error.light;
      break;
    case "required": // light yellow
      backgroundColor = theme.palette.warning.light;
      break;
    case "complete": // white
      backgroundColor = theme.palette.background.paper;
      break;
    default:
      // white
      backgroundColor = theme.palette.background.paper;
      break;
  }

  return (
    <Box
      className={classes.bannerStyle}
      style={{
        backgroundColor: backgroundColor,
        border: `1px solid ${theme.palette.grey[300]}`,
      }}
    >
      {" "}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box className={classes.iconStyle} sx={{ flexShrink: 0 }}>
          {props.status === "required" && (
            <IconFileAlert className={classes.required} />
          )}
          {props.status === "error" && (
            <IconAlertTriangle className={classes.error} />
          )}
          {props.status === "pending" && (
            <IconFileSearch className={classes.pending} />
          )}
          {props.status === "complete" && (
            <IconFileCheck className={classes.complete} />
          )}
        </Box>
        <Box sx={{ flexShrink: 1 }}>
          <Typography variant="body1">{props.message}</Typography>
        </Box>
      </Box>
      {!!props.children && (
        <Divider
          sx={{ marginTop: "12px", borderColor: theme.palette.grey[300] }}
        />
      )}
      <Box className={!!props.children ? classes.childrenStyle : ""}>
        {props.children}
      </Box>
    </Box>
  );
};

export default SettingsBanner;
