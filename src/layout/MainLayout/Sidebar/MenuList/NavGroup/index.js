import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Divider, List, Typography } from "@material-ui/core";

// project imports
import NavItem from "../NavItem";
import NavCollapse from "../NavCollapse";
import { useTheme } from "@emotion/react";

// style constant
const useStyles = makeStyles((theme) => ({
  menuCaption: {
    ...theme.typography.menuCaption,
  },
  subMenuCaption: {
    ...theme.typography.subMenuCaption,
  },
  menuDivider: {
    marginTop: "2px",
    marginBottom: "12px",
  },
}));

// ===========================|| SIDEBAR MENU LIST GROUP ||=========================== //

const NavGroup = ({ item, chats }) => {
  const classes = useStyles();
  const theme = useTheme();

  // menu list collapse & items
  const items = item.children.map((menu) => {
    switch (menu.type) {
      case "collapse":
        return <NavCollapse key={menu.id} menu={menu} level={1} />;
      case "item":
        return <NavItem key={menu.id} item={menu} level={1} />;
      default:
        return (
          <Typography key={menu.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return (
    <>
      <List
        subheader={
          item.title && (
            <Typography
              variant="h4"
              color={theme.palette.primary.light}
              display="block"
              gutterBottom
            >
              {item.title}
              {item.caption && (
                <Typography
                  variant="caption"
                  className={classes.subMenuCaption}
                  display="block"
                  gutterBottom
                >
                  {item.caption}
                </Typography>
              )}
            </Typography>
          )
        }
      >
        {items}
      </List>

      {/* group divider */}
      {!item.noDivider && <Divider className={classes.menuDivider} />}
    </>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
