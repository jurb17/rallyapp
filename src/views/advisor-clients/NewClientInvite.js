import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// local imports
import ClientInviteForm from "./forms/ClientInviteForm";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import advisoryService from "services/advisory.service";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import { showSnackbar } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ==============================================================

const NewClientInvite = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const clientFormRef = useRef({});

  // data states
  const [email, setEmail] = useState("");

  // mode states
  const [formErrorsExist, setFormErrorsExist] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // save changes
  const handleRequest = async () => {
    clientFormRef.current.validateForm().then(async () => {
      if (clientFormRef.current.isValid) {
        // send api request to create new client profile
        await advisoryService
          .postNewClientInvite({ email: email })
          .then((response) => {
            if (!!response.data.payload.success) {
              dispatch(
                showSnackbar("Invite sent successfully.", true, "success")
              );
            } else {
              if (response.data.details.text) {
                dispatch(
                  showSnackbar("Invite sent successfully.", true, "success")
                );
              } else {
                dispatch(
                  showSnackbar(
                    "Invite was not sent. This email address may belong to an existing user.",
                    true,
                    "warning"
                  )
                );
              }
            }
          })
          // handle post error
          .catch((error) => {
            dispatch(
              showSnackbar(
                "There seems to be an issue. Please contact support if this issue persists.",
                true,
                "error"
              )
            );
            console.log("uncaught error", error);
          });
      } else {
        console.log("Client form is not valid.");
        // set error state to show error message in modal
        const errorList = clientFormRef.current.errors;
        setFormErrors(errorList);
        setFormErrorsExist(true);
      }
    });
  };

  return (
    <>
      <FormInputErrorModal
        open={formErrorsExist}
        errorInfo={formErrors}
        handleErrorConfirmation={() => setFormErrorsExist(false)}
      />
      <GenericPage pageHeader="Invite New Client">
        <SubsectionWrapper
          title="Client Email"
          tipBody="Enter the email address of the client you would like to invite. Upon submitting the invite, the client will receive an email with a link to register."
          mb={2}
        >
          <Box mb={2}>
            <ClientInviteForm
              editMode={true}
              clientInput={{ email: email }}
              forwardedClientFormRef={clientFormRef}
              handleClientInputChange={(name, value) => setEmail(value)}
              handleRequest={handleRequest}
            />
          </Box>
        </SubsectionWrapper>
        <NoteBanner>
          The invited client will receive an email to register. Once they
          complete registration, they will be added to your client list.
        </NoteBanner>
      </GenericPage>
    </>
  );
};

export default NewClientInvite;
