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

  // for the following paths, close drawer if open.
  useEffect(() => {
    if (
      (location.pathname.includes("/signup") ||
        location.pathname.includes("/register") ||
        location.pathname.includes("/login") ||
        location.pathname.includes("/onboarding")) &&
      !matchDownMd
    ) {
      if (!!customization.opened) {
        dispatch({ type: SET_MENU, opened: false });
      }
    }
  }, [customization]);

  // for other paths, open drawer upon landing on the app the page.
  useEffect(() => {
    if (
      !location.pathname.includes("/signup") &&
      !location.pathname.includes("/register") &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/onboarding") &&
      !matchDownMd
    ) {
      if (!customization.opened) {
        dispatch({ type: SET_MENU, opened: true });
      }
    }
    if (!auth.attributes) {
      dispatch(
        refreshAuthRedux(
          tokenService.getSessionAccessToken(),
          tokenService.getSessionRefreshToken()
        )
      );
    }
  }, [location.pathname]);

  // HANDLE ROUTING BASED ON QUERY PARAMS ====================================
  const queryParams = new URLSearchParams(location.search);

  // if there is a token param and the pathname is /register, remove tokens from session and local storage.
  useEffect(() => {
    if (location.pathname.includes("/register") && queryParams.has("token")) {
      tokenService.removeUser();
    } else if (
      !!location.pathname.includes("/login") &&
      !!tokenService.getSessionAccessToken()
    ) {
      attributesNavigation(navigate, location);
    }
  }, []);

  // UPDATES LOOP ============================================================
  // stop loop cycle if there are too many errors. (to prevent infinite loop)
  let loopcount = 0;

  // function set an an interval that will capture new chat messages every 15 seconds.
  React.useEffect(() => {
    const interval = setInterval(() => {
      // request chat message updates if the advisor user has the merchant attribute and an access token.
      if (
        !!tokenService.getSessionAccessToken() &&
        (auth.attributes.MERCHANT === 1 || auth.attributes.CUSTOMER === 1)
      ) {
        adviceService
          .getUpdates({})
          .then((response) => {
            // if there are messages in the response, then dispatch the updatechat action with a list of adviceids.
            if (!!response.data.payload.success) {
              // if response has a list of objects for "new_advisory", then update the global unread chats object
              if (!!response.data.payload.newAdvisory) {
                dispatch(newAdvisoryUnread(response.data.payload.newAdvisory));
              } else if (advisory.unreadchats.length > 0) {
                dispatch(newAdvisoryUnread([]));
              }
              // if response has a list of objects for "new_advice", then update the global unread chats object
              if (!!response.data.payload.newAdvice) {
                dispatch(newAdviceUnread(response.data.payload.newAdvice));
              } else if (advice.unreadchats.length > 0) {
                dispatch(newAdviceUnread([]));
              }
            } else {
              console.log("caught error", response.data.details.text);
            }
          })
          .catch((error) => {
            // no snackbar here because this process happens in the background.
            console.log("error", error);
            clearInterval(interval);
          });
      } else {
        console.log("not authorized for updates.");
        loopcount++;
        if (loopcount < 3) {
          dispatch(
            refreshAuthRedux(
              tokenService.getSessionAccessToken(),
              tokenService.getSessionRefreshToken()
            )
          );
        } else {
          console.log("three failures to update attributes.");
          clearInterval(interval);
        }
      }
    }, 15000);
    // clears the interval when the component unmounts.
    return () => clearInterval(interval);
  }, [auth.attributes]); // add some variable here that triggers the loop to start running again.

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
