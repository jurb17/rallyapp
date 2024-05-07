import React from "react";

// material-ui
import {
  Grid,
  FormControl,
  FormHelperText,
  TextField,
} from "@material-ui/core";
import { DatePicker, LocalizationProvider } from "@material-ui/lab";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";

// =============================================================
/* props map
xs, sm, md, lg
formik = formik object
id = name for data variable
label = string for interface display
value = value of input
onChange = function to handle change
onBlur = function to handle blur
placement = placement of the datepicker
calendarString = if true, the date will be formatted to a string
readOnly = boolean to determine if the input is read only
helpertext = string to display as helper text
*/

const MyDateInput = (props) => {
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            key={props.id}
            id={props.id}
            name={props.name ? props.name : props.id}
            label={props.label}
            type="date"
            openTo="day"
            value={props.value ? props.value : props.formik.values[props.id]}
            onBlur={props.onBlur ? props.onBlur : props.formik.handleBlur}
            onChange={(date) => {
              let submitdate = date;
              if (props.calendarString) {
                submitdate = date.toLocaleDateString("en-US");
              }
              if (props.onChange) {
                props.onChange(submitdate);
              } else {
                props.formik.handleChange(submitdate);
              }
            }}
            placement={props.placement ? props.placement : "bottom"}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
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

export default MyDateInput;
