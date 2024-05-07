import React from "react";

// material-ui
import {
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
} from "@material-ui/core";

// =============================================================
/*props map
xs, sm, md, lg
formik = formik object
id = id of the input
label = label of the input
value = value of the input
onChange = onChange function of the input
onBlur = onBlur function of the input
startAdornment = start adornment of the select
endAdornment = endAdornment of the select
inputProps = inputProps of the select
options = array of display values
helpertext = helpertext of the input
readOnly = boolean to determine if the input is read only
*/

const MySelectInput = (props) => {
  const items = props.options.map((option) => {
    return (
      <MenuItem key={option} value={option}>
        {" "}
        {option}{" "}
      </MenuItem>
    );
  });

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
        <Select
          id={props.id}
          name={props.name ? props.name : props.id}
          label={props.label}
          type="text"
          defaultValue=""
          value={props.value ? props.value : props.formik.values[props.id]}
          onBlur={props.onBlur ? props.onBlur : props.formik.handleBlur}
          onChange={props.onChange ? props.onChange : props.formik.handleChange}
          startAdornment={props.startAdornment ? props.startAdornment : ""}
          endAdornment={props.endAdornment ? props.endAdornment : ""}
          inputProps={props.inputProps ? props.inputProps : {}}
          {...props}
        >
          {items}
        </Select>
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

export default MySelectInput;
