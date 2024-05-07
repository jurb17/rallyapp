import { SET_SNACKBAR, SET_EDIT_BANNER } from "./types";

export const showSnackbar = (message, open, severity) => (dispatch) => {
  dispatch({
    type: SET_SNACKBAR,
    payload: {
      snackMessage: message,
      openSnack: open,
      snackSeverity: severity,
    },
  });
};

export const showEditBanner = (editMode, text) => (dispatch) => {
  dispatch({
    type: SET_EDIT_BANNER,
    payload: {
      editMode: editMode,
      editBannerText: text,
    },
  });
};
