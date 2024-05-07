import { UPDATE_ADVISORY_UNREADCHATS } from "./types";
import { store } from "../store";

// advisor opened chat
export const advisorMarksRead = (adviceid) => (dispatch) => {
  let unread;

  const chatobj = store.getState().advisory.unreadchats;
  if (!!chatobj[adviceid]) {
    delete chatobj[adviceid];
  }
  if (Object.keys(chatobj) && Object.keys(chatobj).length > 0) {
    unread = true;
  } else {
    unread = false;
  }

  dispatch({
    type: UPDATE_ADVISORY_UNREADCHATS,
    payload: { unreadchats: chatobj, unread: unread },
  });
};

// new advisory chat message
export const newAdvisoryUnread = (unreadList) => (dispatch) => {
  let unread;
  let chatobj = {};

  unreadList.forEach((item) => {
    chatobj[item.adviceid] = item.timestamp;
  });

  if (Object.keys(chatobj) && Object.keys(chatobj).length > 0) {
    unread = true;
  } else {
    unread = false;
  }

  dispatch({
    type: UPDATE_ADVISORY_UNREADCHATS,
    payload: { unreadchats: chatobj, unread: unread },
  });
};
