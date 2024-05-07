import React from "react";
import { useSelector, useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import ListItemButton from "@material-ui/core/ListItemButton";

// project imports
import { IconLogout } from "@tabler/icons";
import { logout } from "actions/auth";

// style constant
const useStyles = makeStyles((theme) => ({
  navContainer: {
    width: "100%",
    marginTop: "12px",
    marginBottom: "12px",
    ...theme.typography.subMenuCaption,
  },
  listIcon: {
    color: theme.palette.grey[900],
    minWidth: "18px",
    marginRight: "12px",
  },
  subMenuCaption: {
    ...theme.typography.subMenuCaption,
  },
}));

// ======================================================

const LogoutButton = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const customization = useSelector((state) => state.customization);

  return (
    <div className={classes.navContainer}>
      <ListItemButton
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        onClick={() => {
          props.handleToggle();
          dispatch(logout());
        }}
        style={{ paddingLeft: "24px", paddingRight: "32px" }}
      >
        <ListItemIcon className={classes.listIcon}>
          <IconLogout
            stroke={1.5}
            // size="1.3rem"
            size="1.89em"
            className={classes.listCustomIcon}
          />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="h5" color="inherit">
              Logout
            </Typography>
          }
        />
      </ListItemButton>
    </div>
  );
};

export default LogoutButton;
