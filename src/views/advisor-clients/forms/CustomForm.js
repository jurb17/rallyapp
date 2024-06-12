import React, { useState } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// assets
import { gridSpacing } from "store/constant";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import MyInputBase from "ui-component/forms/inputs/MyInputBase";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";

// =============================================================
/* PROPS MAP
customInput = object of custom fields
editMode = boolean to determine if the user is in edit mode
handleCustomInputChange = function to handle changes to custom fields
forwardedCustomFormRef = ref to the form
deleteField = function to trigger delete confirmation modal
handleDeleteFieldConfirm = function to handle delete confirmation
handleDeleteFieldCancel = function to handle delete cancel
*/

const CustomForm = (props) => {
  // states
  const [deleteField, setDeleteField] = useState(false);
  const [deleteFieldName, setDeleteFieldName] = useState("");

  // if user selects the delete button
  const handleDelete = (e) => {
    setDeleteField(true);
    setDeleteFieldName(e.currentTarget.id);
  };
  // confirm that field should be deleted.
  const handleDeleteConfirm = () => {
    props.handleDeleteFieldConfirm(deleteFieldName);
    setDeleteField(false);
    setDeleteFieldName("");
  };
  // cancel delete process
  const handleDeleteCancel = () => {
    setDeleteField(false);
    setDeleteFieldName("");
  };
  // handle changes to form fields
  const handleInputChange = (e) =>
    props.handleCustomInputChange(e.target.name, e.target.value);

  return (
    <>
      <ConfirmDeleteModal
        open={deleteField}
        handleConfirm={handleDeleteConfirm}
        handleCancel={handleDeleteCancel}
        heading="Are you sure you want to delete this field?"
        body={`This will delete the field "${deleteFieldName}"`}
      />
      <Formik initialValues={props.customInput}>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            <Box sx={{ flexGrow: 1 }}>
              {props.customInput !== undefined && (
                <Grid container spacing={gridSpacing}>
                  {Object.entries(props.customInput)
                    .sort()
                    .map(([key, value]) => {
                      return props.editMode ? (
                        <MyTextInput
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          formik={formik}
                          key={key}
                          id={key}
                          label={key}
                          value={value ? value : ""}
                          readOnly={!props.editMode}
                          deletable={props.editMode ? "true" : "undefined"}
                          onChange={(e) => {
                            // only allow changes if value length is less than 60 characters
                            if (e.target.value.length < 60) {
                              formik.handleChange(e);
                              handleInputChange(e);
                            }
                          }}
                          handledelete={handleDelete}
                        />
                      ) : (
                        <MyInputBase
                          xs={12}
                          sm={6}
                          md={4}
                          lg={4}
                          formik={formik}
                          key={key}
                          id={key}
                          label={key}
                          value={value ? value : ""}
                        />
                      );
                    })}
                </Grid>
              )}
            </Box>
          </form>
        )}
      </Formik>
    </>
  );
};

export default CustomForm;
