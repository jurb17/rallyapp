import React from "react";

// material-ui
import { Grid, Box } from "@material-ui/core";

// local
import DynamicButton from "ui-component/buttons/DynamicButton";

// ==============================================================
/* PROPS MAP
buttonlist = object of buttons to display with style and function properties
*/

const CustomButtonGroup = (props) => {
  return (
    <Grid item display="flex" alignItems="center" flexGrow={0} {...props}>
      {!!props.buttonlist &&
        props.buttonlist.map((button) => {
          return (
            <DynamicButton
              key={Math.random()}
              name={button.name}
              type={button.type}
              color={button.color}
              variant={button.variant}
              startIcon={button.startIcon}
              endIcon={button.endIcon}
              onClick={button.onClick}
              disabled={button.disabled}
              icon={button.iconButton}
              component={button.component}
              size={button.size}
            />
          );
        })}
    </Grid>
  );
};

export default CustomButtonGroup;
