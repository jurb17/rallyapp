import React from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  ClickAwayListener,
  Divider,
  Grid,
  InputAdornment,
  List,
  Paper,
  Popper,
  Switch,
  Typography,
} from "@material-ui/core";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";

// project imports
import MainCard from "ui-component/cards/MainCard";
import Transitions from "ui-component/extended/Transitions";
import UpgradePlanCard from "./UpgradePlanCard";

// assets
import {
  IconLogout,
  IconSearch,
  IconSettings,
  IconFileInfo,
} from "@tabler/icons";
import User1 from "assets/images/users/user-round.svg";
import LogoutButton from "ui-component/buttons/LogoutButton";
import AccountButton from "ui-component/buttons/AccountButton";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";

// style const
const useStyles = makeStyles((theme) => ({
  navContainer: {
    width: "100%",
    maxWidth: "350px",
    minWidth: "300px",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "10px",
    [theme.breakpoints.down("sm")]: {
      minWidth: "100%",
    },
  },
  headerAvatar: {
    cursor: "pointer",
    ...theme.typography.mediumAvatar,
    margin: "8px 0 8px 8px !important",
  },
  profileChip: {
    height: "48px",
    alignItems: "center",
    borderRadius: "27px",
    transition: "all .2s ease-in-out",
    border: `2px solid ${theme.palette.secondary.main}`,
    // backgroundColor: theme.palette.primary.light,
    '&[aria-controls="menu-list-grow"], &:hover': {
      background: `${theme.palette.primary.dark}!important`,
      color: theme.palette.secondary.main,
      "& svg": {
        color: theme.palette.secondary.main,
      },
      "& .MuiChip-label": {
        color: theme.palette.secondary.main,
      },
    },
    "& .MuiChip-label": {
      color: theme.palette.secondary.main,
    },
    fontSize: "1rem",
    paddingLeft: "8px",
    paddingRight: "8px",
  },
  aboutChip: {
    height: "48px",
    alignItems: "center",
    borderRadius: "27px",
    transition: "all .2s ease-in-out",
    border: `2px solid ${theme.palette.primary.main}`,
    // backgroundColor: theme.palette.primary.light,
    '&[aria-controls="menu-list-grow"], &:hover': {
      background: `${theme.palette.primary.dark}!important`,
      color: theme.palette.background.paper,
      "& svg": {
        color: theme.palette.background.paper,
      },
      "& .MuiChip-label": {
        color: theme.palette.background.paper,
      },
    },
    "& .MuiChip-label": {
      color: theme.palette.background.paper,
    },
    fontSize: "1rem",
    paddingLeft: "8px",
    paddingRight: "8px",
    marginRight: "8px",
  },
  cardContent: {
    padding: "16px !important",
  },
  card: {
    backgroundColor: theme.palette.primary.light,
    marginBottom: "16px",
    marginTop: "16px",
  },
  flex: {
    display: "flex",
  },
  name: {
    marginLeft: "2px",
    fontWeight: 400,
  },
}));

// ===========================|| PROFILE MENU ||=========================== //

const ProfileSection = () => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const { pathname } = location;
  const customization = useSelector((state) => state.customization);

  const [sdm, setSdm] = React.useState(true);
  const [value, setValue] = React.useState("");
  const [notification, setNotification] = React.useState(false);
  const [selectedIndex] = React.useState(1);

  // data and functions for Settings Button
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) return;
    setOpen(false);
  };

  // data and functions for About Page button
  const [showAbout, setShowAbout] = React.useState(false);

  const handleAboutClick = () => {
    console.log(pathname);
    setShowAbout(!showAbout);
  };

  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <ConfirmPrimaryModal
        open={showAbout}
        heading={"About this page"}
        body={"Example text example text text"}
        action={"Got it"}
        handleConfirm={handleAboutClick}
      />

      <Chip
        className={classes.aboutChip}
        icon={
          <IconFileInfo
            stroke={1.5}
            size="1.5em"
            color={theme.palette.background.paper}
          />
        }
        label="About Page"
        variant="outlined"
        onClick={handleAboutClick}
      />

      {!location.pathname.includes("/login") &&
        !location.pathname.includes("/signup") &&
        !location.pathname.includes("/register") && (
          <Chip
            classes={{ label: classes.profileLabel }}
            className={classes.profileChip}
            icon={
              // <Avatar
              //     src={User1}
              //     className={classes.headerAvatar}
              //     ref={anchorRef}
              //     aria-controls={open ? 'menu-list-grow' : undefined}
              //     aria-haspopup="true"
              //     color="inherit"
              // />
              <IconSettings
                stroke={1.5}
                size="1.5em"
                color={theme.palette.secondary.main}
              />
            }
            label="Settings"
            variant="outlined"
            ref={anchorRef}
            aria-controls={open ? "menu-list-grow" : undefined}
            aria-haspopup="true"
            onClick={handleToggle}
          />
        )}
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, 14],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions in={open} {...TransitionProps}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  border={false}
                  elevation={16}
                  content={false}
                  boxShadow
                  shadow={theme.shadows[16]}
                >
                  <CardContent className={classes.cardContent}>
                    {/* NOTE TO FIND THIS LATER: Upgrade your plan; Go Premium; Membership; Account; Subscription */}
                    {/* <UpgradePlanCard /> */}
                    {/* <Divider /> */}
                    <AccountButton handleToggle={handleToggle} />
                    <LogoutButton handleToggle={handleToggle} />
                    {/* </PerfectScrollbar> */}
                  </CardContent>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
