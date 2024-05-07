import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { IconDotsVertical } from "@tabler/icons";

// ==========================================================
/* PROPS MAP
items = array of objects with id, name, and onClick function
*/

export default function BasicMenuIconButton(props) {
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
      <IconButton
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <IconDotsVertical />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {!!props.items &&
          props.items.length > 0 &&
          props.items.map((item) => (
            <MenuItem
              key={item.id ? item.id : item.name}
              onClick={() => {
                handleClose();
                item.onClick();
              }}
            >
              {item.name}
            </MenuItem>
          ))}
      </Menu>
    </div>
  );
}
