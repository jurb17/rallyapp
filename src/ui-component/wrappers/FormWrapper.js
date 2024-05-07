import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography } from "@material-ui/core";
import { useTheme } from "@emotion/react";

// assets
import { gridSpacing } from "store/constant";

// style constant
const useStyles = makeStyles((theme) => ({
  detailsSection: {
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    alignSelf: "center",
    fontSize: "1.250rem",
    fontWeight: 800,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

// ==============================================================
/* PROPS MAP
sectionTitle: string
children: React.ReactNode
*/

const FormWrapper = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Box spacing={gridSpacing} justifyContent="center">
      <Box
        className={classes.detailsSection}
        style={{
          border: !!props.border
            ? `1px solid ${theme.palette.secondary.main}`
            : "none",
        }}
      >
        <Typography className={classes.sectionTitle}>
          {props.sectionTitle}
        </Typography>
        <Box width="100%">{props.children}</Box>
      </Box>
    </Box>
  );
};

export default FormWrapper;
