import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "styles/article_styles.css";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography } from "@material-ui/core";

// third party imports
import DOMPurify from "dompurify";

// style constant
const useStyles = makeStyles((theme) => ({
  articlePaper: {
    paddingTop: theme.spacing(3),
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    marginTop: 0,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
  },
}));

// ==============================================================

const ViewArticle = (props) => {
  const classes = useStyles();
  const deltaToHtml = require("quill-delta-to-html").QuillDeltaToHtmlConverter;
  const location = useLocation();
  const boxRef = useRef(null);

  const [html, setHtml] = useState("");

  // turn the content from delta (JSON) format into html.
  const turnIntoHtml = (deltaContent) => {
    const converter = new deltaToHtml(deltaContent, {});
    const html = converter.convert();
    return html;
  };

  // It's vulnerable to XSS if delta was not sanitized before.
  let tempHtml = turnIntoHtml(props.content);
  let index = 0;
  useEffect(() => {
    if (tempHtml.includes("<img ")) {
      let index = tempHtml.indexOf("<img");
      tempHtml =
        tempHtml.slice(0, index + 4) +
        ` style="width: ` +
        (boxRef.current.offsetWidth - 48) +
        `px"` +
        tempHtml.slice(index + 4);
    }
    setHtml(tempHtml);
  }, []);

  // might be harder than I thought to do the default description.
  let defaultDescription = html.toString().slice(0, 120);
  if (defaultDescription.length === 120) {
    defaultDescription += "...";
  }

  return (
    <>
      <Box className={classes.articlePaper} ref={boxRef}>
        <Typography variant="h2"> {props.title} </Typography>
        {html.length > 0 && (
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
        )}
      </Box>
    </>
  );
};

export default ViewArticle;
