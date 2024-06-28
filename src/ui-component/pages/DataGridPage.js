import React from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { DataGrid } from "@mui/x-data-grid";
import { Grid } from "@material-ui/core";

// style constant
const useStyles = makeStyles((theme) => ({
  dataGrid: {
    display: "flex",
    height: "72vh",
    width: "100%",
    backgroundColor: "white",
    borderColor: theme.palette.primary.main,
    borderRadius: "8px",
    padding: "0px",
    flexGrow: 1,
  },
}));

// =============================================================
/* PROPS MAP
rows = data list
columns = constructed list for DataGrid component
rowLink = link to navigate to when a row is selected.
noDataMessage = string value to display when there is no data.
addStateData = object that includes data to be added to the state object.
height = specifies a height for the DataGrid component
xs, sm, md, lg = specifies the Grid size according to the window size.
*/
const DataGridPage = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();

  // define function to handle row click -> navigate to payment profile.
  const rowSelectHandler = (data) => {
    let newData = data;
    if (props.addStateData) newData = { ...newData, ...props.addStateData };
    if (data.selectionroute.indexOf("https://www.rally.markets") > -1)
      window.location.href = data.selectionroute;
    else navigate(data.selectionroute);
  };

  // display button to create new user and table of payments.
  return (
    <Grid
      item
      className={classes.dataGrid}
      height={props.height ? props.height : "65vh"}
      flexGrow={1}
      xs={props.xs ? props.xs : 12}
      sm={props.sm ? props.sm : 12}
      md={props.md ? props.md : 12}
      lg={props.lg ? props.lg : 12}
    >
      <DataGrid
        maxNumberofRows={15}
        maxNumberOfColumns={5}
        rows={props.rows}
        getRowId={props.getRowId ? props.getRowId : (row) => row.id}
        columns={props.columns}
        onRowClick={
          props.noRowClick
            ? null
            : (row) => {
                rowSelectHandler({ ...row.row });
              }
        }
        width="100%"
        cursor="pointer"
        sx={{
          border: 1,
          borderColor: theme.palette.grey[300],
          "& .MuiDataGrid-row:hover": props.noRowClick
            ? {}
            : {
                color: "primary.main",
                backgroundColor: "primary.light",
              },
        }}
      />
    </Grid>
  );
};

export default DataGridPage;
