import { UPDATE_ADVICE_UNREADCHATS } from "actions/types";

export const initialState = {
  unreadchats: {},
  unread: false,
};

const adviceReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ADVICE_UNREADCHATS:
      return {
        ...state,
        unreadchats: payload.unreadchats,
        unread: payload.unread,
      };
    default:
      return state;
  }
};

export default adviceReducer;
