import React from "react";

// material-ui
import {
  Grid,
  FormControl,
  InputLabel,
  FormHelperText,
  Select,
  MenuItem,
  ListItemText,
  Checkbox,
} from "@material-ui/core";

// constants
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// =============================================================
/*props map
xs, sm, md, lg
props.formik = formik object
props.id = id of the input
props.label = label of the input
props.value = value of the input
props.onChange = onChange function of the input
props.onBlur = onBlur function of the input
props.startAdornment = start adornment of the select
props.endAdornment = endAdornment of the select
props.inputProps = inputProps of the select
props.options = array of display values
props.idList = list of selected ids
props.helpertext = helper text
readOnly = boolean to determine if the input is read only
*/

const MyMultiSelectInput = (props) => {
  const items = props.options.map((option) => {
    return (
      <MenuItem key={option[0]} value={option[0]}>
        <Checkbox checked={props.idlist.indexOf(option[1]) !== -1} />
        <ListItemText primary={option[0]} />
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
          type="select"
          multiple
          value={
            props.value ? props.value : props.formik.values[props.id] || []
          }
          onBlur={props.onBlur ? props.onBlur : props.formik.handleBlur}
          onChange={props.onChange ? props.onChange : props.formik.handleChange}
          renderValue={(selected) => selected.join(", ")}
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

export default MyMultiSelectInput;
