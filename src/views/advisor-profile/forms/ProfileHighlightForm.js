import React from "react";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid, InputAdornment, IconButton } from "@material-ui/core";
import { IconCopy } from "@tabler/icons";

// third party
import { Formik } from "formik";
import * as Yup from "yup";

// project imports
import { gridSpacing } from "store/constant";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import { showSnackbar } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({}));

//==============================================================

const ProfileHighlightForm = (props, { ...others }) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  return (
    <>
      <Formik
        initialValues={props.profile}
        innerRef={props.forwardedProfileHighlightFormRef}
        validationSchema={Yup.object().shape({
          bio: Yup.string().required("Bio is required"),
        })}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              <MyTextInput
                xs={12}
                formik={formik}
                key="slug"
                id="slug"
                name="slug"
                label="Rally Profile Link"
                value={
                  props.profile.slug
                    ? `https://rally.markets/firm/${props.profile.slug}`
                    : "not available"
                }
                helpertext="Copy this link to share your public profile page."
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="copy link to clipboard"
                      onClick={() => {
                        const copytext = `https://rally.markets/firm/${props.profile.slug}`;
                        navigator.clipboard.writeText(copytext);
                        dispatch(
                          showSnackbar(
                            "Text copied to clipboard",
                            true,
                            "success"
                          )
                        );
                      }}
                      edge="end"
                    >
                      <IconCopy />
                    </IconButton>
                  </InputAdornment>
                }
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ProfileHighlightForm;
