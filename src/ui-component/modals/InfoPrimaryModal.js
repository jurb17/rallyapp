import React from "react";

// material-ui
import { Box, Modal, Grid } from "@material-ui/core";

// project imports
import PrimaryActionButton from "ui-component/buttons/PrimaryActionButton";
import CancelButton from "ui-component/buttons/CancelButton";

//==================================================
/* PROPS MAP
open = boolean to determine if modal is open
heading = string to display as heading
bodyList = list of strings to display in modal
action = string (primary button name)
handleCancel = function to handle cancel
handleConfirm = function to handle confirm
nonaction = string (cancel button name)
*/

const InfoPrimaryModal = (props, { ...others }) => {
  // when cancel button is selected.
  const handleCancel = () => {
    props.handleCancel();
  };
  // when cancel button is selected.
  const handleConfirm = () => {
    props.handleConfirm();
  };

  return (
    <Modal open={props.open}>
      <Box className="modalStyle">
        <h3>{props.heading}</h3>
        {props.bodyList
          ? props.bodyList.map((item) => {
              return (
                <>
                  <p>{item}</p>
                </>
              );
            })
          : ""}
        <Grid
          container
          sx={{ display: "flex", justifyContent: "center", pt: 2 }}
        >
          {!!props.handleCancel && (
            <Grid item xs={12} sm={6}>
              <CancelButton
                onClick={handleCancel}
                name={props.nonaction ? props.nonaction : "Cancel"}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <PrimaryActionButton
              onClick={handleConfirm}
              name={props.action ? props.action : "Confirm"}
            />
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default InfoPrimaryModal;
