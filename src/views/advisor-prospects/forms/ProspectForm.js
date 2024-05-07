import React, { useEffect } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";
// import { prospectProfileSchema } from "utils/Validation";

// assets
import { gridSpacing } from "store/constant";
import { mapStateName } from "utils/DataMapFunctions";
import MyInputBase from "ui-component/forms/inputs/MyInputBase";

// style constant
const useStyles = makeStyles((theme) => ({
  labelText: {
    color: theme.palette.grey["800"],
  },
  valueText: {
    marginTop: "12px",
  },
}));

// ==============================================================

const ProspectForm = (props) => {
  const classes = useStyles();

  return (
    <>
      <Formik
        innerRef={props.forwardedProspectFormRef}
        initialValues={props.prospectInput}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={2}>
              <MyInputBase
                xs={12}
                sm={4}
                formik={formik}
                key="name"
                id="name"
                name="name"
                label="Name"
                value={props.prospectInput.name ? props.prospectInput.name : ""}
              />
              {/* <MyTextInput
                xs={12}
                sm={4}
                formik={formik}
                key="city"
                id="city"
                name="city"
                label="City"
                value={
                  props.prospectInput.city
                    ? capitalizeFirst(props.prospectInput.city)
                    : ""
                }
                onBlur={formik.handleBlur}
                readOnly={!props.editMode}
              /> */}
              <MyInputBase
                xs={12}
                sm={4}
                formik={formik}
                key="state"
                id="state"
                name="state"
                label="State"
                value={
                  props.prospectInput.state
                    ? mapStateName(props.prospectInput.state)
                    : ""
                }
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ProspectForm;
