import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useRoutes,
  useNavigate,
  useLocation,
  createSearchParams,
} from "react-router-dom";

// material ui and themes
import themes from "./themes";
import { ThemeProvider } from "@material-ui/core/styles";
import { CssBaseline, StyledEngineProvider } from "@material-ui/core";

// routing
import routes from "./routes";

// project imports
import NavigationScroll from "./layout/NavigationScroll";
import tokenService from "services/token.service";
import { refreshTokens, login } from "actions/auth";

// ===========================|| APP ||=========================== //

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Evaluate the tokens using browser storage.
  const sessionuser = tokenService.getSessionUser();
  const localuser = tokenService.getLocalUser();

  // Evaluate global state.
  const auth = useSelector((state) => state.auth);

  // Evaluate query params
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    // if there is no localuser object, sessionuser object, or global access token variable, then go to login page.
    if (!localuser && !sessionuser && !auth.accesstoken) navigate("/login");
    // if there is a localuser object, but no sessionuser object or global access token, then use localuser to update other states.
    else if (localuser && !sessionuser && !auth.accesstoken) {
      dispatch(
        login(localuser.email, "local_update", false, localuser.userRole)
      );
      console.log("Local update. User details remembered.");
    }
    // if there is a session user, but no global variables, then update global state.
    else if (sessionuser && !auth.accesstoken) {
      dispatch(
        login(sessionuser.email, "session_update", false, sessionuser.userRole)
      );
      console.log("Session update.");
    }
    // else: navigate to the route in url bar.
    else console.log("User is authenticated and global state is in sync.");
  }, [localuser, sessionuser, auth.accesstoken]);

  const routing = useRoutes(routes(location.pathname));
  const customization = useSelector((state) => state.customization);
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <NavigationScroll>{routing}</NavigationScroll>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export default App;
