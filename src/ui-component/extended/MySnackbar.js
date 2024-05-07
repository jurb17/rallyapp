import * as React from "react";

// mui imports
import { useTheme } from "@material-ui/styles";
import { Alert, IconButton, Snackbar, Slide, Box } from "@mui/material";
import { IconX } from "@tabler/icons";

// ======================================================|| SNACKBAR ||===================================================== //
/* PROPS MAP
open = boolean for whether the snackbar is open
message = string for the message to display
location = object for the location of the snackbar (vertical: top, bottom; horizontal: left, right, center)
*/

function Transition(props) {
  return <Slide {...props} direction="up" />; // choose direction of slide
}

export default function MySnackbar(props) {
  const theme = useTheme();

  // define states
  const [state, setState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "center",
  });

  const { vertical, horizontal, open } = state;

  // generate random id for the snackbar so a new one is presented with each render.
  const generateRandomId = () => {
    return Math.random();
  };

  // If using autoHide, this is used to pass the "open" parameters from a parent component.
  React.useEffect(() => {
    setState({ open: props.open, ...props.location });
  }, [props.open]);

  // close handler
  const handleClose = (event, reason) => {
    // if user clicks away from the snackbar, nothing happens.
    if (reason === "clickaway") {
      return;
    }
    setState({ ...state, open: false });
  };

  const action = (
    <React.Fragment>
      {/* <Button color="secondary" size="small" onClick={handleClose}>
        UNDO
      </Button> */}
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <IconX fontSize="small" />
      </IconButton>
    </React.Fragment>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={props.open}
        // autoHideDuration={6000}
        onClose={handleClose}
        message={props.message}
        key={generateRandomId()}
        // action={action}
        TransitionComponent={Transition}
      >
        <Alert
          severity={props.severity ? props.severity : "warning"}
          variant="filled"
          sx={{
            color:
              !props.severity || props.severity === "warning"
                ? theme.palette.text.primary
                : theme.palette.background.paper,
          }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
