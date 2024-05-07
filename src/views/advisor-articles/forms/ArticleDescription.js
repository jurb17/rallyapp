import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// local imports
import MyInputBase from "ui-component/forms/inputs/MyInputBase";

// third party imports
import { Formik } from "formik";
import * as yup from "yup";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ===============================================================
/* PROPS MAP
description = description of article
*/

const ArticleDescriptionForm = (props) => {
  const classes = useStyles();

  return (
    <>
      <Formik>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid
              container
              direction="row"
              alignItems="center"
              justifyContent="right"
              mt={!!props.category ? 3 : 0}
            >
              <MyInputBase
                xs={12}
                id="description"
                name="description"
                formik={formik}
                label="Article Description"
                value={props.description}
                multiline={true}
                minRows={2}
                maxRows={6}
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ArticleDescriptionForm;
