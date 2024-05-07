import React from "react";
import { useSelector } from "react-redux";

// material-ui
import { Typography } from "@material-ui/core";

// project imports
import NavGroup from "./NavGroup";
import menuItem from "menu-items";

// ===========================|| SIDEBAR MENU LIST ||=========================== //

const MenuList = ({ chats }) => {
  // must fix this in the future.
  const { attributes } = useSelector((state) => state.auth);
  const menuList = [];
  if (!!attributes) {
    switch (attributes.ADVISOR) {
      case -1:
        // menuList.push("profile");
        break;
      case 1:
        menuList.push("advisory");
        menuList.push("profile");
      case 2:
        menuList.push("advisory");
        menuList.push("profile");
        break;
      default:
        break;
    }
    switch (attributes.RIA) {
      case -1:
        // menuList.push("profile");
        break;
      case 1:
        menuList.push("advisory");
        menuList.push("profile");
      case 2:
        menuList.push("advisory");
        menuList.push("profile");
        break;
      default:
        break;
    }
    switch (attributes.CUSTOMER) {
      case -1:
        menuList.push("client");
        break;
      case 0:
        break;
      case 1:
        menuList.push("client");
        break;
      default:
        break;
    }
  } else {
    console.log("No attributes detected");
  }

  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case "group":
        if (menuList.includes(item.id)) {
          return <NavGroup key={item.id} item={item} />;
        }
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            {/* Menu Items Error .... comment here leads to nothing showing up by default. */}
          </Typography>
        );
    }
  });

  return navItems;
};

export default MenuList;
