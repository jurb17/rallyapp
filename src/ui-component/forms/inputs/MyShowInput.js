import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
  Badge,
} from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { InputBase } from "@mui/material";

// style constant
const useStyles = makeStyles((theme) => ({
  onHover: {
    cursor: "pointer",
  },
}));

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
helpertext = helpertext of the input
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
            onClick={props.onDelete}
            id={props.id}
          >
            <InputLabel htmlFor={props.id}>{props.id}</InputLabel>
          </Badge>
        ) : (
          <InputLabel htmlFor={props.id}>{props.label}</InputLabel>
        )}
        <InputBase
          id={props.id}
          name={props.name ? props.name : props.id}
          label={props.label}
          type={props.type ? props.type : "text"}
          value={props.value ? props.value : props.formik.values[props.id]}
          onBlur={props.onBlur ? props.onBlur : props.formik.handleBlur}
          onChange={props.onChange ? props.onChange : props.formik.handleChange}
          readOnly={props.readOnly ? props.readOnly : true}
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

export default MyTextInput;
