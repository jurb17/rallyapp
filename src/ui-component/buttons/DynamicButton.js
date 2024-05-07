import React from "react";

// material-ui
import { Button, Box, Typography, IconButton } from "@material-ui/core";

// project imports
import AnimateButton from "ui-component/extended/AnimateButton";

// ======================================================

const DynamicButton = (props) => {
  let mt = props.mt ? props.mt : 0;
  let mr = props.mr ? props.mr : 0.5;
  let mb = props.mb ? props.mb : 0;
  let ml = props.ml ? props.ml : 0.5;
  let pt = props.pt ? props.pt : 0;
  let pr = props.pr ? props.pr : 0.5;
  let pb = props.pb ? props.pb : 0;
  let pl = props.pl ? props.pl : 0.5;

  return (
    <Box
      sx={{
        flexGrow: 0,
        ml: ml,
        mr: mr,
        mb: mb,
        mt: mt,
        pl: pl,
        pr: pr,
        pb: pb,
        pt: pt,
      }}
    >
      {!!props.icon ? (
        <AnimateButton>
          <IconButton
            sx={{ p: "10px", size: "medium" }}
            aria-label="refresh"
            onClick={props.onClick ? props.onClick : () => {}}
          >
            {props.component}
          </IconButton>
        </AnimateButton>
      ) : (
        <AnimateButton>
          <Button
            disableElevation
            fullWidth
            size={props.size ? props.size : "medium"}
            variant={props.variant ? props.variant : "contained"}
            color={props.color ? props.color : "primary"}
            disabled={props.disabled ? props.disabled : false}
            startIcon={props.startIcon ? props.startIcon : null}
            endIcon={props.endIcon ? props.endIcon : null}
            onClick={props.onClick ? props.onClick : () => {}}
            {...props}
          >
            {props.name ? props.name : null}
            {props.children}
          </Button>
        </AnimateButton>
      )}
    </Box>
  );
};

export default DynamicButton;
