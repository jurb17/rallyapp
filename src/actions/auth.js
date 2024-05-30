import { AUTH_UPDATE, AUTH_DELETE, REFRESH_TOKENS } from "./types";

import authService from "services/auth.service";
import tokenService from "services/token.service";
import { useNavigate } from "react-router";
import { showSnackbar } from "./main";
import { userRoleAttributes } from "utils/user-data-map";

// login function for all types of users.
export const login = (email, password, rememberMe, userRole) => (dispatch) => {
  // place log in credentials in global storage (localStorage is not as efficient.)

  /* USER ROLES KEY
    1: Financial Advisor
    2: Client
    3: New Financial Advisor
    4: New Client
  */
  if (userRole === 1) {
    dispatch({
      type: AUTH_UPDATE,
      payload: { ...userRoleAttributes["Financial Advisor"] },
    });
  } else if (userRole === 2) {
    dispatch({
      type: AUTH_UPDATE,
      payload: { ...userRoleAttributes.Client },
    });
  } else if (userRole === 3) {
    dispatch({
      type: AUTH_UPDATE,
      payload: { ...userRoleAttributes["New Financial Advisor"] },
    });
  } else if (userRole === 4) {
    dispatch({
      type: AUTH_UPDATE,
      payload: { ...userRoleAttributes["New Client"] },
    });
  }
  // show snackbar with "Welcome to Rally!"
  dispatch(showSnackbar("Welcome to Rally!", true, "info"));
};

// logout function for all types of users
export const logout = () => async (dispatch) => {
  // wipe global variables
  dispatch({
    type: AUTH_DELETE,
  });
  window.location.href = "/advisory/login";
  // window.location.reload();
  // redirect to login
  useNavigate("/login");
};

// onboarding function for new advisor users.
export const onboard = (link, surveyObj) => (dispatch) => {
  dispatch({
    type: AUTH_UPDATE,
    payload: { ...userRoleAttributes["New Financial Advisor"] },
  });
};

export const register =
  (firstname, lastname, email, password, token) => (dispatch) => {
    dispatch({
      type: AUTH_UPDATE,
      payload: { ...userRoleAttributes.Client },
    });
  };

// refresh tokens - NOT IN DEMO VERSION
export const refreshTokens =
  (accesstoken, refreshtoken, rememberMe) => (dispatch) => {
    if (rememberMe) {
      tokenService.updateLocalAccessToken(accesstoken);
      tokenService.updateLocalRefreshToken(refreshtoken);
    }
    tokenService.updateSessionAccessToken(accesstoken);
    tokenService.updateSessionRefreshToken(refreshtoken);
    dispatch({
      type: REFRESH_TOKENS,
      payload: { accesstoken: accesstoken, refreshtoken: refreshtoken },
    });
  };

// refresh auth tokens - NOT IN DEMO VERSION
export const refreshAuthRedux = (accesstoken, refreshtoken) => (dispatch) => {
  dispatch({
    type: REFRESH_TOKENS,
    payload: {
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    },
  });
};
