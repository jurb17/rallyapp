import React from "react";

// mui imports
import { useTheme } from "@emotion/react";
import { Chip } from "@material-ui/core";

// =====================================================
/* PROPS MAP
id = string for subcategory id
label = string for subcategory name
onClick = function to call when button is clicked
*/

const SubcategoryButton = (props) => {
  const theme = useTheme();

  return (
    <Chip
      key={props.id}
      id={props.id}
      label={props.label}
      onClick={props.onClick}
      sx={{
        m: 1,
        backgroundColor: theme.palette.secondary.main,
        fontSize: "1rem",
        fontWeight: "bold",
        height: "2.5rem",
        borderRadius: "1.25rem",
        padding: "0.5rem 0.5rem",
        "&:hover": {
          backgroundColor: theme.palette.secondary.dark,
        },
      }}
      style={
        props.selected
          ? {
              backgroundColor: theme.palette.secondary.dark,
            }
          : {}
      }
    />
  );
};

export default SubcategoryButton;
