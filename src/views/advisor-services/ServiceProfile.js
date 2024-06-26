import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid, Box } from "@material-ui/core";
import { IconPencil, IconDeviceFloppy } from "@tabler/icons";

// project imports
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import ServiceForm from "./forms/ServiceForm";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import CatsHeader from "ui-component/extended/CatsHeader";
import QuillContainer from "ui-component/forms/QuillContainer";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar, showEditBanner } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import CatHeader from "ui-component/extended/CatHeader";
import QuillPaper from "ui-component/templates/QuillPaper";
import CustomButtonGroup from "ui-component/buttons/CustomButtonGroup";
import { serviceOutline } from "utils/quill-placeholder";

// data and functions
import { myServiceList } from "utils/advisor-dummy-data";
import { demoMapCategoryDisplayNames } from "utils/DataMapFunctions";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the service list page, or from the new service page

const ServiceProfile = (props, { ...others }) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const serviceFormRef = useRef({});
  const quillEditor = useRef(null);

  // get path params
  const { id } = useParams();
  const idParam = id ? id : null;

  // data states
  const [servicePayload, setServicePayload] = useState({});
  const [unsavedService, setUnsavedService] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formErrorExists, setFormErrorExists] = useState(false);

  // #region --- all functions
  // get current data from the server
  const getServiceData = async (services, id, stateObj) => {
    // if the id is equal to "preview, then display the data from the stateObj and fill in the blanks."
    if (id === "preview") {
      setServicePayload({
        service: {
          category: location.state.category,
          subcategory: location.state.subcategory,
        },
      });
      setUnsavedService({
        title: "",
        description: "",
        deltas: serviceOutline,
        price: 0.0,
      });
      setEditMode(true);
    }
    // if the idParam is less than the number 100, then use the id to look up article info
    else if (parseInt(id, 10) < 100) {
      const idInteger = parseInt(id, 10);
      let service = {};
      services.forEach((item, index) => {
        if (item.id === idInteger) service = { ...item };
      });
      // const parsedDelta = JSON.parse(article.deltas);
      setUnsavedService({
        ...service,
        deltas: service.deltas,
      });
      setServicePayload({
        ...service,
        deltas: service.deltas,
      });
      setEditMode(false);
    } // Otherwise, use the state data to fill the article profile.
    else {
      setUnsavedService({
        ...stateObj,
        deltas: stateObj.deltas,
      });
      setServicePayload({
        ...stateObj,
        deltas: stateObj.deltas,
      });
      setEditMode(false);
    }
    setIsLoading(false);
    return true;
  };

  // handle retrieving data from the server
  useEffect(() => {
    // if idParam and articleList exist, get current article data
    if (!!myServiceList && myServiceList.length) {
      if (idParam) getServiceData(myServiceList, idParam, location.state);
      else navigate(-1);
    }
    // otherwise, go back
    else {
      console.log("No article list found.");
      navigate(-1);
    }
  }, []);

  // handle edit banner
  useEffect(() => {
    if (!!editMode) dispatch(showEditBanner(true, "Editing service..."));
    else dispatch(showEditBanner(false, ""));
  }, [editMode]);

  // handle save button enablement
  useEffect(() => {
    if (!isLoading) {
      if (
        unsavedService.title &&
        unsavedService.description &&
        Object.entries(unsavedService.deltas).length > 0
      )
        setCanContinue(true);
      else setCanContinue(false);
    }
  }, [
    unsavedService.title,
    unsavedService.description,
    unsavedService.price,
    unsavedService.deltas,
  ]);

  // UPDATING THE DATA =============================================================
  // cancel changes
  const handleEditCancel = () => {
    setEditMode(false);
    // if this is not a preview
    if (idParam && idParam !== "preview") {
      setUnsavedService((prevState) => {
        return {
          ...prevState,
          title: servicePayload.title,
          description: servicePayload.description,
          deltas: servicePayload.deltas,
          price: servicePayload.price,
        };
      });
      dispatch(showSnackbar("Changes were not saved.", true, "info"));
    } // Otherwise, if this is a preview of a new services, return to previous page.
    else navigate(-1);
  };

  // save changes
  const handleEditSave = () => {
    serviceFormRef.current.validateForm().then(() => {
      if (serviceFormRef.current.isValid) {
        setEditMode(false);
        // update the profile data (this updated state should not be used for the api request)
        setServicePayload((prevState) => ({
          ...prevState,
          title: unsavedService.title,
          description: unsavedService.description,
          deltas: unsavedService.deltas,
          price: unsavedService.price
            ? parseFloat(unsavedService.price).toFixed(2)
            : 0.0,
        }));
        dispatch(showSnackbar("Service updated successfully", true, "success"));
      } else {
        // if there are errors when saving changes, modal will appear to notify user.
        setFormErrors(serviceFormRef.current.errors);
        setFormErrorExists(true);
      }
    });
    return true;
  };

  // confirm delete
  const handleDeleteConfirm = () => {
    // delete service with API request
    setIsLoading(true);
    dispatch(showSnackbar("Service removed successfully", true, "success"));
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  // handle content changes
  const handleContentChange = (content) => {
    setUnsavedService((prevState) => ({
      ...prevState,
      deltas: content,
    }));
  };

  // #endregion

  return (
    <>
      <FormInputErrorModal
        open={editMode && formErrorExists}
        errorInfo={formErrors}
        handleErrorConfirmation={() => setFormErrorExists(false)}
      />
      <ConfirmDeleteModal
        open={deleteMode}
        handleConfirm={handleDeleteConfirm}
        handleCancel={() => setDeleteMode(false)}
        heading={`Are you sure you want to discontinue this service?`}
        body="All service details will be deleted. This action cannot be undone."
        action={isLoading ? "Loading..." : "Discontinue"}
        nonaction={isLoading ? "" : "Cancel"}
      />
      <GenericPage
        pageHeader="Service Details"
        buttonlist={
          !editMode
            ? [
                {
                  name: "Discontinue Service",
                  color: "error",
                  variant: "outlined",
                  onClick: () => setDeleteMode(true),
                },
                {
                  name: "Edit",
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
                  variant: "outlined",
                  onClick: handleEditCancel,
                },
                {
                  name: "Save",
                  color: "secondary",
                  variant: "contained",
                  onClick: handleEditSave,
                  disabled: !canContinue,
                },
              ]
        }
      >
        <>
          {isLoading ? (
            <Box className="horizontal-center">
              <PagePlaceholderText text="Loading..." />
            </Box>
          ) : (
            <>
              <SubsectionWrapper
                mb={1}
                title={"Service Preview Information"}
                tipBody={
                  "The title and description of the service will be displayed in a preview card among other services."
                }
              >
                {" "}
                <>
                  <Grid container>
                    <Grid item xs={12} sx={{ mb: 3 }}>
                      {servicePayload.subcategory ? (
                        <CatsHeader
                          category={
                            demoMapCategoryDisplayNames(
                              servicePayload.category,
                              servicePayload.subcategory
                            ).categoryDisplayName
                          }
                          subcategory={
                            demoMapCategoryDisplayNames(
                              servicePayload.category,
                              servicePayload.subcategory
                            ).subcategoryDisplayName
                          }
                        />
                      ) : (
                        <CatHeader
                          category={
                            demoMapCategoryDisplayNames(
                              servicePayload.category,
                              servicePayload.subcategory
                            ).categoryDisplayName
                          }
                        />
                      )}
                    </Grid>
                  </Grid>
                  <ServiceForm
                    serviceInput={{
                      title: unsavedService.title,
                      description: unsavedService.description,
                      price: unsavedService.price ? unsavedService.price : "",
                    }}
                    editMode={editMode}
                    forwardedServiceFormRef={serviceFormRef}
                    handleTitleInputChange={(value) => {
                      setUnsavedService((prevState) => ({
                        ...prevState,
                        title: value,
                      }));
                    }}
                    handleDescriptionInputChange={(value) => {
                      setUnsavedService((prevState) => ({
                        ...prevState,
                        description: value,
                      }));
                    }}
                    handlePriceInputChange={(value) => {
                      setUnsavedService((prevState) => ({
                        ...prevState,
                        price: parseFloat(value),
                      }));
                    }}
                  />
                  <SubsectionWrapper
                    title="Detailed Outline"
                    mt={1}
                    mb={1}
                    tipBody="The detailed outline can be used to list deliverables, pricing information, and other details you would like to advertise about your service."
                  >
                    {!editMode ? (
                      <QuillPaper
                        title={servicePayload.title}
                        content={servicePayload.deltas}
                      />
                    ) : (
                      <QuillContainer
                        forwardedQuillEditor={quillEditor}
                        content={unsavedService.deltas}
                        handleContentChange={handleContentChange}
                        readOnly={!editMode}
                        placeholder="Provide a detailed outline of your service. Highlight the key deliverables that your clients can expect and any pricing information you would like to advertise."
                      />
                    )}
                  </SubsectionWrapper>
                </>
              </SubsectionWrapper>
              {editMode && (
                <Grid
                  container
                  direction="row"
                  display="flex"
                  justifyContent={"right"}
                  paddingTop={2}
                >
                  <CustomButtonGroup
                    buttonlist={[
                      {
                        name: "Cancel",
                        color: "primary",
                        variant: "outlined",
                        onClick: handleEditCancel,
                      },
                      {
                        name: "Save Changes",
                        color: "secondary",
                        variant: "contained",
                        startIcon: <IconDeviceFloppy stroke={1.25} />,
                        onClick: handleEditSave,
                        disabled: !canContinue,
                      },
                    ]}
                  />
                </Grid>
              )}
            </>
          )}{" "}
        </>
      </GenericPage>
    </>
  );
};

export default ServiceProfile;
