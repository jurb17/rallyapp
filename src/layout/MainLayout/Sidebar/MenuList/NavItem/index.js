import PropTypes from "prop-types";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Avatar,
  Chip,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import ListItemButton from "@material-ui/core/ListItemButton";
import { IconPoint } from "@tabler/icons";

// project imports
import { MENU_OPEN, SET_MENU } from "actions/types";

// assets
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";

// style constant
const useStyles = makeStyles((theme) => ({
  listIcon: {
    minWidth: "18px",
    marginTop: "auto",
    marginBottom: "auto",
    color: theme.palette.text.hint,
  },
  listCustomIconSub: {
    width: "6px",
    height: "6px",
    color: theme.palette.text.hint,
  },
  listCustomIconSubActive: {
    width: "8px",
    height: "8px",
    color: theme.palette.text.hint,
  },
  listItem: {
    marginBottom: "5px",
    alignItems: "center",
    color: theme.palette.text.hint,
  },
  listItemNoBack: {
    marginBottom: "5px",
    backgroundColor: "transparent !important",
    paddingTop: "8px",
    paddingBottom: "8px",
    alignItems: "flex-start",
    color: theme.palette.text.hint,
  },
  subMenuCaption: {
    ...theme.typography.subMenuCaption,
    color: theme.palette.text.hint,
  },
}));

// ===========================|| SIDEBAR MENU LIST ITEMS ||=========================== //

const NavItem = ({ item, level }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const customization = useSelector((state) => state.customization);
  const advice = useSelector((state) => state.advice);
  const advisory = useSelector((state) => state.advisory);
  const matchesSM = useMediaQuery((theme) => theme.breakpoints.down("md"));

  const Icon = item.icon;
  const itemIcon = item.icon ? (
    <Icon stroke={1.5} size="1.5em" className={classes.listCustomIcon} />
  ) : (
    <FiberManualRecordIcon
      className={
        customization.isOpen.findIndex((id) => id === item.id) > -1
          ? classes.listCustomIconSubActive
          : classes.listCustomIconSub
      }
      fontSize={level > 0 ? "inherit" : "default"}
    />
  );

  let itemIconClass = !item.icon ? classes.listIcon : classes.menuIcon;
  itemIconClass =
    customization.navType === "nav-dark"
      ? [itemIconClass, classes.listCustomIcon].join(" ")
      : itemIconClass;

  let itemTarget = "";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps = {
    component: React.forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} />
    )),
  };
  if (item.external) {
    listItemProps = { component: "a", href: item.url };
  }

  const itemHandler = (id) => {
    dispatch({ type: MENU_OPEN, id });
    if (matchesSM) dispatch({ type: SET_MENU, opened: false });
  };

  // active menu item on page load
  React.useEffect(() => {
    const currentIndex = document.location.pathname
      .toString()
      .split("/")
      .findIndex((id) => id === item.id);
    if (currentIndex > -1) {
      dispatch({ type: MENU_OPEN, id: item.id });
    }
    // eslint-disable-next-line
  }, []);

  // change the menu item that is highlighted when the path changes
  React.useEffect(() => {
    const pathpieces = document.location.pathname.toString().split("/");
    const advisoryIndex = pathpieces.findIndex((id) => id === "advisory");
    const pathid =
      pathpieces[advisoryIndex + 1] + "-" + pathpieces[advisoryIndex + 2];
    dispatch({ type: MENU_OPEN, id: pathid });
    // eslint-disable-next-line
  }, [location]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      className={level > 1 ? classes.listItemNoBack : classes.listItem}
      sx={{ borderRadius: `${customization.borderRadius}px` }}
      selected={customization.isOpen.findIndex((id) => id === item.id) > -1}
      onClick={() => itemHandler(item.id)}
      target={itemTarget}
      style={{ paddingLeft: `${level * 23}px` }}
    >
      <ListItemIcon className={itemIconClass}>{itemIcon}</ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant={
              customization.isOpen.findIndex((id) => id === item.id) > -1
                ? "h5"
                : "body1"
            }
            color="inherit"
          >
            {item.title}
          </Typography>
        }
        secondary={
          item.caption && (
            <Typography
              variant="caption"
              className={classes.subMenuCaption}
              display="block"
              gutterBottom
            >
              {item.caption}
            </Typography>
          )
        }
      />

      {item.title === "Messages" && !!advisory.unread && (
        <IconPoint color="red" fill="red" />
      )}
      {item.title === "Chat" && !!advice.unread && (
        <IconPoint color="red" fill="red" />
      )}
      {item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
