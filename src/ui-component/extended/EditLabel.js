import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography } from "@material-ui/core";
import { IconEdit } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(0.25),
    marginTop: theme.spacing(0.5),
    marginLeft: theme.spacing(0.5),
    display: "flex",
    alignItems: "center",
    borderRadius: theme.spacing(3),
    // backgroundColor: theme.palette.error.main,
    border: `2px solid ${theme.palette.error.main}`,
    color: theme.palette.error.main,
  },
  textStyle: {
    fontSize: "1.0rem",
    fontWeight: "bold",
    marginRight: theme.spacing(1),
  },
  iconStyle: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

// =============================================

const EditLabel = (props) => {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex", flexShrink: 1 }}>
      <Box className={classes.container}>
        <IconEdit className={classes.iconStyle} />
        <Typography className={classes.textStyle}>Editing</Typography>
      </Box>
    </Box>
  );
};

export default EditLabel;
