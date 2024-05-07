import PropTypes from "prop-types";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Avatar, Box, ButtonBase } from "@material-ui/core";

// project imports
import LogoSection from "../LogoSection";
import SearchSection from "./SearchSection";
import ProfileSection from "./ProfileSection";
import NotificationSection from "./NotificationSection";
import BannerSection from "./BannerSection";

// assets
import { IconMenu2 } from "@tabler/icons";
import { useSelector } from "react-redux";

// style constant
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  headerAvatar: {
    ...theme.typography.commonAvatar,
    ...theme.typography.mediumAvatar,
    transition: "all .2s ease-in-out",
    background: theme.palette.primary.dark,
    // border: `1px solid ${theme.palette.grey[500]}`,
    color: theme.palette.background.paper,
    "&:hover": {
      backgroundColor: theme.palette.primary[800],
      color: theme.palette.primary.light,
    },
  },
  boxContainer: {
    width: "228px",
    display: "flex",
    [theme.breakpoints.down("md")]: {
      width: "auto",
    },
  },
}));

// ===========================|| MAIN NAVBAR / HEADER ||=========================== //

const Header = ({ handleLeftDrawerToggle }) => {
  const classes = useStyles();
  const { attributes } = useSelector((state) => state.auth);

  const [showBanner, setShowBanner] = React.useState(false);

  // if there is an attribute with value -1, show banner
  useEffect(() => {
    let count = 0;
    Object.entries(attributes).forEach(([key, value]) => {
      if (value === -1) {
        setShowBanner(true);
        count = count + 1;
        return true;
      }
    });
    if (count === 0) {
      setShowBanner(false);
    }
  }, [attributes]);

  return (
    <>
      {/* logo & toggler button */}
      <div className={classes.boxContainer}>
        <Box
          component="span"
          sx={{ display: { xs: "none", md: "block" }, flexGrow: 1 }}
        >
          <LogoSection />
        </Box>
        <ButtonBase
          sx={{
            borderRadius: "12px",
            overflow: "hidden",
          }}
        >
          <Avatar
            variant="rounded"
            className={classes.headerAvatar}
            onClick={handleLeftDrawerToggle}
            color="inherit"
          >
            <IconMenu2 stroke={1.5} size="1.05em" />
          </Avatar>
        </ButtonBase>
      </div>
      {/* show banner section if user has required attribute ( === -1 ) */}
      {showBanner ? <BannerSection /> : <p></p>}

      {/* header search */}
      <SearchSection theme="light" />
      <div className={classes.grow} />
      <div className={classes.grow} />

      {/* notification & profile */}
      <NotificationSection />
      <ProfileSection />
    </>
  );
};

Header.propTypes = {
  handleLeftDrawerToggle: PropTypes.func,
};

export default Header;
