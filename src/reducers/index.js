import customizationReducer from "./customizationReducer";
import authReducer from "./authReducer";
import adviceReducer from "./adviceReducer";
import advisoryReducer from "./advisoryReducer";
import mainReducer from "./mainReducer";
import { combineReducers } from "redux";

export default combineReducers({
  customization: customizationReducer,
  auth: authReducer,
  advice: adviceReducer,
  advisory: advisoryReducer,
  main: mainReducer,
});
