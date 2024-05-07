import { useDispatch, useSelector } from "react-redux";
import { refreshTokens } from "actions/auth";
import accountService from "services/account.service";

// pull in attributes from redux
const attributes = useSelector((state) => state.auth.attributes);

// check user attributes and run appropriate api functions.
const checkUser = () => {
  if (attributes.CUSTOMER === -1) {
    // if the attribute is awaiting user action, run the checkCustomer function.
    accountService.getStripeLinkCustomer({});
  }
  if (attributes.MERCHANT === -1) {
    // if the attribute is awaiting user action, run the checkMerchant function.
    accountService.getStripeLinkMerchant({});
  }
  if (attributes.IDENTITY === -1) {
    // if the attribute is awaiting user action, run the checkIdentity function.
    accountService.getStripeLinkIdentity({});
  }
};

// get user tokens and send a token refresh request.
export const updateUser = async () => {
  // get the user's tokens from the url
  let token;
  const currentrefresh = tokenService.getSessionRefreshToken();
  const localrefresh = tokenService.getLocalRefreshToken();
  if (!!currentrefresh) {
    token = currentrefresh;
  } else if (!!localrefresh) {
    token = localrefresh;
  }

  await tokenService.refreshTokenRequest(token).then((response) => {
    if (!!response.data.payload.success) {
      // update the user's tokens in the browser storage
      let remember = tokenService.getLocalRememberMe();
      const accesstoken = response.data.payload.tokens.accesstoken;
      const refreshtoken = response.data.payload.tokens.refreshtoken;
      // console.log("tokens", accesstoken, refreshtoken);
      useDispatch(refreshTokens(accesstoken, refreshtoken, remember));
      checkUser();
    } else {
      checkUser();
    }
  });
};
