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
import { IconLogout, IconSearch, IconSettings } from "@tabler/icons";
import User1 from "assets/images/users/user-round.svg";
import LogoutButton from "ui-component/buttons/LogoutButton";
import AccountButton from "ui-component/buttons/AccountButton";

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
  listItem: {
    marginTop: "5px",
  },
  cardContent: {
    padding: "16px !important",
  },
  card: {
    backgroundColor: theme.palette.primary.light,
    marginBottom: "16px",
    marginTop: "16px",
  },
  searchControl: {
    width: "100%",
    paddingRight: "8px",
    paddingLeft: "16px",
    marginBottom: "16px",
    marginTop: "16px",
  },
  startAdornment: {
    fontSize: "1rem",
    color: theme.palette.grey[500],
  },
  flex: {
    display: "flex",
  },
  name: {
    marginLeft: "2px",
    fontWeight: 400,
  },
  ScrollHeight: {
    height: "100%",
    maxHeight: "calc(100vh - 250px)",
    overflowX: "hidden",
  },
  badgeWarning: {
    backgroundColor: theme.palette.warning.dark,
    color: theme.palette.text.main,
  },
  iconSettings: {},
}));

// ===========================|| PROFILE MENU ||=========================== //

const ProfileSection = () => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const customization = useSelector((state) => state.customization);

  const [sdm, setSdm] = React.useState(true);
  const [value, setValue] = React.useState("");
  const [notification, setNotification] = React.useState(false);
  const [selectedIndex] = React.useState(1);

  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
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
                    {/* <Grid container direction="column" spacing={0}>
                      <Grid item className={classes.flex}>
                        <Typography variant="h4">Good Morning,</Typography>
                        <Typography
                          component="span"
                          variant="h4"
                          className={classes.name}
                        >
                          John
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="subtitle2">
                          Project Admin
                        </Typography>
                      </Grid>
                    </Grid>
                    <OutlinedInput
                      className={classes.searchControl}
                      id="input-search-profile"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Search profile options"
                      startAdornment={
                        <InputAdornment position="start">
                          <IconSearch
                            stroke={1.5}
                            size="1.3rem"
                            className={classes.startAdornment}
                          />
                        </InputAdornment>
                      }
                      aria-describedby="search-helper-text"
                      inputProps={{
                        "aria-label": "weight",
                      }}
                    />
                    <Divider /> */}
                    {/* <Card className={classes.card}>
                        <CardContent>
                          <Grid container spacing={3} direction="column">
                            <Grid item>
                              <Grid
                                item
                                container
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Grid item>
                                  <Typography variant="subtitle1">
                                    Start DND Mode
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Switch
                                    color="primary"
                                    checked={sdm}
                                    onChange={(e) => setSdm(e.target.checked)}
                                    name="sdm"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item>
                              <Grid
                                item
                                container
                                alignItems="center"
                                justifyContent="space-between"
                              >
                                <Grid item>
                                  <Typography variant="subtitle1">
                                    Allow Notifications
                                  </Typography>
                                </Grid>
                                <Grid item>
                                  <Switch
                                    checked={notification}
                                    onChange={(e) =>
                                      setNotification(e.target.checked)
                                    }
                                    name="sdm"
                                    size="small"
                                  />
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                      <Divider /> */}
                    {/* <PerfectScrollbar className={classes.ScrollHeight}> */}
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
