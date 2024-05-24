import tokenService from "services/token.service";
import jwt_decode from "jwt-decode";
import { createSearchParams } from "react-router-dom";

/* READ ME
This a centralized navigation file based on a user's attributes.
Based on a user's attributes, the user will be navigated to the appropriate page in the web app.
*/

/* NO-API CHANGES
Every reference of this function could be replaced in-line with the appropriate navigation path.
Or all references of the function can be kept and a parameter can be added to the function
  that simulates the values of attributes collected from a session access token.
*/

// function to redirect user to a page based on their attributes.
export const attributesNavigation = (
  navigate,
  location,
  paramsObject,
  userRole
) => {
  // Get the attributes of the current access token in session storage.
  // const decodedSessionAccess = jwt_decode(tokenService.getSessionAccessToken());
  // const sessionAttr = decodedSessionAccess.attributes;
  // const survey = tokenService.getSessionSurvey();

  /* USER ROLES KEY
    1: Financial Advisor
    2: Client
    3: New Financial Advisor
    4: New Client
  */

  console.log("made it to navigation.");

  // if there is no location object passed in, then create an empty object.
  if (!location) {
    location = { pathname: "/" };
  }

  if (!userRole) {
    navigate("/login");
  } else {
    // if userRole == existing advisor, go to /adv and provide dummy attributes
    if (userRole == 1) {
      navigate("/adv");
    }

    // if userRole == existing client, go to /client
    if (userRole == 2) {
      navigate("/client");
    }

    // if use selects "New Advisor" on the login page or if the
    if (userRole == 3) {
      navigate("/onboarding");
    }

    // if userRole == new client, go to /register (or wherever you're supposed to)
    if (userRole == 4) {
      navigate("/register");
    }
  }

  // // if the user has outstanding surveys, redirect to /onboarding
  // if (
  //   sessionAttr.ACCOUNT === -1 &&
  //   Object.entries(survey).length > 0 &&
  //   !location.pathname.includes("/onboarding")
  // ) {
  //   // if there are query params and one of the params is "firmslug", then redirect to firm request page.
  //   if (!!paramsObject && paramsObject.firmslug) {
  //     navigate({
  //       pathname: "/client/advisors/new",
  //       search: `?${createSearchParams({ firmslug: paramsObject.firmslug })}`,
  //     });
  //   }
  //   // if there is no firmslug query param, then redirect to the onboarding page.
  //   else {
  //     navigate("/onboarding");
  //   }
  // }
  // // otherwise, throw them to the wolves and see what happens
  // else if (!location.pathname.includes("/login")) {
  //   navigate("/");
  // }
};
