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
import { refreshTokens } from "actions/auth";

// ===========================|| APP ||=========================== //

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Evaluate the tokens using browser storage.
  // @@@ Will have to look at if the user is remembered after the session
  // const sessionuser = tokenService.getSessionUser();
  // const localuser = tokenService.getLocalUser();

  // Evaluate global state.
  const auth = useSelector((state) => state.auth);

  // Evaluate query params
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    // if there is no accesstoken in the auth global state, then route the user back to the login page.
    console.log("APP.JS", auth);
    if (!auth.accesstoken) navigate("/login");
    // otherwise, continue to the path specified.
    else console.log("User is authenticated and global state in sync.");
  }, [auth.accesstoken]);

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
