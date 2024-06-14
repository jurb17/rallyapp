import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import CustomForm from "./forms/CustomForm";
import CustomFieldForm from "./forms/CustomFieldForm";
import ErrorModal from "ui-component/modals/ErrorModal";
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

// data and functions imports
import { myClientList } from "utils/advisor-dummy-data";
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

  // get the client id from the url
  const { id } = useParams();
  const idParam = id;

  // data states
  const [clientPayload, setClientPayload] = useState({});
  const [tempCustomFields, setTempCustomFields] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [addFieldMode, setAddFieldMode] = useState(false);
  const [addFieldErrorMode, setAddFieldErrorMode] = useState(false);

  // get client profile data from server
  const getClientData = async (clientlist) => {
    // get the data for the client that matches the idParam
    for (const client of clientlist) {
      if (client.id.toString() === idParam) {
        setClientPayload({ ...client });
        setTempCustomFields({ ...client.customfields });
      }
    }
    setIsLoading(false);
  };

  // get current data from the server
  useEffect(() => {
    // if idParam and clientList exist, get current client data
    if (idParam)
      if (myClientList && myClientList.length) getClientData(myClientList);
      // otherwise, go back
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
  // submit new field
  const handleAddFieldSave = async (name, value) => {
    setAddFieldMode(false);
    // if there are custom fields and the given field name already exists, don't add it and show an error
    if (
      !!clientPayload.customfields &&
      Object.keys(clientPayload.customfields).includes(name)
    )
      setAddFieldErrorMode(true);
    else {
      // add new field to the custom fields object within clientPayload
      setClientPayload((prevState) => ({
        ...prevState,
        customfields: {
          ...clientPayload.customfields,
          [name]: value,
        },
      }));
      setTempCustomFields({ ...tempCustomFields, [name]: value });
      dispatch(showSnackbar("New field added successfully", true, "success"));
    }
  };
  // cancel changes to custom fields
  const handleEditCancel = () => {
    setEditMode(false);
    setTempCustomFields({ ...clientPayload.customfields });
  };
  // save changes to custom fields
  const handleEditSave = async () => {
    setEditMode(false);
    // update the custom fields object
    setClientPayload((prevState) => ({
      ...prevState,
      customfields: { ...tempCustomFields },
    }));
    dispatch(
      showSnackbar("Custom fields updated successfully", true, "success")
    );
  };
  // handle delete custom field confirm
  const handleDeleteFieldConfirm = (name) => {
    // remove field from tempCustomFields and add it to deleteCustomFields
    const newObj = { ...tempCustomFields };
    delete newObj[name];
    setTempCustomFields({ ...newObj });
    dispatch(
      showSnackbar(`'${name}' field deleted successfully.`, true, "success")
    );
  };
  // when user changes the value of a custom field
  const handleCustomInputChange = (name, value) => {
    const newObj = { ...tempCustomFields };
    newObj[name] = value;
    setTempCustomFields({ ...newObj });
  };
  // handle confirm delete profile (NOT SUPPORTED ATM)
  const handleDeleteProfileConfirm = async () => {};

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
                onClick: () => navigate(`/adv/invoices/new/?id=${idParam}`),
              },
              {
                name: "Send Message",
                color: "primary",
                variant: "contained",
                onClick: () => navigate(`/adv/messages/?id=${idParam}`),
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
                    onClick: () => navigate(`/adv/invoices/?id=${idParam}`),
                  },
                  {
                    name: "View Chat",
                    color: "primary",
                    variant: "text",
                    startIcon: <IconMessage stroke={1.25} />,
                    onClick: () => navigate(`/adv/messages/?id=${idParam}`),
                  },
                ]}
              >
                <Box sx={{ width: 1, flexGrow: 1, mb: 2 }}>
                  <ClientForm
                    key={idParam}
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
                  // if there are no custum fields, only show "Add New" button.
                  !Object.keys(clientPayload.customfields).length
                    ? [
                        {
                          name: "Add New",
                          color: "primary",
                          variant: "outlined",
                          startIcon: <IconPlus stroke={1.25} />,
                          onClick: () => setAddFieldMode(true),
                        },
                      ]
                    : // if not in edit mode, show "Edit Fields" button alongside "Add New" button
                    !editMode
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
                    : // if in edit mode, that means there are custom fields!
                      [
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
