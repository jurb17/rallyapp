import React, { useEffect } from "react";

// material-ui
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// project imports
import { gridSpacing } from "store/constant";
import MyInputBase from "ui-component/forms/inputs/MyInputBase";

//= =============================================================

const AccountInfoForm = (props, { ...others }) => {
  // we are not going to handle changes to this form,
  // because we will have to internally verify changes to this information.
  let formattedRegistered;
  if (!!props.profile.registered && props.profile.registered !== "None") {
    formattedRegistered = new Date(
      parseInt(props.profile.registered * 1000)
    ).toLocaleDateString("en-US");
  } else {
    formattedRegistered = "";
  }

  // reformat YYYY-MM-DD to MM/DD/YYYY
  let formattedBirthday;
  if (!!props.profile.birthday && props.profile.birthday !== "None") {
    let dateObj = new Date(props.profile.birthday + "T00:00:00");
    formattedBirthday = new Intl.DateTimeFormat("en-US").format(dateObj);
  } else {
    formattedBirthday = "";
  }

  return (
    <>
      <Formik initialValues={props.profile}>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              <MyInputBase
                xs={12}
                sm={4}
                md={3}
                formik={formik}
                key="firstname"
                id="firstname"
                name="firstname"
                label="First Name"
                value={props.profile.firstname ? props.profile.firstname : ""}
              />
              <MyInputBase
                xs={12}
                sm={4}
                md={3}
                formik={formik}
                key="lastname"
                id="lastname"
                name="lastname"
                label="Last Name"
                value={props.profile.lastname ? props.profile.lastname : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={4}
                md={3}
                key="birthday"
                id="birthday"
                name="birthday"
                label="Birthday"
                value={formattedBirthday}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={4}
                md={3}
                key="registered"
                id="registered"
                name="registered"
                label="Registered"
                value={formattedRegistered}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={4}
                md={3}
                key="city"
                id="city"
                name="city"
                label="City"
                value={props.profile.city ? props.profile.city : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={4}
                md={3}
                key="state"
                id="state"
                name="state"
                label="State"
                value={
                  props.profile.state ? props.profile.state.toUpperCase() : ""
                }
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                md={4}
                key="email"
                id="email"
                name="email"
                label="Email"
                value={props.profile.email ? props.profile.email : ""}
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AccountInfoForm;
