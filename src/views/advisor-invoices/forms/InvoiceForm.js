import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// material-ui
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// assets
import { gridSpacing } from "store/constant";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import MySelectInput from "ui-component/forms/inputs/MySelectInput";
import { mapClientName } from "utils/DataMapFunctions";

// ==============================================================
/* PROPS MAP
clientName = string to identify the client
handleClientSelectInput = function to set client id and client name
forwardedInvoiceFormRef = ref to the formik form
*/

const InvoiceForm = (props) => {
  const dispatch = useDispatch();

  // define states
  const [isLoading, setIsLoading] = useState(true);
  const [clientList, setClientList] = useState([]);
  const [clientNameList, setClientNameList] = useState([]);
  const [helperText, setHelperText] = useState("");

  //handle input change
  const handleClientSelect = (e) => {
    const { name, value } = e.target;
    clientList.forEach((client) => {
      if (client.name === value) {
        props.handleClientSelectInput(client.id, value);
      }
    });
  };

  // if in editmode, set client list for selection. if not, set client name given by props.clientid (there is no editing when the invoice has already been created.)
  useEffect(async () => {
    await mapClientName(" ")
      .then((response) => {
        if (response.clientList.length === 0) {
          console.log("error: no client list");
          setHelperText("Client list is empty.");
          alert(
            "Your client list is empty. An invoice cannot be created here. If you want to create an invoice for a prospect, select them from your prospect list and click the 'Send Invoice' button."
          );
          setIsLoading(false);
        } else {
          setClientList(response.clientList);
          setClientNameList(response.clientNames);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      <Formik
        innerRef={props.forwardedInvoiceFormRef}
        initialValues={{ clientname: props.clientName }}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit}>
            {!isLoading && (
              <Grid container spacing={gridSpacing}>
                {props.editMode ? (
                  <MySelectInput
                    xs={12}
                    sm={12}
                    formik={formik}
                    key="clientname"
                    id="clientname"
                    description="clientname"
                    label="Select Client"
                    value={props.clientName}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleClientSelect(e);
                    }}
                    onBlur={formik.handleBlur}
                    readOnly={false}
                    options={clientNameList}
                    helpertext={helperText}
                  />
                ) : (
                  <MyTextInput
                    xs={12}
                    sm={12}
                    formik={formik}
                    key="clientname"
                    id="clientname"
                    description="clientname"
                    label="Select Client"
                    value={props.clientName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    readOnly={true}
                  />
                )}
              </Grid>
            )}
          </form>
        )}
      </Formik>
    </>
  );
};

export default InvoiceForm;
