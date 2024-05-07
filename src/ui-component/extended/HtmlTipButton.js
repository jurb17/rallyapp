import * as React from "react";

// mui imports
import { makeStyles } from "@material-ui/styles";
import IconButton from "@mui/material/IconButton";
import { IconInfoCircle } from "@tabler/icons";
import { Popper, Box, ClickAwayListener } from "@material-ui/core";

// styles constant
const useStyles = makeStyles((theme) => ({
  popperBox: {
    backgroundColor: theme.palette.grey[100],
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "4px",
    padding: "8px",
  },
  boxStyle: {
    display: "flex",
    alignItems: "center",
  },
}));

// ==========================================================
/* PROPS MAP
body = components or text to display in button
*/

export default function HtmlTipButton(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box className={classes.boxStyle}>
      <IconButton
        id="basic-button"
        size={props.size ? props.size : "small"}
        aria-controls={open ? "basic-popper" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IconInfoCircle />
      </IconButton>
      <Popper
        id="basic-popper"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {!!props.body && (
          <ClickAwayListener onClickAway={handleClose}>
            <Box
              className={classes.popperBox}
              onClick={() => {
                handleClose();
                item.onClick();
              }}
            >
              {props.body}
            </Box>
          </ClickAwayListener>
        )}
      </Popper>
    </Box>
  );
}
