import React from "react";

// material-ui
import { ButtonBase } from "@material-ui/core";

// project imports
import Logo from "ui-component/Logo";
import { useNavigate } from "react-router";

// ===========================|| MAIN LOGO ||=========================== //

const LogoSection = () => {
  const navigate = useNavigate();

  return (
    <ButtonBase disableRipple onClick={() => navigate("/")}>
      <Logo />
    </ButtonBase>
  );
};

export default LogoSection;
