import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Outlet } from "react-router-dom";

// project imports
import Customization from "../Customization";

// ======================================================

const AdvisorLayout = () => {
  const location = useLocation();

  // auth data from storage and global state
  const auth = useSelector((state) => state.auth);

  // check query params for success
  const query = new URLSearchParams(location.search);
  const success = query.get("success");

  useEffect(() => {
    // If there are no attributes, let the system update them on the first render.
    if (
      Object.entries(auth.attributes).length === 0 &&
      location.pathname !== "/login"
    )
      console.log("loading attributes...");
    // If the ACCOUNT attribute is -1 and ADVISOR or RIA is -1, then the user needs to route to the onboarding page.
    else if (
      auth.attributes.ACCOUNT === -1 &&
      (auth.attributes.ADVISOR === -1 || auth.attributes.RIA === -1) &&
      !location.pathname.includes("/onboarding")
    )
      navigate("/onboarding");
  }, [auth.attributes]);

  return (
    <>
      <Outlet />
      <Customization />
    </>
  );
};

export default AdvisorLayout;
