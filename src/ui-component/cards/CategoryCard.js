import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography, Paper } from "@material-ui/core";
import { useTheme } from "@emotion/react";

const useStyles = makeStyles((theme) => ({
  catCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardButton: {
    height: "144px",
    width: "144px",
    padding: "24px 24px",
    border: `1px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

// =====================================================
/* PROPS MAP
text = string for category name
icon = icon for visual representation of category
selected = boolean to determine if category is selected
*/

const CategoryCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper
      key={props.id}
      id={props.id}
      label={props.label}
      icon={props.icon}
      onClick={props.onClick}
      sx={{
        m: 1,
        width: "144px",
        fontSize: "1rem",
        fontWeight: "bold",
        padding: "0.75rem",
        backgroundColor: !!props.selected
          ? theme.palette.primary.dark
          : theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
          cursor: "pointer",
        },
      }}
    >
      {" "}
      <Box
        display="flex"
        direction="row"
        alignItems="center"
        justifyContent={"center"}
        marginBottom={1}
        id={props.id}
      >
        {props.icon}
      </Box>
      <Typography
        variant="h4"
        id={props.id}
        sx={{
          color: theme.palette.text.hint,
          textAlign: "center",
        }}
      >
        {props.label}
      </Typography>
    </Paper>
  );
};

export default CategoryCard;
