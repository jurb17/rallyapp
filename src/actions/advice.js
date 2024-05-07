import { UPDATE_ADVICE_UNREADCHATS } from "./types";
import { store } from "../store";

// client opened chat
export const clientMarksRead = (adviceid) => (dispatch) => {
  let unread;

  const chatobj = store.getState().advice.unreadchats;
  if (!!chatobj[adviceid]) {
    delete chatobj[adviceid];
  }
  if (Object.keys(chatobj) && Object.keys(chatobj).length > 0) {
    unread = true;
  } else {
    unread = false;
  }

  dispatch({
    type: UPDATE_ADVICE_UNREADCHATS,
    payload: { unreadchats: chatobj, unread: unread },
  });
};

// new advice chat message
export const newAdviceUnread = (unreadList) => (dispatch) => {
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
    type: UPDATE_ADVICE_UNREADCHATS,
    payload: { unreadchats: chatobj, unread: unread },
  });
};
