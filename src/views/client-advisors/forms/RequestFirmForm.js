import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";
import * as yup from "yup";

// assets
import MyTextInput from "ui-component/forms/inputs/MyTextInput";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =======================================================
/* PROPS MAP
slug = string representing the slug of the advisor url
message = string representing the message to send to the advisor
handleSlugChange = function to handle the change of the slug
handleMessageChange = function to handle the change of the message
handleRequest = function to handle the request to send to the advisor
*/

const RequestFirmForm = (props) => {
  const classes = useStyles();

  // display the modal, should the user be in the mode of creating a new custom field. Display the invoice and custom fields regardless.
  return (
    <>
      <Formik
        innerRef={props.forwardedFormRef}
        initialValues={{
          slug: "",
          message: "",
        }}
        validationSchema={yup.object({
          message: yup
            .string()
            .max(500, "Message must be less than 500 characters")
            .required("Message is required"),
        })}
      >
        {(formik) => (
          <form noValidate width="100%">
            <Grid container direction="row" maxWidth="100%">
              <Grid item xs={12} mt={3}>
                <MyTextInput
                  xs={12}
                  formik={formik}
                  key="message"
                  id="message"
                  label="Message"
                  placeholder="Hello, I'm looking for advice regarding..."
                  value={props.data.message}
                  onChange={(e) => {
                    formik.handleChange(e);
                    props.handleMessageChange(e);
                  }}
                  multiline={true}
                  minRows={5}
                  maxRows={16}
                />
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default RequestFirmForm;
