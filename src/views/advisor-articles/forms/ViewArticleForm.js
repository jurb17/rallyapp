import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// third party imports
import { Formik } from "formik";
import * as yup from "yup";

// local imports
import MyTextInput from "ui-component/forms/inputs/MyTextInput";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ===============================================================
/* PROPS MAP
title = string to display as title
handleTitleChange = function to call when title changes
titleReadOnly = boolean to determine if title is read only
*/

const ViewArticleForm = (props) => {
  const classes = useStyles();

  return (
    <>
      <Formik
        initialValues={{ title: props.title }}
        validationSchema={yup.object().shape({
          title: yup.string().max(100, "Title must be 100 characters or less."),
        })}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="space-around"
              sx={{ mt: 0, mb: 1.5 }}
            >
              <MyTextInput
                xs={12}
                formik={formik}
                id="title"
                name="title"
                label="Title"
                value={props.title}
                onChange={(e) => {
                  formik.handleChange(e);
                  props.handleTitleChange(e.target.value);
                }}
                readOnly={props.titleReadOnly}
                helpertext={
                  props.titleReadOnly
                    ? "The title cannot be edited at this time."
                    : ""
                }
                multiline={true}
                minRows={1}
                maxRows={4}
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ViewArticleForm;
