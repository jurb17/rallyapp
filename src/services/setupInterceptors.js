import axiosInstance from "./api";
import tokenService from "./token.service";
import { refreshTokens, logout } from "../actions/auth";
import config from "../config";

const setup = (store) => {
  // rename the config from the config file so it does not conflict with the interceptors config variable
  const adminconfig = config;

  axiosInstance.interceptors.request.use(
    (config) => {
      let token = "";
      // if there is no request url, log out the user.
      if (!config.url) {
        // alert("Missing request URL. Please log back in.");
        dispatch(logout());
        return Promise.reject();
      }
      // if the request url is "/logout" then use the refresh tokens for the request and reload the page.
      else if (config.url.includes("/account/logout/")) {
        const sessionRefresh = tokenService.getSessionRefreshToken();
        const localRefresh = tokenService.getLocalRefreshToken();
        if (!!sessionRefresh) {
          token = sessionRefresh;
        } else if (!!localRefresh) {
          token = localRefresh;
        } else {
          // no refresh token, so reroute to login
          window.location.href = "/";
          window.location.reload();
        }
      }
      // otherwise, use the access token for the request.
      else {
        token = tokenService.getSessionAccessToken();
      }
      // if there is a token, then add it to the headers of the request.
      if (token) {
        config.headers["Authorization"] = "Bearer " + token; // for Spring Boot back-end
        // only print the request details if in development mode.
        if (!!adminconfig.printrequestresponse) {
          console.log("interceptors.request.use", config);
        }
        return config;
      }
      // if there is no token and in development mode, then print the request details.
      else {
        if (!!adminconfig.printrequestresponse) {
          console.log("interceptors.request.use", config);
        }
        return config;
      }
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  const { dispatch } = store;
  axiosInstance.interceptors.response.use(
    (response) => {
      // if in development mode, print the request details.
      if (!!adminconfig.printrequestresponse) {
        console.log("interceptors.response.use", response);
      }
      return response;
    },
    (error) => {
      let token = "";
      const originalConfig = error.config;
      const sessionRefresh = tokenService.getSessionRefreshToken();
      const localRefresh = tokenService.getLocalRefreshToken();
      // if there is a refresh token in the session storage, use it. Otherwise, use the local storage refresh token.
      if (!!sessionRefresh) {
        token = sessionRefresh;
      } else if (!!localRefresh) {
        token = localRefresh;
      }

      // if the request is a login or chat list update, then don't try to refresh the token
      if (
        !["/account/login/", "/advice/updates/"].includes(originalConfig.url) &&
        error.response.status === 403
      ) {
        // if the access token is expired and we have not tried to refresh it, then refresh the token
        if (!!originalConfig._retry) {
          alert("refresh failed. logging you out.");
          dispatch(logout());
        } else {
          // set "retry" equal to true, since this will be our one retry at refreshing the tokens.
          originalConfig._retry = true;
          // REFRESH THE TOKENS
          return tokenService
            .refreshTokenRequest(token)
            .then((response) => {
              if (response.data.payload.success) {
                const { accesstoken, refreshtoken } =
                  response.data.payload.tokens;
                const rememberMe = tokenService.getLocalRememberMe();
                // if successful, update the browser storage and redux state with new tokens.
                dispatch(refreshTokens(accesstoken, refreshtoken, rememberMe));
                return axiosInstance(originalConfig);
              } else {
                console.log(response.data.details.text);
                // alert(
                //   "Your session has expired. Check the console for error message. Logging you out."
                // );
                // if not successful, log the user out.
                dispatch(logout());
                return Promise.reject(response);
              }
            })
            .catch((error) => {
              console.log("uncaught error", error);
              // alert("Could not refresh tokens. Logging you out.");
              // if there is an error in the API call, log the user out.
              dispatch(logout());
              return Promise.reject(response);
            });
        }
      }

      return Promise.reject(error);
    }
  );
};

export default setup;
