import React from "react";

// material-ui
import { ButtonBase } from "@material-ui/core";

// project imports
import Logo from "ui-component/Logo";

// ===========================|| MAIN LOGO ||=========================== //

const LogoSection = () => {
  return (
    <ButtonBase
      disableRipple
      onClick={() => {
        window.location.href = "https://rally.markets";
      }}
    >
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
