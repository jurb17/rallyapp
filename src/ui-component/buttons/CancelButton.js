import React from "react";

// material-ui
import { Button, Box } from "@material-ui/core";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";

// ======================================================

const CancelButton = (props) => {
  let mt = props.mt ? props.mt : 0;
  let mr = props.mr ? props.mr : 1;
  const mb = props.mb ? props.mb : 1;
  let ml = props.ml ? props.ml : 1;

  return (
    <Box sx={{ flexGrow: 0, ml: ml, mr: mr, mb: mb, mt: mt }}>
      <AnimateButton>
        <Button
          disableElevation
          fullWidth
          size={props.size ? props.size : "large"}
          variant="text"
          color="primary"
          {...props}
        >
          {props.name ? props.name : "Cancel"}
        </Button>
      </AnimateButton>
    </Box>
  );
};

export default CancelButton;
