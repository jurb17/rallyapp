import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid, Box, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  center: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

// =====================================================

const PagePlaceholderText = (props) => {
  const classes = useStyles();

  return (
    <Grid
      item
      lg={6}
      md={8}
      sm={10}
      xs={12}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      <Box className={classes.center}>
        <Typography variant="h5">
          <em>{props.text}</em>
        </Typography>
      </Box>
    </Grid>
  );
};

export default PagePlaceholderText;
