import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// local imports
import MyTextInput from "ui-component/forms/inputs/MyTextInput";

// third party imports
import { Formik } from "formik";
import * as yup from "yup";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ===============================================================
/* PROPS MAP
forwardedArticleDescriptionFormRef = ref to Formik
description = description of article
handleDescriptionInputChange = function to handle description input change
*/

const ArticleDescriptionForm = (props) => {
  const classes = useStyles();

  return (
    <>
      <Formik
        innerRef={props.forwardedArticleDescriptionFormRef}
        initialValues={{ description: props.description }}
        validationSchema={yup.object().shape({
          description: yup
            .string()
            .required("Description is required")
            .max(255, "Description must be 255 characters or less."),
        })}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="right"
              mt={!!props.category ? 3 : 0}
            >
              <MyTextInput
                xs={12}
                id="description"
                name="description"
                formik={formik}
                label="Article Description"
                placeholder="Please add a description to your article"
                onChange={(e) => {
                  formik.handleChange(e);
                  props.handleDescriptionInputChange(e.target.value);
                }}
                multiline={true}
                minRows={2}
                maxRows={2}
                helpertext={
                  "Note: This description will be displayed on the article card."
                }
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ArticleDescriptionForm;
