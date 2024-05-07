import React, { useMemo } from "react";
import Quill from "quill";
import ReactQuill from "react-quill";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import "styles/article_styles.css";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Typography } from "@material-ui/core";

// style constant
const useStyles = makeStyles((theme) => ({
  quillStyle: {
    marginBottom: "16px",
    paddingBottom: "16px",
    backgroundColor: theme.palette.background.paper,
    height: "450px",
  },
}));

// ===============================================================

const QuillContainer = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ size: ["small", false, "large", "huge"] }, { color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
            { align: [] },
          ],
          [
            "link",
            "image",
            // "video"
          ],
          ["clean"],
        ],
        handlers: { image: imageHandler },
      },
      // clipboard: { matchVisual: false }
      history: false,
    }),
    []
  );

  function imageHandler() {
    var range = props.forwardedQuillEditor.current.editor.getSelection();
    var value = prompt("please copy paste the image url here.");
    if (value) {
      props.forwardedQuillEditor.current.editor.insertEmbed(
        range.index,
        "image",
        value,
        Quill.sources.USER
      );
    }
  }

  const handleQuillValueChange = (
    newQuillValue,
    currentQuillRange,
    quillText,
    lastDelta
  ) =>
    setTimeout(() => {
      props.handleContentChange(newQuillValue, quillText);
      // props.forwardedQuillEditor.current.editor.history.undo();
      if (lastDelta.ops[1] && lastDelta.ops[1].insert === "\n") {
        props.forwardedQuillEditor.current.editor.setSelection(
          currentQuillRange.index + 1,
          0
        );
      } else {
        props.forwardedQuillEditor.current.editor.setSelection(
          currentQuillRange.index,
          0
        );
      }
    }, 0);

  return (
    <div
      className="main-panel"
      style={{
        border: props.noborder ? "" : `1px solid ${theme.palette.divider}`,
        borderRadius: `${theme.shape.borderRadius}`,
      }}
    >
      <div className="main-content">
        <div style={{ backgroundColor: "white" }}>
          <Typography variant="h2"> {props.title} </Typography>
        </div>
        <ReactQuill
          className={classes.quillStyle}
          ref={props.forwardedQuillEditor}
          theme="snow"
          value={props.content}
          defaultValue={props.defaultValue ? props.defaultValue : ""}
          placeholder={
            props.placeholder ? props.placeholder : "Share your insight... "
          }
          onChange={(content, delta, source, editor) => {
            if (source === "user") {
              handleQuillValueChange(
                editor.getContents(),
                editor.getSelection(),
                editor.getText(),
                delta
              );
            }
          }}
          preserveWhitespace={true}
          modules={props.readOnly ? { toolbar: false } : modules}
          readOnly={props.readOnly}
        />
      </div>
    </div>
  );
};

export default QuillContainer;
