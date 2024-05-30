import jwt_decode from "jwt-decode";

import { AUTH_UPDATE, AUTH_DELETE, REFRESH_TOKENS } from "actions/types";

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
    case AUTH_UPDATE:
      return {
        ...state,
        accesstoken: payload.accesstoken,
        refreshtoken: payload.refreshtoken,
        survey: payload.survey,
        attributes: payload.attributes,
        // attributes: jwt_decode(payload.accesstoken).attributes,
        // accessToken: jwt_decode(payload.accesstoken).accessToken,
        rememberMe: payload.rememberMe,
      };
    case AUTH_DELETE:
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
