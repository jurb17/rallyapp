import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography } from "@material-ui/core";
import { IconEdit } from "@tabler/icons";
import DynamicButton from "ui-component/buttons/DynamicButton";

// style constant
const useStyles = makeStyles((theme) => ({
  mainBox: {
    width: "100%",
    height: "48px",
    padding: "0 16px",
    backgroundColor: theme.palette.grey[300],
    alignItems: "center",
    display: "flex",
  },
  iconStyle: {
    color: theme.palette.text.primary,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  titleBox: {
    display: "flex",
    alignItems: "center",
    alignSelf: "center",
    flexGrow: 1,
  },
}));

// ============================================================
// PROPS MAP
// title = string (optional)
// children = string (required)

const EditBanner = (props, { children }) => {
  const classes = useStyles();

  return (
    <Box className={classes.mainBox}>
      <Box className={classes.titleBox}>
        <IconEdit className={classes.iconStyle} />
        <Typography variant="h4" sx={{ mt: 0.5 }}>
          {props.text}
        </Typography>
      </Box>
      <Box sx={{ display: "flex" }}>{props.children}</Box>
    </Box>
  );
};
export default EditBanner;
