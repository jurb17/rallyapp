import React, { useEffect } from "react";

// material-ui
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// project imports
import { gridSpacing } from "store/constant";
import MyInputBase from "ui-component/forms/inputs/MyInputBase";

//= =============================================================

const OfficialAdvisorProfileForm = (props, { ...others }) => {
  // we are not going to handle changes to this form,
  // because we will have to internally verify changes to this information.

  const initialValues = {
    certs: [],
    crdnumber: "",
  };

  const [certifications, setCertifications] = React.useState([]);

  // reformat certifications
  const reformatJurisdictions = (data) => {
    let newList = [];
    if (data) {
      data.forEach((item) => {
        return newList.push(item.toUpperCase());
      });
    }
    setCertifications(newList);
  };
  useEffect(() => {
    reformatJurisdictions(props.profile.certs);
  }, [props.profile.certs]);

  return (
    <>
      <Formik initialValues={props.profile}>
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
                id="crdnumber"
                name="crdnumber"
                label="CRD #"
                value={props.profile.crdnumber ? props.profile.crdnumber : ""}
              />
              <MyInputBase
                formik={formik}
                xs={12}
                sm={6}
                id="certifications"
                name="certifications"
                label="Certifications"
                value={certifications ? certifications.join(", ") : ""}
              />
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default OfficialAdvisorProfileForm;
