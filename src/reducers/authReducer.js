import jwt_decode from "jwt-decode";

import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT_USER,
  REFRESH_TOKENS,
} from "actions/types";

export const initialState = {
  accesstoken: "",
  refreshtoken: "",
  survey: {},
  attributes: {},
  rememberMe: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      return {
        ...state,
        accesstoken: payload.accesstoken,
        refreshtoken: payload.refreshtoken,
        survey: payload.survey,
        attributes: jwt_decode(payload.accesstoken).attributes,
        accessToken: jwt_decode(payload.accesstoken).accessToken,
      };
    case REGISTER_FAIL:
      return {
        ...state,
        ...initialState,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        accesstoken: payload.accesstoken,
        refreshtoken: payload.refreshtoken,
        survey: payload.survey,
        attributes: jwt_decode(payload.accesstoken).attributes,
        accessToken: jwt_decode(payload.accesstoken).accessToken,
        rememberMe: payload.rememberMe,
      };
    case LOGIN_FAIL:
      return {
        ...state,
        ...initialState,
      };
    case LOGOUT_USER:
      return {
        ...state,
        ...initialState,
      };
    case REFRESH_TOKENS:
      return {
        ...state,
        accesstoken: payload.accesstoken,
        refreshtoken: payload.refreshtoken,
        survey: state.survey,
        attributes: jwt_decode(payload.accesstoken).attributes,
        accessToken: jwt_decode(payload.accesstoken).accessToken,
      };
    default:
      return state;
  }
}
