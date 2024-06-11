import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import CustomForm from "./forms/CustomForm";
import CustomFieldForm from "./forms/CustomFieldForm";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import ErrorModal from "ui-component/modals/ErrorModal";
import advisoryService from "services/advisory.service";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar, showEditBanner } from "actions/main";
import {
  IconDeviceFloppy,
  IconPencil,
  IconPlus,
  IconReceipt2,
  IconMessage,
} from "@tabler/icons";
import InputBaseForm from "ui-component/forms/InputBaseForm";

// data and functions imports
import { myClientList, emptyList } from "utils/advisor-dummy-data";
import ClientForm from "./forms/ClientForm";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================
// NO PROPS, ONLY LOCATION.STATE
/* location state variables
  backlink = string of text to be inserted into a url that is used for a button that brings the user back to a previous page.
*/
// this page can be accessed from the client list page, the messages page, and the invoice page.

const ClientProfile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const customFormRef = useRef({});

  // get the client id from the url
  const { id } = useParams();
  const clientid = id;

  // data states
  const [clientPayload, setClientPayload] = useState({});
  const [tempCustomFields, setTempCustomFields] = useState([]);
  const [deleteCustomFields, setDeleteCustomFields] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [addFieldMode, setAddFieldMode] = useState(false);
  const [addFieldErrorMode, setAddFieldErrorMode] = useState(false);

  // get client profile data from server
  const getClientData = async (clientlist) => {
    // get the data for the client that matches the idParam
    if (clientlist.length) {
      for (const client of clientlist) {
        if (client.id.toString() === clientid) {
          setClientPayload({ ...client });
          setTempCustomFields({ ...client.customfields });
        }
      }
      setIsLoading(false);
    } else {
      console.log("Client list empty.");
      navigate(-1);
    }
  };

  // get current data from the server
  useEffect(() => {
    if (clientid)
      if (myClientList) getClientData(myClientList);
      else {
        console.log("No client list found.");
        navigate(-1);
      }
    else navigate(-1);
  }, []);

  useEffect(() => {
    if (!!editMode) dispatch(showEditBanner(true, "Editing client profile..."));
    else dispatch(showEditBanner(false, ""));
  }, [editMode]);

  // DATA FUNCTIONS ======================================

  // clear the current list of fields to be deleted.
  const clearDeleteFieldsList = () => {
    setDeleteCustomFields([]);
  };
  // cancel changes
  const handleEditCancel = () => {
    setEditMode(false);
    setTempCustomFields({ ...clientPayload.client.customfields });
    setDeleteCustomFields([]);
  };
  // save changes (updates)
  const handleEditSave = async () => {
    setEditMode(false);
    await advisoryService
      .putClient({
        clientid: clientid,
        customdata: { ...tempCustomFields },
        deletelist: [...deleteCustomFields],
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          // update the custom fields object and clear out the delete list
          setClientPayload((prevState) => ({
            ...prevState,
            client: {
              ...prevState.client,

              customfields: { ...tempCustomFields },
              deletelist: [],
            },
          }));
          clearDeleteFieldsList();
          dispatch(
            showSnackbar("Custom fields updated successfully", true, "success")
          );
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log("caught error", response.data.details.text);
        }
      })
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
  };
  // submit new field
  const handleAddFieldSave = async (name, value) => {
    setAddFieldMode(false);
    // if that field name already exists, don't add it and show an error
    if (
      !!clientPayload.client.customfields &&
      Object.keys(clientPayload.client.customfields).includes(name)
    ) {
      // snackbar
      setAddFieldMode(false);
      setAddFieldErrorMode(true);
      return false;
    } else {
      // set modes
      setAddFieldMode(false);
      let newObj = {
        ...clientPayload.client.customfields,
        [name]: value,
      };
      await advisoryService
        .putClient({
          clientid: clientid,
          customdata: { ...newObj },
          deletelist: [],
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            // add the new field to the custom fields object
            setClientPayload((prevState) => ({
              ...prevState,
              client: {
                ...prevState.client,
                customfields: {
                  ...clientPayload.client.customfields,
                  [name]: value,
                },
              },
            }));
            setTempCustomFields({ ...tempCustomFields, [name]: value });
            dispatch(
              showSnackbar("New field added successfully", true, "success")
            );
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            console.log("caught error", response.data.details.text);
          }
        })
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
    }
  };
  // handle delete custom field confirm
  const handleDeleteFieldConfirm = (name) => {
    const newObj = { ...tempCustomFields };
    delete newObj[name];
    setTempCustomFields({ ...newObj });
    setDeleteCustomFields([...deleteCustomFields, name]);
    dispatch(
      showSnackbar(`'${name}' field deleted successfully.`, true, "success")
    );
  };
  // handle confirm delete profile (NOT SUPPORTED ATM)
  const handleDeleteProfileConfirm = async () => {
    // there is no form to validate here.
    await advisoryService
      .deleteClient({
        clientid: clientid,
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          dispatch(
            showSnackbar("Client deleted successfully", true, "success")
          );
          navigate("/adv/clients");
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log("caught error", response.data.details.text);
        }
      })
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
  };
  // when user changes the value of a custom field
  const handleCustomInputChange = (name, value) => {
    const newObj = { ...tempCustomFields };
    newObj[name] = value;
    setTempCustomFields({ ...newObj });
  };

  return (
    <>
      <CustomFieldForm
        open={addFieldMode}
        handleAddFieldSave={handleAddFieldSave}
        handleAddFieldCancel={() => setAddFieldMode(false)}
      />
      <ErrorModal
        open={addFieldErrorMode}
        heading="Field Name Already Exists"
        body="This custom field name already exists for this client! Please enter a new field name."
        handleErrorConfirmation={() => setAddFieldErrorMode(false)}
      />
      <ConfirmDeleteModal
        open={deleteMode}
        handleConfirm={handleDeleteProfileConfirm}
        handleCancel={() => setDeleteMode(false)}
        heading="Are you sure you want to delete this profile?"
        body="This action cannot be undone."
      />
      {isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <>
          <GenericPage
            pageHeader={
              clientPayload.name ? clientPayload.name : "Client Profile"
            }
            backlink={
              !!location.state && location.state.backlink
                ? location.state.backlink
                : ""
            }
            buttonlist={[
              {
                name: "Send Invoice",
                color: "primary",
                variant: "contained",
                onClick: () => navigate(`/adv/invoices/new/?id=${clientid}`),
              },
              {
                name: "Send Message",
                color: "primary",
                variant: "contained",
                onClick: () => navigate(`/adv/messages/?id=${clientid}`),
              },
            ]}
          >
            <>
              <SubsectionWrapper
                title="Client Information"
                tipBody="Basic information about your client. This information is not editable."
                mb={2}
                buttonlist={[
                  {
                    name: "View Invoices",
                    color: "primary",
                    variant: "text",
                    startIcon: <IconReceipt2 stroke={1.25} />,
                    onClick: () => navigate(`/adv/invoices/?id=${clientid}`),
                  },
                  {
                    name: "View Chat",
                    color: "primary",
                    variant: "text",
                    startIcon: <IconMessage stroke={1.25} />,
                    onClick: () => navigate(`/adv/messages/?id=${clientid}`),
                  },
                ]}
              >
                <Box sx={{ width: 1, flexGrow: 1, mb: 2 }}>
                  {/* <InputBaseForm
                    key={clientid}
                    formObj={{
                      firstname: clientPayload.firstname,
                      lastname: clientPayload.lastname,
                      email: clientPayload.email,
                    }}
                  /> */}
                  <ClientForm
                    key={clientid}
                    clientInput={{ ...clientPayload }}
                  />
                </Box>
              </SubsectionWrapper>
              <SubsectionWrapper
                pt={1.5}
                mt={2}
                mb={2.5}
                title="Custom Fields"
                tipBody="Custom fields are used to store additional information about your client. Select the Add button to add more. Custom fields are editable."
                border={true}
                buttonlist={
                  !clientPayload.customfields
                    ? [
                        {
                          name: "Add New",
                          color: "primary",
                          variant: "outlined",
                          startIcon: <IconPlus stroke={1.25} />,
                          onClick: () => setAddFieldMode(true),
                        },
                      ]
                    : !editMode
                    ? [
                        {
                          name: "Add New",
                          color: "primary",
                          variant: "outlined",
                          startIcon: <IconPlus stroke={1.25} />,
                          onClick: () => setAddFieldMode(true),
                        },
                        {
                          name: "Edit Fields",
                          color: "primary",
                          variant: "contained",
                          startIcon: <IconPencil stroke={1.25} />,
                          onClick: () => setEditMode(true),
                        },
                      ]
                    : [
                        {
                          name: "Cancel",
                          color: "primary",
                          variant: "text",
                          onClick: handleEditCancel,
                        },
                        {
                          name: "Save Fields",
                          color: "secondary",
                          variant: "contained",
                          startIcon: <IconDeviceFloppy stroke={1.25} />,
                          onClick: handleEditSave,
                        },
                      ]
                }
              >
                <Box>
                  <CustomForm
                    editMode={editMode}
                    customInput={{ ...tempCustomFields }}
                    handleDeleteFieldConfirm={handleDeleteFieldConfirm}
                    handleCustomInputChange={handleCustomInputChange}
                    forwardedCustomFormRef={customFormRef}
                  />
                </Box>
              </SubsectionWrapper>
            </>
          </GenericPage>
        </>
      )}
    </>
  );
};

export default ClientProfile;
