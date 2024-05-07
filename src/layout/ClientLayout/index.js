import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Outlet,
  useNavigate,
  useLocation,
  createSearchParams,
} from "react-router-dom";

// project imports
import Customization from "../Customization";
import { SET_MENU } from "../../actions/types";
import tokenService from "services/token.service";

// ======================================================

const ClientLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // auth data from global state
  const auth = useSelector((state) => state.auth);

  // check the session storage for the survey
  const survey = tokenService.getSessionSurvey();

  // check query params for success
  const query = new URLSearchParams(location.search);
  const success = query.get("success");
  const firmParam = query.get("firmslug");

  useEffect(() => {
    // If there are no attributes, let the system update them on the first render.
    if (
      Object.entries(auth.attributes).length === 0 &&
      location.pathname !== "/login"
    ) {
      console.log("loading attributes...");
    }
    // If there is a firmslug, then navigate to the firm request page.
    else if (!!firmParam) {
      navigate({
        pathname: "/client/advisors/new",
        search: `?${createSearchParams({ firmslug: firmParam })}`,
      });
    }
    // If ACCOUNT attribute is -1, then the user needs to route to the onboarding page.
    else if (
      auth.attributes.ACCOUNT === -1 &&
      Object.entries(survey).length > 0 &&
      !location.pathname.includes("/onboarding")
    ) {
      navigate("/onboarding");
    }
  }, [auth.attributes]);

  return (
    <>
      <Outlet />
      <Customization />
    </>
  );
};

export default ClientLayout;
