import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Box,
  Grid,
  IconButton,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { useTheme } from "@emotion/react";

// local imports
import { IconInfoCircle } from "@tabler/icons";
import HtmlTip from "ui-component/extended/HtmlTip";
import CustomButtonGroup from "ui-component/buttons/CustomButtonGroup";
import EditLabel from "ui-component/extended/EditLabel";
import HtmlTipButton from "ui-component/extended/HtmlTipButton";
import BackButton from "ui-component/buttons/BackButton";

// style constant
const useStyles = makeStyles((theme) => ({
  secondSection: {
    borderTop: `1px solid ${theme.palette.primary.dark}`,
  },
  subsectionTitle: {
    fontSize: "1.250rem",
    fontWeight: 500,
  },
}));

// ==============================================================
/* PROPS MAP
border = boolean to set border on top of section
title = string for title of subsection
titleStyle = object for title styling
tipBody = string for body of tooltip
tipHeading = string for heading of tooltip
editMode = boolean to determine if in edit mode
buttonlist = array of objects with button names and functions
children = React.ReactNode
*/

const SubsectionWrapper = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
      <Grid
        container
        className={!!props.border ? classes.secondSection : null}
        display="flex"
        direction="row"
        width={1}
        mb={props.mb ? props.mb : 0}
        mt={props.mt ? props.mt : 0}
        ml={props.ml ? props.ml : 0}
        mr={props.mr ? props.mr : 0}
        pb={props.pb ? props.pb : 0}
        pt={props.pt ? props.pt : 0}
        pl={props.pl ? props.pl : 0}
        pr={props.pr ? props.pr : 0}
      >
        <Box
          display="flex"
          direction="row"
          alignItems="center"
          flexGrow={1}
          mb={0.5}
          mt={0.5}
        >
          {!!props.backButton && (
            <BackButton
              backlink={props.backlink ? props.backlink : ""}
              handleBack={props.handleBack ? props.handleBack : null}
            />
          )}
          <Typography variant="h3" style={props.titleStyle}>
            {props.title}
          </Typography>
          {(props.tipBody || props.tipHeading) && !matchDownSM && (
            <HtmlTip heading={props.tipHeading} body={props.tipBody}>
              <IconButton size="small">
                <IconInfoCircle />
              </IconButton>
            </HtmlTip>
          )}
          {matchDownSM && (
            <HtmlTipButton
              body={
                <>
                  <Typography variant="h4">{props.tipHeading}</Typography>
                  <Typography> {props.tipBody} </Typography>
                </>
              }
            />
          )}
          {!!props.editMode && <EditLabel />}{" "}
        </Box>
        {!!props.buttonlist && (
          <CustomButtonGroup buttonlist={props.buttonlist} />
        )}
      </Grid>
      <Grid
        container
        width={1}
        display="flex"
        direction="row"
        sx={{ p: 0, mb: 0.5 }}
      >
        <Grid item xs={12}>
          {props.children}
        </Grid>
      </Grid>
    </>
  );
};

export default SubsectionWrapper;
