import React from "react";

// material-ui
import { Box, Modal } from "@material-ui/core";
import CancelButton from "ui-component/buttons/CancelButton";

// project imports

//= ================================================//
// PROPS MAP
// open = boolean for modal open/close
// heading = string to display as heading
// body = string to display as body
// handleErrorConfirmation = function to confirm errors have been seen

const ErrorModal = (props, { ...others }) => {
  // when OK button is selected.
  const handleConfirmation = () => {
    props.handleErrorConfirmation();
  };

  return (
    <Modal open={props.open}>
      <Box className="modalStyle">
        <h3>{props.heading}</h3>
        <p>{props.body}</p>
        <CancelButton onClick={handleConfirmation} name="OK" />
      </Box>
    </Modal>
  );
};

export default ErrorModal;
