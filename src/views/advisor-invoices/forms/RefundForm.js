import React, { useState, useRef } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid, Box, Modal, Typography } from "@material-ui/core";

// third party
import { Formik } from "formik";
import * as Yup from "yup";

// project imports
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import CancelButton from "ui-component/buttons/CancelButton";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";

// style constant
const useStyles = makeStyles((theme) => ({
  formHeader: {
    marginBottom: theme.spacing(2),
  },
  descriptionText: {
    fontSize: "0.900rem",
    color: theme.palette.grey[900],
    marginBottom: theme.spacing(2),
  },
}));

// =======================================================
/* PROPS MAP
subtotal = number
subtotalAfterRefund = number
handleCancel = function
handleSubmit = function
*/

const RefundForm = (props, { ...others }) => {
  const classes = useStyles();
  const refundFormRef = useRef({});
  // set the state to handle for input
  const initialValues = {
    amount: "",
  };
  const [refundObj, setRefundObj] = React.useState(initialValues);
  const [formErrors, setFormErrors] = useState({});

  // handle changes to form fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRefundObj((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  // when custom field creation is abandoned.
  const handleCancel = () => {
    props.handleRefundCancel();
  };
  // when custom field is submitted.
  const handleSubmit = async (event) => {
    event.preventDefault();
    refundFormRef.current.validateForm();
    if (refundFormRef.current.isValid) {
      props.handleRefundSubmit(refundObj);
      setRefundObj(initialValues);
    } else {
      // if there are input errors, modal will appear to let user know
      const errorList = {
        ...refundFormRef.current.errors,
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
          <h3 className={classes.formHeader}>Submit Refund</h3>
          <Formik
            initialValues={initialValues}
            validationSchema={Yup.object().shape({
              amount: Yup.number()
                .positive("Refund amount must be a positive number")
                .lessThan(
                  props.subtotalAfterRefund,
                  "Refund amount must be less than the current total amount paid."
                )
                .required("Amount is required"),
            })}
            innerRef={refundFormRef}
          >
            {(formik) => (
              <form noValidate {...others}>
                <Grid container>
                  {/* Total Amount */}
                  <Grid item xs={12}>
                    <Typography className={classes.descriptionText}>
                      Total Available For Refund: ${props.subtotalAfterRefund}
                    </Typography>
                  </Grid>
                  {/* Fields */}
                  <MyTextInput
                    xs={12}
                    formik={formik}
                    name="amount"
                    id="amount"
                    label="Refund Amount"
                    value={refundObj.amount}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleInputChange(e);
                    }}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit(e);
                      }
                    }}
                    startAdornment={<span>$</span>}
                  />
                  {/* Buttons */}
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
                        onClick={(event) => handleSubmit(event)}
                        name="Submit"
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default RefundForm;
