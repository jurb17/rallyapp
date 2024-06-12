import React, { useState, useRef } from "react";

// material-ui
import { Grid, Box, Modal, Typography } from "@material-ui/core";

// third party
import { Formik } from "formik";

// local imports
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import CancelButton from "ui-component/buttons/CancelButton";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import { customFieldValidationSchema } from "utils/Validation";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";

// =======================================================//
/* PROPS MAP
open = boolean to open modal
handleAddFieldCancel = function to call when cancel button is clicked
handleAddFieldSave = function to call when save button is clicked
*/

const CustomFieldForm = (props, { ...others }) => {
  const customFieldFormRef = useRef({});

  const [fieldname, setFieldname] = React.useState("");
  const [fieldvalue, setFieldvalue] = React.useState("");
  const [formErrors, setFormErrors] = useState({});

  // handle changes to form fields
  const handleFieldnameChange = (e) => {
    setFieldname(e.target.value);
  };
  // handle changes to the value of the custom field
  const handleFieldvalueChange = (e) => {
    setFieldvalue(e.target.value);
  };
  // when custom field creation is abandoned.
  const handleCancel = () => {
    props.handleAddFieldCancel();
    setFieldname("");
  };
  // when custom field is submitted.
  const handleSave = async (event) => {
    event.preventDefault();
    customFieldFormRef.current.validateForm();
    if (customFieldFormRef.current.isValid) {
      props.handleAddFieldSave(fieldname, fieldvalue);
      setFieldname("");
    } else {
      // if there are input errors, modal will appear to let user know
      const errorList = {
        ...customFieldFormRef.current.errors,
      };
      // set error state to show error message
      setFormErrors(errorList);
    }
  };
  // handle error confirmation
  const handleErrorConfirmation = () => {
    setFormErrors({});
  };

  return (
    <>
      <FormInputErrorModal
        open={formErrors.length > 0}
        errorInfo={formErrors}
        handleErrorConfirmation={handleErrorConfirmation}
      />
      <Modal open={props.open}>
        <Box className="modalStyle">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h3" sx={{ m: 1 }}>
                Add New Custom Field
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Formik
                initialValues={{ fieldname: "", fieldvalue: "" }}
                validationSchema={customFieldValidationSchema}
                innerRef={customFieldFormRef}
              >
                {(formik) => (
                  <form noValidate {...others}>
                    <Grid container spacing={2}>
                      {/* Fields */}
                      <MyTextInput
                        xs={12}
                        formik={formik}
                        name="fieldname"
                        id="fieldname"
                        label="Field Name"
                        value={fieldname}
                        onChange={(e) => {
                          // only allow changes if value length is less than 60 characters
                          if (e.target.value.length < 32) {
                            formik.handleChange(e);
                            handleFieldnameChange(e);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSave(e);
                        }}
                      />
                      <MyTextInput
                        xs={12}
                        formik={formik}
                        name="fieldvalue"
                        id="fieldvalue"
                        label="Field Value"
                        value={fieldvalue}
                        onChange={(e) => {
                          // only allow changes if value length is less than 60 characters
                          if (e.target.value.length < 60) {
                            formik.handleChange(e);
                            handleFieldvalueChange(e);
                          }
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") handleSave(e);
                        }}
                      />
                      {/* <MySelectInput formik={formik} id='fieldtype' label='Field Type' value={fieldname['fieldtype']} readOnly={!props.editMode} options={types} onChange={inputChangeHandler} /> */}
                      {/* Buttons */}
                    </Grid>
                  </form>
                )}
              </Formik>
              <Grid
                container
                sx={{
                  display: "flex",
                  mt: 2,
                }}
              >
                <Grid item xs={12} sm={6}>
                  <CancelButton onClick={handleCancel} name="Cancel" />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <SecondaryActionButton
                    onClick={(event) => handleSave(event)}
                    name="Save New Field"
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </Modal>
    </>
  );
};

export default CustomFieldForm;
