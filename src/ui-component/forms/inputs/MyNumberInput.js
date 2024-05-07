import React from "react";

// material-ui
import {
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
} from "@material-ui/core";

// =============================================================
/*props map
xs, sm, md, lg
formik = formik object
id = id string of the input
label = label string of the input
value = value of the input
onChange = function to be called on change
onBlur = function to be called on blur
startAdornment = start adornment of the select
endAdornment = endAdornment of the select
inputProps = inputProps object of the select
helpertext = helpertext string of the input
readOnly = boolean to determine if the input is read only
*/

const MyNumberInput = (props) => {
  return (
    <Grid
      item
      xs={props.xs ? props.xs : "12"}
      sm={props.sm ? props.sm : null}
      md={props.md ? props.md : null}
      lg={props.lg ? props.lg : null}
    >
      <FormControl
        fullWidth
        error={Boolean(
          !props.readOnly &&
            props.formik.touched[props.id] &&
            props.formik.errors[props.id]
        )}
        variant="outlined"
      >
        <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
        <OutlinedInput
          id={props.id}
          name={props.name ? props.name : props.id}
          label={props.label}
          type="number"
          value={props.value ? props.value : props.formik.values[props.id]}
          onBlur={props.onBlur ? props.onBlur : props.formik.handleBlur}
          onChange={props.onChange ? props.onChange : props.formik.handleChange}
          startAdornment={props.startAdornment ? props.startAdornment : ""}
          endAdornment={props.endAdornment ? props.endAdornment : ""}
          inputProps={props.inputProps ? props.inputProps : {}}
          {...props}
        />
        {!props.readOnly &&
          props.formik.touched[props.id] &&
          props.formik.errors[props.id] && (
            <FormHelperText>{props.formik.errors[props.id]}</FormHelperText>
          )}
        {props.helpertext && (
          <FormHelperText>{props.helpertext}</FormHelperText>
        )}
      </FormControl>
    </Grid>
  );
};

export default MyNumberInput;
