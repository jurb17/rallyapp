import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  FormControl,
  FormHelperText,
  InputLabel,
  InputBase,
} from "@material-ui/core";

// style constant
const useStyles = makeStyles((theme) => ({
  onHover: {
    cursor: "pointer",
  },
}));

// =============================================================
/*PROPS MAP
xs, sm, md, lg
formik = formik object
id = id of the input
label = label of the input
value = value of the input
onBlur = function to handle blur
startAdornment = start adornment of the select
endAdornment = endAdornment of the select
inputProps = inputProps onject of the select
helpertext = helpertext string  of the select 
*/

const MyInputBase = (props) => {
  const classes = useStyles();

  return (
    <Grid
      item
      xs={props.xs ? props.xs : "12"}
      sm={props.sm ? props.sm : null}
      md={props.md ? props.md : null}
      lg={props.lg ? props.lg : null}
    >
      <FormControl fullWidth variant="standard">
        <InputLabel
          htmlFor={props.id}
          sx={{ marginBottom: 2, paddingBottom: 2 }}
        >
          {props.label}
        </InputLabel>
        <InputBase
          id={props.id}
          name={props.name ? props.name : props.id}
          label={props.label}
          type="text"
          value={props.value ? props.value : props.formik.values[props.id]}
          startAdornment={props.startAdornment ? props.startAdornment : ""}
          endAdornment={props.endAdornment ? props.endAdornment : ""}
          inputProps={props.inputProps ? props.inputProps : {}}
          sx={{
            paddingTop: 2,
          }}
          {...props}
        />
        {props.helpertext && (
          <FormHelperText>{props.helpertext}</FormHelperText>
        )}
        {props.children}
      </FormControl>
    </Grid>
  );
};

export default MyInputBase;
