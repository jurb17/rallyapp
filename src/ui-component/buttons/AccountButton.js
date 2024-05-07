import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import ListItemButton from "@material-ui/core/ListItemButton";

// project imports
import { IconTool } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  navContainer: {
    width: "100%",
    marginTop: "12px",
    marginBottom: "12px",
    ...theme.typography.subMenuCaption,
  },
  itemButton: {
    "&:hover": {
      backgroundColor: theme.palette.secondary.light,
    },
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

// ====================================================== //

const AccountButton = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const customization = useSelector((state) => state.customization);

  const { attributes } = useSelector((state) => state.auth);

  const handleClick = () => {
    props.handleToggle();
    if (
      attributes.ACCOUNT === 1 &&
      (attributes.CUSTOMER === -1 || attributes.CUSTOMER === 1) &&
      attributes.ADVISOR === 0 &&
      attributes.RIA === 0
    ) {
      navigate("/client/settings");
    } else {
      navigate("/adv/settings");
    }
  };

  return (
    <div className={classes.navContainer}>
      <ListItemButton
        // className={classes.itemButton}
        sx={{ borderRadius: `${customization.borderRadius}px` }}
        onClick={handleClick}
        style={{ paddingLeft: "24px", paddingRight: "32px" }}
      >
        <ListItemIcon className={classes.listIcon}>
          <IconTool stroke={1.5} size="1.89em" />
        </ListItemIcon>
        <ListItemText
          primary={
            <Typography variant="h5" color="inherit">
              Account
            </Typography>
          }
        />
      </ListItemButton>
    </div>
  );
};

export default AccountButton;
