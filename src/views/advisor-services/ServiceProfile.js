import React, { useRef, useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid, Box } from "@material-ui/core";
import { IconPencil } from "@tabler/icons";

// project imports
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import ServiceForm from "./forms/ServiceForm";
import advisoryService from "services/advisory.service";
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

  // request states
  const [categoryid, setCategoryid] = useState(
    id.indexOf(".") !== -1 ? id.split(".")[0] : id
  );
  const [subcategoryid, setSubcategoryid] = useState(
    id.indexOf(".") !== -1 ? id.split(".")[1] : ""
  );

  // data states
  const [servicePayload, setServicePayload] = useState({});
  const [unsavedService, setUnsavedService] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [canContinue, setCanContinue] = useState(false);
  const [backlink, setBacklink] = useState("");
  const [existingService, setExistingService] = useState(false);

  // const [deleteReroute, setDeleteReroute] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formErrorExists, setFormErrorExists] = useState(false);

  // #region --- all functions
  // get current data from the server
  const getServiceData = async () => {
    if (!!subcategoryid) {
      await advisoryService
        .getServiceNiche({ category: categoryid, subcategory: subcategoryid })
        .then((response) => {
          if (!!response.data.payload.success) {
            const parsedDelta = JSON.parse(
              response.data.payload.service.deltas
            );
            setServicePayload({
              ...response.data.payload,
              service: {
                ...response.data.payload.service,
                deltas: { ops: [...parsedDelta] },
              },
            });
            setUnsavedService({
              title: response.data.payload.service.title,
              description: response.data.payload.service.description,
              deltas: { ops: [...parsedDelta] },
              // if the price exists, set it to the value and fix to 2 decimal places.
              // otherwise set it to zero (falsey value).
              price: !!response.data.payload.service.price
                ? response.data.payload.service.price.toFixed(2)
                : 0.0,
            });
            setIsLoading(false);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            navigate(-1);
            // or show error-related page
            setIsLoading(false);
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
          navigate(-1);
          // or show error-related page
          setIsLoading(false);
        });
    } else {
      await advisoryService
        .getService({ category: categoryid })
        .then((response) => {
          if (!!response.data.payload.success) {
            const parsedDelta = JSON.parse(
              response.data.payload.service.deltas
            );
            setServicePayload({
              ...response.data.payload,
              service: {
                ...response.data.payload.service,
                deltas: { ops: [...parsedDelta] },
              },
            });
            setUnsavedService({
              title: response.data.payload.service.title,
              description: response.data.payload.service.description,
              deltas: { ops: [...parsedDelta] },
              price: !!response.data.payload.service.price
                ? response.data.payload.service.price.toFixed(2)
                : 0.0,
            });
            setIsLoading(false);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            navigate(-1);
            // or show error-related page
            setIsLoading(false);
          }
        });
    }
  };

  // handle retrieving data from the server
  useEffect(() => {
    // coming to this page with a service that already exists
    if (!!location.state.serviceExists) {
      getServiceData();
      setExistingService(true);
    }
    // coming to this page with a new service
    else {
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
      setIsLoading(false);
      setEditMode(true);
    }
  }, []);

  // handle edit banner
  useEffect(() => {
    if (!!editMode) {
      dispatch(showEditBanner(true, "Editing service..."));
    } else {
      dispatch(showEditBanner(false, ""));
    }
  }, [editMode]);

  // handle save button enablement
  useEffect(() => {
    if (!isLoading) {
      if (
        !!unsavedService.title &&
        !!unsavedService.description &&
        Object.entries(unsavedService.deltas).length > 0
      ) {
        setCanContinue(true);
      } else {
        setCanContinue(false);
      }
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
    if (!!existingService) {
      setUnsavedService((prevState) => {
        return {
          ...prevState,
          title: servicePayload.service.title,
          description: servicePayload.service.description,
          deltas: servicePayload.service.deltas,
          price: servicePayload.service.price,
        };
      });
      dispatch(showSnackbar("No changes were made.", true, "info"));
    } else {
      navigate(-1);
    }
  };
  // save changes
  const handleEditSave = async () => {
    serviceFormRef.current.validateForm().then(async () => {
      if (serviceFormRef.current.isValid) {
        setBacklink("/adv/services");
        // send api request
        console.log(
          "check price before sending it to the server",
          unsavedService.price,
          !!unsavedService.price,
          parseFloat(unsavedService.price).toFixed(2)
        );
        if (!!subcategoryid) {
          await advisoryService
            .postServiceNiche({
              category: categoryid,
              subcategory: subcategoryid,
              title: unsavedService.title,
              description: unsavedService.description,
              deltas: unsavedService.deltas.ops,
              price: !!unsavedService.price
                ? parseFloat(unsavedService.price).toFixed(2)
                : 0.0,
            })
            .then((response) => {
              if (!!response.data.payload.success) {
                setEditMode(false);
                // update the profile data (this updated state should not be used for the api request)
                setServicePayload((prevState) => ({
                  ...prevState,
                  service: {
                    ...prevState.service,
                    title: unsavedService.title,
                    description: unsavedService.description,
                    deltas: unsavedService.deltas,
                    price: !!unsavedService.price
                      ? parseFloat(unsavedService.price).toFixed(2)
                      : 0.0,
                  },
                }));
                // $$$ add successful snackbar messages for put and post requests.
                dispatch(
                  showSnackbar("Service updated successfully", true, "success")
                );
                setExistingService(true);
              } else {
                dispatch(
                  showSnackbar(response.data, details.text, true, "error")
                );
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
        } else {
          await advisoryService
            .postService({
              category: categoryid,
              title: unsavedService.title,
              description: unsavedService.description,
              deltas: unsavedService.deltas.ops,
              price: !!unsavedService.price
                ? parseFloat(unsavedService.price).toFixed(2)
                : 0.0,
            })
            .then((response) => {
              if (!!response.data.payload.success) {
                setEditMode(false);
                // update the profile data (this updated state should not be used for the api request)
                setServicePayload((prevState) => ({
                  ...prevState,
                  service: {
                    ...prevState.service,
                    title: unsavedService.title,
                    description: unsavedService.description,
                    deltas: unsavedService.deltas,
                    price: !!unsavedService.price
                      ? parseFloat(unsavedService.price).toFixed(2)
                      : 0.0,
                  },
                }));
                // $$$ add successful snackbar messages for put and post requests.
                dispatch(
                  showSnackbar("Service updated successfully", true, "success")
                );
                setExistingService(true);
              } else {
                dispatch(
                  showSnackbar(response.data, details.text, true, "error")
                );
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
      } else {
        // if there are errors when saving changes, modal will appear to notify user.
        setFormErrors(serviceFormRef.current.errors);
        setFormErrorExists(true);
      }
    });
    return true;
  };
  // confirm delete
  const handleDeleteConfirm = async () => {
    // delete service with API request
    setIsLoading(true);
    if (!!subcategoryid) {
      await advisoryService
        .deleteServiceNiche({
          category: categoryid,
          subcategory: subcategoryid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            dispatch(
              showSnackbar("Service removed successfully", true, "success")
            );
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
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
    } else {
      await advisoryService
        .deleteService({
          category: categoryid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            dispatch(
              showSnackbar("Service removed successfully", true, "success")
            );
            setTimeout(() => {
              navigate(-1);
            }, 2000);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
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
        backlink={backlink}
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
                  name: "Save Changes",
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
                      {!!subcategoryid ? (
                        <CatsHeader
                          category={servicePayload.service.category}
                          subcategory={servicePayload.service.subcategory}
                        />
                      ) : (
                        <CatHeader category={servicePayload.service.category} />
                      )}
                    </Grid>
                  </Grid>
                  <ServiceForm
                    serviceInput={{
                      title: unsavedService.title,
                      description: unsavedService.description,
                      price: !!unsavedService.price ? unsavedService.price : "",
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
                        title={servicePayload.service.title}
                        content={servicePayload.service.deltas}
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
