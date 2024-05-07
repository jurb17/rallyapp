import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER,
  REFRESH_TOKENS,
} from "./types";

import authService from "services/auth.service";
import tokenService from "services/token.service";
import { useNavigate } from "react-router";
import { showSnackbar } from "./main";

export const register =
  (firstname, lastname, email, password, token) => (dispatch) => {
    return authService
      .register(firstname, lastname, email, password, token)
      .then(
        (response) => {
          dispatch({
            type: REGISTER_SUCCESS,
            payload: {
              ...response.data.payload.tokens,
              survey: response.data.payload.survey,
            },
          });

          return Promise.resolve(response);
          // return response;
        },
        (error) => {
          dispatch({
            type: REGISTER_FAIL,
          });

          return Promise.reject(error);
          // return error;
        }
      );
  };

export const login = (email, password, rememberMe) => (dispatch) => {
  return authService.login(email, password, rememberMe).then(
    (response) => {
      if (!!response.isAxiosError) {
        dispatch(
          showSnackbar(response.response.data.details.text, true, "error")
        );
        return response;
      } else {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
            rememberMe: rememberMe,
          },
        });
      }

      return Promise.resolve(response);
      // return response;
    },
    (error) => {
      dispatch({
        type: LOGIN_FAIL,
      });

      return Promise.reject(error);
      // return error;
    }
  );
};

export const onboard = (link, surveyObj) => (dispatch) => {
  // console.log("onboard", link, surveyObj);
  // $$$ should this Promise line be deleted?
  return new Promise((resolve, reject) => {
    return authService.onboard(link, surveyObj).then(
      (response) => {
        dispatch({
          type: REGISTER_SUCCESS,
          payload: {
            ...response.data.payload.tokens,
            // survey: response.data.payload.survey,
            survey: {},
          },
        });

        return Promise.resolve(response);
        // return response;
      },
      (error) => {
        dispatch({
          type: LOGIN_FAIL,
        });
        useNavigate("/login");

        return Promise.reject(error);
        // return error;
      }
    );
  });
};

export const logout = () => async (dispatch) => {
  // kick tokens in the back end, then remove from local storage and redirect to login
  return authService
    .logout()
    .then((response) => {
      tokenService.removeUser();
      dispatch({
        type: LOGOUT_USER,
      });
      window.location.href = "/advisory/login";
      // window.location.reload();
      useNavigate("/login");
      return Promise.resolve(response);
    })
    .catch((error) => {
      console.log("error", error);
      tokenService.removeUser();
      dispatch({
        type: LOGOUT_USER,
      });
      window.location.href = "/advisory/login";
      // window.location.reload();
      useNavigate("/login");
      return Promise.reject(error);
    });
};

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

export const refreshAuthRedux = (accesstoken, refreshtoken) => (dispatch) => {
  dispatch({
    type: REFRESH_TOKENS,
    payload: {
      accesstoken: accesstoken,
      refreshtoken: refreshtoken,
    },
  });
};
