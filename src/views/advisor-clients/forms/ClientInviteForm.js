import React, { useEffect } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";
import { IconSend } from "@tabler/icons";

// third party
import { Formik } from "formik";
import * as Yup from "yup";

// assets
import { gridSpacing } from "store/constant";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import DynamicButton from "ui-component/buttons/DynamicButton";

// style constant
const useStyles = makeStyles((theme) => ({
  labelText: {
    color: theme.palette.grey["800"],
  },
  valueText: {
    marginTop: "12px",
  },
}));

//= ============================================================

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
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .matches(
              /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/,
              "Must be a valid email address"
            )
            .max(255, "Email must be less than 255 characters")
            .required("Email is required"),
        })}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid
              container
              spacing={gridSpacing - 1}
              sx={{ justifyContent: "center" }}
            >
              <MyTextInput
                xs={12}
                sm={8}
                md={6}
                lg={5}
                formik={formik}
                key="email"
                id="email"
                name="email"
                label="Email"
                value={props.clientInput.email ? props.clientInput.email : ""}
                onChange={(e) => {
                  formik.handleChange(e);
                  handleInputChange(e);
                }}
                onBlur={formik.handleBlur}
                readOnly={!props.editMode}
              />
            </Grid>
          </form>
        )}
      </Formik>

      {/* Button Area */}
      <Grid container sx={{ justifyContent: "center" }}>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={5}
          sx={{ display: "flex", justifyContent: "end", mt: 1.5 }}
        >
          <DynamicButton
            name="Submit"
            color="secondary"
            variant="contained"
            startIcon={<IconSend stroke={1.25} />}
            disabled={!props.clientInput.email}
            onClick={(e) => {
              props.handleRequest();
            }}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default ClientForm;
