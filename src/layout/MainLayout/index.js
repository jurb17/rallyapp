import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  AppBar,
  CssBaseline,
  Toolbar,
  useMediaQuery,
  Box,
  Typography,
} from "@material-ui/core";
import { IconChevronRight } from "@tabler/icons";
import "styles/global_styles.css";

// third-party
import clsx from "clsx";

// project imports
import Breadcrumbs from "ui-component/extended/Breadcrumbs";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ProfileSection from "./Header/ProfileSection";
import Customization from "../Customization";
import navigation from "menu-items";
import { drawerWidth } from "store/constant";
import { SET_MENU } from "actions/types";
import tokenService from "services/token.service";
import adviceService from "services/advice.service";
import { newAdvisoryUnread } from "actions/advisory";
import { newAdviceUnread } from "actions/advice";
import { refreshAuthRedux } from "actions/auth";
import MySnackbar from "ui-component/extended/MySnackbar";
import { showSnackbar, showEditBanner } from "actions/main";
import EditBanner from "ui-component/banners/EditBanner";
import { attributesNavigation } from "utils/navigation";

// style constant
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    // backgroundColor of everything outside of the content area, sidemenu, and header
    backgroundColor: theme.palette.primary.main,
  },
  appBar: {
    // backgroundColor of the header
    backgroundColor: theme.palette.background.paper,
  },
  appBarWidth: {
    transition: theme.transitions.create("width"),
  },
  content: {
    ...theme.typography.mainContent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    // definition of the backgroundColor of the main content/workspace area.
    // backgroundColor: theme.palette.primary.light,
    backgroundColor: theme.palette.background.paper,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    [theme.breakpoints.up("md")]: {
      marginLeft: -(drawerWidth - 20),
      width: `calc(100% - ${drawerWidth}px)`,
      // $$$ where to add padding to the main display area
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: "20px",
      width: `calc(100% - ${drawerWidth}px)`,
      // $$$ where to add padding to the main display area
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10px",
      width: `calc(100% - ${drawerWidth}px)`,
      // $$$ where to add padding to the main display area
      marginRight: "10px",
    },
  },
  mainBox: {
    width: "100%", // width of the main content window
    margin: "0 auto",
    padding: "24px",
    justifyContent: "center",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    [theme.breakpoints.down("md")]: {
      marginLeft: "20px",
    },
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10px",
    },
  },
  settingsButton: {
    display: "flex-end",
    marginLeft: "auto",
  },
  // COLOR FOR TOP TOOLBAR
  toolbar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

// ===========================|| MAIN LAYOUT ||=========================== //

const MainLayout = () => {
  const classes = useStyles();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const customization = useSelector((state) => state.customization);
  const main = useSelector((state) => state.main);
  const auth = useSelector((state) => state.auth);
  const advisory = useSelector((state) => state.advisory);
  const advice = useSelector((state) => state.advice);
  const matchDownMd = useMediaQuery(theme.breakpoints.down("md"));

  // HANDLE LEFT DRAWER (SIDE MENU) ============================================
  const leftDrawerOpened = useSelector((state) => state.customization.opened);
  const handleLeftDrawerToggle = () => {
    dispatch({ type: SET_MENU, opened: !leftDrawerOpened });
  };

  // if breakpoint is less than md, then the sidebar is always closed.
  React.useEffect(() => {
    dispatch({ type: SET_MENU, opened: !matchDownMd });
  }, [matchDownMd]);

  useEffect(() => {
    // close drawer for given locations
    if (
      location.pathname.includes("/signup") ||
      location.pathname.includes("/register") ||
      location.pathname.includes("/login") ||
      location.pathname.includes("/onboarding")
    ) {
      // check if drawer is open first
      if (!matchDownMd && !!customization.opened)
        dispatch({ type: SET_MENU, opened: false });
    }
    // open drawer for other locations when drawer is closed
    else if (!matchDownMd && !customization.opened)
      dispatch({ type: SET_MENU, opened: true });
  }, [customization, location.pathname, auth.accesstoken]);

  // HANDLE ROUTING BASED ON QUERY PARAMS ====================================
  // depricated logic to reroute user based on query params in URL that ended in "/register"
  // @@@ might be able to use this in the future to understand where a user is coming from.

  // UPDATES LOOP ============================================================
  // depricated logic to repeatedly ask database for messages data for "near-instant" messages service.
  // @@@ will be able to use this in the future for message updates after backend is connected.

  // HANDLE SNACKBAR MESSAGES ============================================================

  useEffect(() => {
    if (!!main.snackMessage && !!main.snackMessage.trim()) {
      // set timer that will manage the open/close state of the snackbar
      let timer = setTimeout(() => {
        dispatch(showSnackbar("", false, ""));
      }, 6000);

      // if the useEffect is prompted to run again, the following will be returned before the next run.
      return () => {
        clearTimeout(timer);
        dispatch(showSnackbar("", false, ""));
      };
    }
  }, [main.snackMessage, main.openSnack, location.pathname]);

  // HANDLE EDIT BANNER ============================================================

  useMemo(() => {
    if (!!main.editMode) {
      dispatch(showEditBanner(false, ""));
    }
  }, [location.pathname]);

  // PRESENT APP JSX ============================================================

  return (
    <div className={classes.root}>
      <CssBaseline />
      {/* header */}
      <AppBar
        enableColorOnDark
        position="fixed"
        color="inherit"
        elevation={0}
        className={leftDrawerOpened ? classes.appBarWidth : classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Header handleLeftDrawerToggle={handleLeftDrawerToggle} />
        </Toolbar>
      </AppBar>

      {/* drawer */}
      <Sidebar
        drawerOpen={leftDrawerOpened}
        drawerToggle={handleLeftDrawerToggle}
      />

      {/* main content */}
      <main
        className={clsx([
          classes.content,
          {
            [classes.contentShift]: leftDrawerOpened,
          },
        ])}
      >
        {!!main.editMode && <EditBanner text={main.editBannerText} />}
        <Box className={classes.mainBox}>
          {/* <Box sx={{ display: "flex", flexDirection: "row-reverse" }}>
            <ProfileSection className={classes.settingsButton} />
          </Box> */}

          {/* breadcrumb */}
          <Breadcrumbs
            separator={IconChevronRight}
            navigation={navigation}
            icon
            title
            rightAlign
          />
          <Outlet />
          <MySnackbar
            open={main.openSnack}
            message={main.snackMessage}
            severity={main.snackSeverity}
            location={{ vertical: "bottom", horizontal: "center" }}
          />
        </Box>
      </main>
      <Customization />
    </div>
  );
};

export default MainLayout;
