import React from "react";

// material-ui
import { Grid, InputAdornment } from "@material-ui/core";

// third party
import { Formik } from "formik";
import * as yup from "yup";

// assets
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import MyInputBase from "ui-component/forms/inputs/MyInputBase";
import MyNumberInput from "ui-component/forms/inputs/MyNumberInput";

// =============================================================

const ServiceForm = (props) => {
  //handle title change
  const handleTitleChange = (e) => {
    props.handleTitleInputChange(e.target.value);
  };
  // handle description change
  const handleDescriptionChange = (e) => {
    props.handleDescriptionInputChange(e.target.value);
  };
  // handle price change
  const handlePriceChange = (e) => {
    props.handlePriceInputChange(e.target.value);
  };

  // display the modal, should the user be in the mode of creating a new custom field. Display the service and custom fields regardless.
  return (
    <>
      <Grid item xs={12}>
        <Formik
          innerRef={props.forwardedServiceFormRef}
          initialValues={props.serviceInput}
          validationSchema={yup.object({
            title: yup
              .string()
              .min(1, "Name must be at least 1 character.")
              .max(100, "Name must be less than 100 characters.")
              .required("Name is required.")
              .matches(/^(?!\s+$).*/, "Name cannot be blank."),
            description: yup
              .string()
              .required("Description is required.")
              .min(1, "Description must be at least 1 character.")
              .max(255, "Description has a max of 255 characters.")
              .matches(/^(?!\s+$).*/, "Description cannot be blank."),
            price: yup
              .number("Price must be a number.")
              .min(0, "Price must be greater than or equal to 0.")
              .max(1000000, "Price must be less than or equal to 1,000,000."),
          })}
        >
          {(formik) => (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {!!props.editMode ? (
                  <MyTextInput
                    xs={12}
                    formik={formik}
                    id="title"
                    name="title"
                    label="Service Name"
                    value={props.serviceInput.title}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleTitleChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    readOnly={!props.editMode}
                    multiline={true}
                    minRows={1}
                    maxRows={4}
                  />
                ) : (
                  <MyInputBase
                    xs={12}
                    formik={formik}
                    id="title"
                    name="title"
                    label="Service Name"
                    value={props.serviceInput.title}
                    multiline={true}
                    minRows={1}
                    maxRows={4}
                  />
                )}
                {props.editMode ? (
                  <MyTextInput
                    xs={12}
                    formik={formik}
                    id="description"
                    name="description"
                    label="Service Description"
                    value={props.serviceInput.description}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleDescriptionChange(e);
                    }}
                    onBlur={formik.handleBlur}
                    readOnly={!props.editMode}
                    multiline={true}
                    minRows={2}
                    maxRows={8}
                    helpertext={
                      "Note: This description will be displayed on the article card."
                    }
                  />
                ) : (
                  <MyInputBase
                    xs={12}
                    formik={formik}
                    id="description"
                    name="description"
                    label="Service Description"
                    value={props.serviceInput.description}
                    multiline={true}
                    minRows={1}
                    maxRows={6}
                    helpertext={
                      "Note: This description will be displayed on the article card."
                    }
                  />
                )}
                {!!props.editMode ? (
                  <MyNumberInput
                    sm={12}
                    md={4}
                    lg={3}
                    formik={formik}
                    id="price"
                    name="price"
                    label="Service Price (Optional)"
                    value={props.serviceInput.price}
                    onChange={(e) => {
                      console.log(e);
                      if (["e", "E", "+", "-"].includes(e.nativeEvent.data))
                        e.preventDefault();
                      else {
                        formik.handleChange(e);
                        handlePriceChange(e);
                      }
                    }}
                    onKeyPress={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key))
                        e.preventDefault();
                    }}
                    onBlur={formik.handleBlur}
                    readOnly={!props.editMode}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                ) : (
                  <MyInputBase
                    xs={12}
                    formik={formik}
                    id="price"
                    name="price"
                    label="Service Price"
                    value={props.serviceInput.price}
                    startAdornment={
                      <InputAdornment position="start">$</InputAdornment>
                    }
                  />
                )}
              </Grid>
            </form>
          )}
        </Formik>
      </Grid>
    </>
  );
};

export default ServiceForm;
