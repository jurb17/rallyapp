import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Badge,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";

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
onChange = function to handle change
onBlur = function to handle blur
startAdornment = start adornment of the select
endAdornment = endAdornment of the select
inputProps = inputProps onject of the select
helpertext = helpertext string  of the select
deletable = boolean to determine if the input is deletable
handledelete = function to handle delete
readOnly = boolean to determine if the input is read only
*/

const MyTextInput = (props) => {
  const classes = useStyles();

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
        {props.deletable ? (
          <Badge
            badgeContent={
              <div className={classes.onHover}>
                <Cancel color="error" />
              </div>
            }
            onClick={props.handledelete}
            id={props.id}
          >
            <InputLabel htmlFor={props.id}>{props.id}</InputLabel>
          </Badge>
        ) : (
          <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
        )}
        <OutlinedInput
          id={props.id}
          name={props.name ? props.name : props.id}
          label={props.label}
          type="text"
          value={props.value ? props.value : props.formik.values[props.id]}
          onBlur={props.onBlur ? props.onBlur : props.formik.handleBlur}
          onChange={props.onChange ? props.onChange : props.formik.handleChange}
          startAdornment={props.startAdornment ? props.startAdornment : ""}
          endAdornment={props.endAdornment ? props.endAdornment : ""}
          inputProps={props.inputProps ? props.inputProps : {}}
        />
        {!props.readOnly &&
          props.formik.touched[props.id] &&
          props.formik.errors[props.id] && (
            <FormHelperText>{props.formik.errors[props.id]}</FormHelperText>
          )}
        {props.helpertext && (
          <FormHelperText>{props.helpertext}</FormHelperText>
        )}
        {props.children}
      </FormControl>
    </Grid>
  );
};

export default MyTextInput;
