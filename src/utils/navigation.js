import tokenService from "services/token.service";
import jwt_decode from "jwt-decode";
import { createSearchParams } from "react-router-dom";

// function to redirect user to a page based on their attributes.
export const attributesNavigation = (navigate, location, paramsObject) => {
  // Get the attributes of the current access token in session storage.
  const decodedSessionAccess = jwt_decode(tokenService.getSessionAccessToken());
  const sessionAttr = decodedSessionAccess.attributes;
  const survey = tokenService.getSessionSurvey();

  // if there is no location object passed in, then create an empty object.
  if (!location) {
    location = { pathname: "/" };
  }

  // if the user has outstanding surveys, redirect to /onboarding
  if (
    sessionAttr.ACCOUNT === -1 &&
    Object.entries(survey).length > 0 &&
    !location.pathname.includes("/onboarding")
  ) {
    // if there are query params and one of the params is "firmslug", then redirect to firm request page.
    if (!!paramsObject && !!paramsObject.firmslug) {
      navigate({
        pathname: "/client/advisors/new",
        search: `?${createSearchParams({ firmslug: paramsObject.firmslug })}`,
      });
    }
    // if there is no firmslug query param, then redirect to the onboarding page.
    else {
      navigate("/onboarding");
    }
  } else if (
    sessionAttr.ACCOUNT === 1 &&
    sessionAttr.ADVISOR === 1 &&
    sessionAttr.RIA === 1
  ) {
    navigate("/adv");
  } else if (sessionAttr.ACCOUNT === 1 && sessionAttr.CUSTOMER === 1) {
    navigate("/client");
  }
  // if the user has advisor credentials, redirect to /adv
  else if (
    sessionAttr.ACCOUNT === 1 &&
    sessionAttr.ADVISOR !== 0 &&
    sessionAttr.RIA !== 0
  ) {
    navigate("/adv");
  }
  // if the user has customer credentials, redirect to /client
  else if (
    sessionAttr.ACCOUNT === 1
    // && sessionAttr.CUSTOMER !== 0
  ) {
    navigate("/client");
  }
  // otherwise, throw them to the wolves and see what happens
  else if (!location.pathname.includes("/login")) {
    navigate("/");
  }
};
