import React from "react";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Grid, Modal, Typography } from "@material-ui/core";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project imports
import CancelButton from "ui-component/buttons/CancelButton";
import PrimaryActionButton from "ui-component/buttons/PrimaryActionButton";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import { gridSpacing } from "store/constant";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ======================================================
/* PROPS MAP
open = boolean to open modal
header = string to display in header
handleCancel = function to handle cancel button
handleConfirm = function to handle confirm button
*/

const SupportRequest = (props, { ...others }) => {
  const classes = useStyles();
  const theme = useTheme();

  // form values as state
  const [title, setTitle] = React.useState("");
  const [message, setMessage] = React.useState("");

  // when cancel button is selected.
  const handleCancel = () => {
    props.handleCancel();
    setTitle("");
    setMessage("");
  };

  return (
    <Modal open={props.open}>
      <Box className="modalStyle">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h3" sx={{ m: 1 }}>
              {props.header}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Formik
              initialValues={{ title: "", message: "" }}
              validationSchema={Yup.object().shape({
                title: Yup.string()
                  .max(100, "Title cannot be longer than 100 characters")
                  .required("Title is required"),
                message: Yup.string()
                  .max(500, "Message cannot be longer than 500 characters")
                  .required("Message is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                props.handleConfirm(title, message);
                setTitle("");
                setMessage("");
                setSubmitting(false);
              }}
            >
              {(formik) => (
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={formik.handleSubmit}
                  {...others}
                >
                  <Grid
                    container
                    flex="true"
                    spacing={gridSpacing}
                    justifyContent="center"
                  >
                    <MyTextInput
                      formik={formik}
                      id="title"
                      name="title"
                      label="Title"
                      type="text"
                      value={title}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setTitle(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                    />
                    <MyTextInput
                      formik={formik}
                      id="message"
                      name="message"
                      label="Message"
                      type="text"
                      value={message}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setMessage(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      multiline={true}
                      minRows={5}
                      maxRows={8}
                    />
                  </Grid>

                  {/* Button Area */}
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 3,
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      <CancelButton onClick={handleCancel} name="Cancel" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PrimaryActionButton
                        onClick={(e) => {
                          e.preventDefault();
                          formik.handleSubmit();
                        }}
                        name="Submit"
                        disabled={formik.isSubmitting || !title || !message}
                      />
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default SupportRequest;
