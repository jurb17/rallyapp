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
  const sessionuser = tokenService.getSessionUser();
  const localuser = tokenService.getLocalUser();

  // Evaluate global state.
  const auth = useSelector((state) => state.auth);

  // Evaluate query params
  const queryParams = new URLSearchParams(location.search);

  // Track the path taken by the user and the user's tokens.
  // console.log("location", location.pathname);
  // console.log("tokens", sessionuser, localuser, auth);

  useEffect(() => {
    // if the user does not have any user object in session or local storage, and the path is not /login or /signup or /register...
    if (
      !sessionuser &&
      !localuser &&
      !location.pathname.includes("/login") &&
      !location.pathname.includes("/signup") &&
      !location.pathname.includes("/register")
    ) {
      // if the pathname includes /advisors/new and there is a query param called firmslug
      if (
        !!location.pathname.includes("/advisors/new") &&
        !!queryParams.has("firmslug")
      ) {
        // update the query param string here to whatever is inside of the url after the prospect selects the "Message" button.
        const firmParam = queryParams.get("firmslug").replaceAll('"', "");
        navigate({
          pathname: "/signup",
          search: `?${createSearchParams({ firmslug: firmParam })}`,
        });
      } else {
        navigate("/login");
      }
    }
    // if the user does not have a session user object, but has a local user object, then refresh the session storage with the local storage object.
    else if (
      !sessionuser &&
      !!localuser &&
      !!localuser.accesstoken &&
      !!localuser.refreshtoken &&
      !location.pathname.includes("/register")
    ) {
      dispatch(
        refreshTokens(localuser.accesstoken, localuser.refreshtoken, true)
      );
    }
    // if there is a session user object and there is no auth object or auth accesstoken, then update the auth object.
    else if (
      !!sessionuser &&
      !!sessionuser.accesstoken &&
      !!sessionuser.refreshtoken &&
      (!auth ||
        !auth.attributes ||
        !auth.accesstoken ||
        auth.accesstoken !== sessionuser.accesstoken) &&
      !location.pathname.includes("/register")
    ) {
      let remember;
      // assign the remember attribute to a new variable to prevent an error if the local storage object is missing.
      if (!!localuser && !!localuser.rememberMe) {
        remember = localuser.rememberMe;
      } else {
        remember = false;
      }
      dispatch(
        refreshTokens(
          sessionuser.accesstoken,
          sessionuser.refreshtoken,
          remember
        )
      );
    }
    // otherwise, continue to the path specified.
    else {
      console.log("User is authenticated and global state in sync.");
    }
  }, []);

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
