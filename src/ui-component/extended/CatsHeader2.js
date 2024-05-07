import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Stack, Chip } from "@material-ui/core";

// style constant
const useStyles = makeStyles((theme) => ({
  boxStyle: {
    display: "flex",
    flexWrap: "wrap",
    width: "fit-content",
    backgroundColor: theme.palette.background.paper,
    borderRadius: "16px",
  },
  categoryChip: {
    paddingRight: theme.spacing(3),
    backgroundColor: theme.palette.background.paper,
    border: "1px solid",
    borderColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    fontWeight: "bold",
    zIndex: 0,
    "@media (max-width: 600px)": {
      display: "flex",
      paddingRight: 0,
      paddingTop: theme.spacing(1),
      alignItems: "flex-start",
    },
  },
  subcategoryChip: {
    marginLeft: "-28px",
    border: "3px solid",
    backgroundColor: theme.palette.secondary.main,
    borderColor: theme.palette.background.paper,
    borderRadius: "0 16px 16px 0",
    color: theme.palette.primary.main,
    fontWeight: "bold",
    zIndex: 1,
    "@media (max-width: 600px)": {
      display: "flex",
      marginLeft: 0,
      borderRadius: "0 0 16px 16px ",
    },
  },
}));

// =============================================

const CatsHeader = (props) => {
  const classes = useStyles();

  const windowWidth = window.outerWidth;

  return (
    <Box className={classes.boxStyle}>
      <Stack direction={windowWidth > 599 ? "row" : "column"}>
        <Chip
          key={1}
          label={props.category}
          className={classes.categoryChip}
          variant="filled"
        />
        <Chip
          key={2}
          label={props.subcategory}
          className={classes.subcategoryChip}
          variant="outlined"
        />
      </Stack>
    </Box>
  );
};

export default CatsHeader;
