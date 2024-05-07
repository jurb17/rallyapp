import React, { useEffect, useRef } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// project imports
import MyInputBase from "./inputs/MyInputBase";

// style constant
const useStyles = makeStyles((theme) => ({
  subtitle: {
    fontWeight: "normal",
    marginTop: "8px",
    marginBottom: "32px",
  },
}));

// =============================================================
/* PROPS MAP
key = key prop for avoiding that one error
formObj = object with form keys and values
*/

const InputBaseForm = (props, { ...others }) => {
  const classes = useStyles();
  const formRef = useRef({});

  const formlength = Object.keys(props.formObj).length;
  let inputwidth = 3;
  // if the length of the form is less than 4, divide 12 by the length of the form for the width of an input
  if (formlength < 4) {
    inputwidth = 12 / formlength;
  }

  let initialValues = {};
  Object.entries(props.formObj).map(([key, value]) => {
    if (!!value) {
      initialValues[key] = value;
    }
    // if there is no value, provide a string
    else {
      initialValues[key] = value;
    }
  });

  return (
    <>
      <Formik initialValues={initialValues} innerRef={formRef}>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <Grid container spacing={2} {...props}>
              {Object.entries(props.formObj).map(([key, value]) => {
                return (
                  <MyInputBase
                    xs={12}
                    sm={inputwidth}
                    formik={formik}
                    key={key}
                    id={key}
                    label={key}
                    value={props.formObj[key] ? props.formObj[key] : "--"}
                    readOnly={true}
                  />
                );
              })}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default InputBaseForm;
