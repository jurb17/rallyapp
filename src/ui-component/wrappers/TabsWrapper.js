import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Tabs, Tab, Grid } from "@material-ui/core";
import { TabContext, TabPanel } from "@material-ui/lab";

// style constant
const useStyles = makeStyles((theme) => ({
  tabsHeader: {
    alignSelf: "center",
    fontSize: "1.250rem",
    fontWeight: 800,
  },
  tabFont: {
    fontSize: "0.825rem",
    fontWeight: 800,
  },
}));

// ==============================================================
// PROPS MAP
// sections: array of strings
// componentList: array of components

const FormWrapper = (props) => {
  const classes = useStyles();

  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    props.handleTabChange(newValue);
  };

  return (
    <Grid container sx={{ justifyContent: "center", mt: 0 }}>
      <TabContext value={value}>
        <Tabs
          value={value}
          onChange={handleChange}
          className={classes.tabsHeader}
          sx={{ mb: -1 }}
        >
          {props.sections.map((section, index) => (
            <Tab
              label={section}
              key={index}
              value={index + 1}
              className={classes.tabFont}
            />
          ))}
        </Tabs>
        {props.componentList.map((Component, index) => {
          return (
            <Grid item xs={12} md={12} sm={12} sx={{ m: 0 }}>
              <TabPanel key={index} value={index + 1}>
                {Component}
              </TabPanel>
            </Grid>
          );
        })}
      </TabContext>
    </Grid>
  );
};

export default FormWrapper;
