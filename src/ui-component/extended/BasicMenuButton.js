import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DynamicButton from "ui-component/buttons/DynamicButton";

// ==========================================================
/* PROPS MAP
label = string for button
items = array of objects with id, name, and onClick function
*/

export default function BasicMenuButton(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <DynamicButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        name={props.name}
        size={props.size}
        type={props.type}
        color={props.color}
        onClick={handleClick}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {props.items.map((item) => (
          <MenuItem
            key={item.id}
            onClick={() => {
              handleClose();
              item.handler();
            }}
          >
            {item.name}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
