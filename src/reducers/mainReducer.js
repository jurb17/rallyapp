import { SET_SNACKBAR, SET_EDIT_BANNER } from "actions/types";

export const initialState = {
  snackMessage: "",
  openSnack: false,
  snackSeverity: "warning",
  editMode: false,
  editBannerText: "",
};

const mainReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case SET_SNACKBAR:
      return {
        ...state,
        snackMessage: payload.snackMessage,
        openSnack: payload.openSnack,
        snackSeverity: payload.snackSeverity,
      };
    case SET_EDIT_BANNER:
      return {
        ...state,
        editMode: payload.editMode,
        editBannerText: payload.editBannerText,
      };
    default:
      return state;
  }
};

export default mainReducer;
