import * as React from "react";

// mui imports
import { useTheme } from "@material-ui/styles";
import { Paper, InputBase, Divider, IconButton } from "@material-ui/core";
import { MenuIcon, Search, Cancel } from "@material-ui/icons";

// ===========================================================================
/* PROPS MAP
handleSearch = function to handle retrieving the search results given the user input
handleCancel = function for cancelling the filter of list data
*/

export default function CustomizedInputBase(props) {
  const theme = useTheme();
  const [searchInput, setSearchInput] = React.useState("");

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const handleSearch = () => {
    props.handleSearch(searchInput);
  };

  const handleCancel = () => {
    props.handleCancel();
    setSearchInput("");
  };

  return (
    <Paper
      component="form"
      elevation={0}
      variant="outlined"
      sx={{
        p: "2px 4px 2px 8px",
        display: "flex",
        alignItems: "center",
        borderColor: theme.palette.grey[300],
        borderRadius: "4px",
      }}
    >
      {/* <IconButton sx={{ p: "10px" }} aria-label="menu">
        <MenuIcon />
      </IconButton> */}
      <InputBase
        sx={{ flex: 1 }}
        placeholder="Search Name"
        value={searchInput}
        onChange={handleChange}
        inputProps={{ "aria-label": "search" }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
          }
        }}
      />
      <IconButton onClick={handleSearch} sx={{ p: "10px" }} aria-label="search">
        <Search />
      </IconButton>
      <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      <IconButton
        onClick={handleCancel}
        color="primary"
        sx={{ p: "10px" }}
        aria-label="cancel"
      >
        <Cancel />
      </IconButton>
    </Paper>
  );
}
