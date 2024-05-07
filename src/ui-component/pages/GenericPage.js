import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Grid, Typography, useMediaQuery } from "@material-ui/core";

// project imports
import BackButton from "ui-component/buttons/BackButton";
import CustomButtonGroup from "ui-component/buttons/CustomButtonGroup";

// style constant
const useStyles = makeStyles((theme) => ({
  hrule: {
    border: `1px solid ${theme.palette.primary.main}`,
  },
  mainBox: {
    width: "85%", // width of the main content window
    margin: "0 auto",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  headerBox: {
    display: "flex",
    width: "100%",
    direction: "row",
    flexWrap: "wrap",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.75rem",
    },
  },
  titleBox: {
    display: "flex",
    alignSelf: "center",
    flexGrow: 1,
    alignItems: "center",
  },
  buttonBox: {
    display: "flex",
    alignSelf: "center",
    flexGrow: 0,
    [theme.breakpoints.down("sm")]: {
      marginTop: "0.5rem",
    },
  },
}));

// ============================================================
/* PROPS MAP
pageHeader = string to display as header
backlink = string defining a path to return to.
handleBack = function to call when back button is clicked.
pageHeaderLabel = string to display as header label
noHrule = boolean to hide hrule
buttonlist = array of objects with button names and functions
*/

const GenericPage = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box className={classes.mainBox}>
      <Box container className={classes.headerBox}>
        <BackButton
          backlink={props.backlink ? props.backlink : ""}
          handleBack={props.handleBack ? props.handleBack : null}
        />
        <Box className={classes.titleBox}>
          {!!props.pageHeader && ( // if profile header is less than 30 characters, display complete header text
            <Typography fontSize={"1.75rem"} style={props.headerStyle}>
              {props.pageHeader.length < 42
                ? props.pageHeader
                : props.pageHeader.substring(0, 41) + "..."}
            </Typography>
          )}
        </Box>
        {/* {!matchDownSM ? ( */}
        <Box className={classes.buttonBox}>
          {!!props.buttonlist && (
            <CustomButtonGroup buttonlist={props.buttonlist} />
          )}
        </Box>
        {/* ) : (
          <BasicMenuIconButton items={props.buttonlist} />
        )} */}
      </Box>
      <Box mb={1.5}>
        {!props.noHrule ? <hr className={classes.hrule} margin="0px" /> : null}
      </Box>
      <Grid container display="flex" direction="row" sx={{ p: 0, mb: 0.5 }}>
        <Grid item xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </Box>
  );
};

export default GenericPage;
