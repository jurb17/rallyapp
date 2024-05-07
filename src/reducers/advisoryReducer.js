import { UPDATE_ADVISORY_UNREADCHATS } from "actions/types";

export const initialState = {
  unreadchats: {},
  unread: false,
};

const advisoryReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_ADVISORY_UNREADCHATS:
      return {
        ...state,
        unreadchats: payload.unreadchats,
        unread: payload.unread,
      };
    default:
      return state;
  }
};

export default advisoryReducer;
