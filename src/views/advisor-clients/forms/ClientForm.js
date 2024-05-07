import React, { useEffect } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";
import { clientProfileSchema } from "utils/Validation";

// assets
import { gridSpacing } from "store/constant";
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

const ClientForm = (props) => {
  const classes = useStyles();

  // when there is a change to an input, pass it to the parent profile component
  const handleInputChange = (e) => {
    props.handleClientInputChange(e.target.name, e.target.value);
  };

  return (
    <>
      <Formik
        innerRef={props.forwardedClientFormRef}
        initialValues={props.clientInput}
        validationSchema={clientProfileSchema}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid
              container
              spacing={gridSpacing - 1}
              sx={{ justifyContent: "center" }}
            >
              <MyInputBase
                xs={12}
                sm={6}
                md={4}
                lg={4}
                formik={formik}
                key="firstname"
                name="firstname"
                id="firstname"
                label="First Name"
                value={
                  props.clientInput.firstname ? props.clientInput.firstname : ""
                }
                onChange={(e) => {
                  formik.handleChange(e);
                  handleInputChange(e);
                }}
                onBlur={formik.handleBlur}
                readOnly={!props.editMode}
              />
              <MyInputBase
                xs={12}
                sm={6}
                md={4}
                lg={4}
                formik={formik}
                key="lastname"
                id="lastname"
                name="lastname"
                label="Last Name"
                value={
                  props.clientInput.lastname ? props.clientInput.lastname : ""
                }
                onChange={(e) => {
                  formik.handleChange(e);
                  handleInputChange(e);
                }}
                onBlur={formik.handleBlur}
                readOnly={!props.editMode}
              />
              <MyInputBase
                xs={12}
                sm={6}
                md={4}
                lg={4}
                formik={formik}
                key="name"
                id="name"
                name="name"
                label="Display Name"
                value={props.clientInput.name ? props.clientInput.name : ""}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleInputChange(e);
                }}
                onBlur={formik.handleBlur}
                readOnly={!props.editMode}
                // helpertext="Default is First Name + Last Name"
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default ClientForm;
