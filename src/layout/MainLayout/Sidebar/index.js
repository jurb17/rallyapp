import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Drawer, useMediaQuery } from "@material-ui/core";

// third-party
import PerfectScrollbar from "react-perfect-scrollbar";
import { BrowserView, MobileView } from "react-device-detect";

// project imports
import MenuList from "./MenuList";
import LogoSection from "../LogoSection";
import MenuCard from "./MenuCard";
import LogoutButton from "ui-component/buttons/LogoutButton";
import { drawerWidth } from "store/constant";

// style constant
const useStyles = makeStyles((theme) => ({
  drawer: {
    color: theme.palette.background.paper,
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    // backgroundColor of the side menu
    background: theme.palette.primary.dark,
    color: theme.palette.background.paper,
    borderRight: "none",
    // borderTopRightRadius: "12px",
    [theme.breakpoints.up("md")]: {
      top: "88px",
    },
  },
  ScrollHeight: {
    height: "calc(100vh - 88px)",
    paddingLeft: "16px",
    paddingRight: "16px",
    paddingTop: "16px",
    [theme.breakpoints.down("sm")]: {
      height: "calc(100vh - 56px)",
    },
  },
  boxContainer: {
    display: "flex",
    padding: "16px",
    marginLeft: "auto",
    marginRight: "auto",
  },
}));

// ===========================|| SIDEBAR DRAWER ||=========================== //

const Sidebar = ({ drawerOpen, drawerToggle, window, chats }) => {
  const classes = useStyles();
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up("md"));

  const drawer = (
    <>
      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <div className={classes.boxContainer}>
          <LogoSection />
        </div>
      </Box>
      <BrowserView>
        <PerfectScrollbar component="div" className={classes.ScrollHeight}>
          <MenuList />
          {/* <MenuCard /> */}
          {/* <LogoutButton /> */}
        </PerfectScrollbar>
      </BrowserView>
      <MobileView>
        <Box sx={{ px: 2, pt: 2 }}>
          <MenuList />
          {/* <MenuCard /> */}
        </Box>
      </MobileView>
    </>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      <Drawer
        container={container}
        variant={matchUpMd ? "persistent" : "temporary"}
        anchor="left"
        open={drawerOpen}
        onClose={drawerToggle}
        classes={{
          paper: classes.drawerPaper,
        }}
        ModalProps={{ keepMounted: true }}
        color="inherit"
      >
        {drawer}
      </Drawer>
    </nav>
  );
};

Sidebar.propTypes = {
  drawerOpen: PropTypes.bool,
  drawerToggle: PropTypes.func,
  window: PropTypes.object,
};

export default Sidebar;
