import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Modal } from "@material-ui/core";

// project imports
import CancelButton from "ui-component/buttons/CancelButton";

// style constant
const useStyles = makeStyles((theme) => ({
  errorText: {
    color: theme.palette.error.main,
    fontSize: "0.875rem",
    marginRight: "16px",
  },
}));

// libraries that use 'require'
const moment = require("moment");

//====================================================================
// PROPS MAP
// open: boolean
// errorInfo: object
// defaultMessage: string
// handleErrorConfirmation: function

const FormInputErrorModal = (props, { ...others }) => {
  const classes = useStyles();

  // when OK button is selected.
  const handleConfirmation = () => {
    props.handleErrorConfirmation();
  };

  return (
    <Modal open={props.open}>
      <Box className="modalStyle">
        {props.errorInfo && Object.entries(props.errorInfo).length > 0 ? (
          <>
            <h3>Can't submit this form due to the following errors:</h3>
            {Object.entries(props.errorInfo).map(([key, value]) => {
              return (
                <p>
                  <em className={classes.errorText}>
                    {typeof value === "object"
                      ? moment(value).format("DD-MM-YYYY")
                      : value}
                  </em>
                </p>
              );
            })}
          </>
        ) : (
          <p>
            <em>{props.defaultMessage}</em>
          </p>
        )}
        <CancelButton onClick={handleConfirmation} name="OK" />
      </Box>
    </Modal>
  );
};

export default FormInputErrorModal;
