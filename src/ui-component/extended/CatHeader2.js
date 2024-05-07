import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Stack, Chip } from "@material-ui/core";

// style constant
const useStyles = makeStyles((theme) => ({
  categoryChip: {
    backgroundColor: theme.palette.secondary.main,
    border: "1px solid",
    borderColor: theme.palette.secondary.main,
    color: theme.palette.text.main,
    fontWeight: "bold",
    zIndex: 0,
  },
}));

// =============================================

const CatHeader = (props) => {
  const classes = useStyles();

  return (
    <Box sx={{ display: "flex", pb: 0, flexWrap: "wrap" }}>
      <Stack direction="row">
        <Chip
          key={1}
          label={props.category}
          className={classes.categoryChip}
          variant="filled"
        />
      </Stack>
    </Box>
  );
};

export default CatHeader;
