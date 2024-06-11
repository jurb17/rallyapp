import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Typography } from "@material-ui/core";

// project imports
import { IconShieldX } from "@tabler/icons";
import DynamicButton from "ui-component/buttons/DynamicButton";

// style constant
const useStyles = makeStyles((theme) => ({
  reportBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    outline: `1px solid ${theme.palette.grey[900]}`,
    borderRadius: theme.spacing(0.5),
    marginTop: theme.spacing(1),
    padding: theme.spacing(1),
    spacing: theme.spacing(1),
  },
}));

// ============================================================
/* PROPS MAP
header = string to display in header
message = string to display in message
handleClick = function to handle click
*/

const ReportAbuseCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <Box className={classes.reportBox}>
        <Box className="horizontal-center">
          <IconShieldX
            size={"54px"}
            stroke={1.25}
            color={theme.palette.grey[900]}
          />
        </Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            mt: 1,
            mb: 1,
          }}
        >
          {props.header ? props.header : "Report Abuse"}
        </Typography>
        <Typography variant="body1" sx={{ textAlign: "center", mb: 1 }}>
          {props.message
            ? props.message
            : "Please report any activity that may violate our Terms of Service."}
        </Typography>
        <Box className="horizontal-center" sx={{ mt: 1, mb: 1 }}>
          <DynamicButton
            name="Report Abuse"
            color="error"
            variant="outlined"
            onClick={props.handleClick}
          />
        </Box>
      </Box>
    </>
  );
};

export default ReportAbuseCard;
