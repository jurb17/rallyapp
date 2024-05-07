import React from "react";

// material-ui
import { Button, Box } from "@material-ui/core";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";

// ====================================================== //

const SecondaryActionButton = (props) => {
  return (
    <Box
      sx={{
        flexGrow: 0,
        ml: props.ml ? props.ml : 1,
        mt: props.mt ? props.mt : 0,
        mr: props.mr ? props.mr : 1,
        mb: props.mb ? props.mb : 1,
      }}
    >
      <AnimateButton>
        <Button
          disableElevation
          fullWidth
          size={props.size ? props.size : "large"}
          variant="outlined"
          color="secondary"
          {...props}
        >
          {props.name ? props.name : "Save"}
        </Button>
      </AnimateButton>
    </Box>
  );
};

export default SecondaryActionButton;
