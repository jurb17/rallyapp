import React, { useState } from "react";

// material-ui
import { Grid } from "@material-ui/core";

// third party
// import { invoiceProfileSchema } from "utils/Validation";
import { Formik } from "formik";

// assets
import { gridSpacing } from "store/constant";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";

// ==============================================================

const InvoiceForm = (props) => {
  return (
    <>
      <Formik>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={gridSpacing}>
              <MyTextInput
                xs={12}
                sm={12}
                formik={formik}
                key="advisorname"
                id="advisorname"
                description="advisorname"
                label="Advisor Name"
                value={props.invoiceInput.advisorname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                readOnly={true}
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default InvoiceForm;
