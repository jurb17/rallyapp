import React from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, IconButton } from "@material-ui/core";
import { IconArrowLeft } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  iconStyle: {
    marginRight: theme.spacing(1),
  },
}));

// ===============================================================
/* PROPS MAP
backlink = string defining a path to return to.
*/

const BackButton = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box className={classes.iconStyle} sx={{ flexShrink: 0 }}>
      <IconButton
        size={"medium"}
        onClick={() => {
          if (!!props.handleBack) props.handleBack();
          else if (!!props.backlink) navigate(props.backlink);
          else navigate(-1);
        }}
      >
        <IconArrowLeft color={theme.palette.primary.main} />
      </IconButton>
    </Box>
  );
};

export default BackButton;
