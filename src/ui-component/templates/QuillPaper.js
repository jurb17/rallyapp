import React from "react";
import "styles/article_styles.css";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Typography, Paper } from "@material-ui/core";

// local imports
import QuillContainer from "ui-component/forms/QuillContainer";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ==============================================================
/* PROPS MAP
title = string to display as title
forwardedQuillEditor = object to pass to QuillContainer
content = deltas to pass to QuillContainer
*/

const QuillPaper = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <>
      <Paper
        variant="outlined"
        sx={{ padding: 3, borderColor: theme.palette.grey[300] }}
      >
        <Typography variant="h2" sx={{ mb: 1 }}>
          {props.title}
        </Typography>
        <QuillContainer
          content={props.content}
          readOnly={true}
          noborder={true}
        />
      </Paper>
    </>
  );
};

export default QuillPaper;
