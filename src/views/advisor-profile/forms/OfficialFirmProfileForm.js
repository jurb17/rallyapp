import React, { useEffect } from "react";

// material-ui
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// project imports
import { gridSpacing } from "store/constant";
import MyInputBase from "ui-component/forms/inputs/MyInputBase";

//===============================================================

const OfficialFirmProfileForm = (props, { ...others }) => {
  // we are not going to handle changes to this form, because we will have to internally verify changes to this information.'

  const initialValues = {
    address: "",
    city: "",
    state: "",
    phonenumber: "",
    jurisdictions: "",
    crdnumber: "",
    website: "",
  };

  const [jurisdictions, setJurisdictions] = React.useState([]);

  // reformat jurisdictions
  const reformatJurisdictions = (data) => {
    let newList = [];
    if (data) {
      data.forEach((item) => {
        return newList.push(item.toUpperCase());
      });
    }
    setJurisdictions(newList);
  };
  useEffect(() => {
    reformatJurisdictions(props.profile.jurisdictions);
  }, [props.profile.jurisdictions]);

  return (
    <>
      <Formik initialValues={initialValues}>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              <MyInputBase
                xs={12}
                sm={6}
                formik={formik}
                key="name"
                id="name"
                name="name"
                label="Name"
                value={props.profile.name ? props.profile.name : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                id="phonenumber"
                name="phonenumber"
                label="Phone Number"
                value={
                  props.profile.phonenumber ? props.profile.phonenumber : ""
                }
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                id="address"
                name="address"
                label="Address"
                value={props.profile.address ? props.profile.address : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                id="city"
                name="city"
                label="City"
                value={props.profile.city ? props.profile.city : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
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
                id="website"
                name="website"
                label="Firm Website"
                value={props.profile.website ? props.profile.website : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                id="crdnumber"
                name="crdnumber"
                label="CRD #"
                value={props.profile.crdnumber ? props.profile.crdnumber : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                id="jurisdictions"
                name="jurisdictions"
                label="State Jurisdictions"
                value={jurisdictions ? jurisdictions.join(", ") : ""}
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

export default OfficialFirmProfileForm;
