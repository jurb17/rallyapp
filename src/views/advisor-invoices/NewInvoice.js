import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  useMediaQuery,
} from "@material-ui/core";
import { IconInfoCircle } from "@tabler/icons";

// local imports
import InvoiceForm from "./forms/InvoiceForm";
import TaskForm from "./tasks-component/TaskForm";
import TaskList from "./tasks-component/TaskList";
import { NewInvoiceValidationSchema } from "utils/Validation";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import HtmlTip from "ui-component/extended/HtmlTip";
import GenericPage from "ui-component/pages/GenericPage";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import { showEditBanner, showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import DynamicButton from "ui-component/buttons/DynamicButton";
import HtmlTipButton from "ui-component/extended/HtmlTipButton";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";
import { myClientList, myProspectList } from "utils/advisor-dummy-data";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ==============================================================
// NO PROPS, ONLY LOCATION.STATE
// this page can be accessed from the invoice list page or the client invoice list page

const NewInvoice = () => {
  const classes = useStyles();
  const theme = useTheme();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const invoiceFormRef = useRef({});
  const taskFormRef = useRef({});
  const taskListRef = useRef({});

  // extract query params from url
  const queryParams = new URLSearchParams(location.search);
  const idParam = queryParams.get("id");

  // input data states (information from user)
  const [newInvoice, setNewInvoice] = useState({
    adviceid: idParam ? idParam : "",
    adviseeName: "",
    subtotal: 0,
    status: "",
    lineitems: [],
    feeRate: 0.15, // default fee rate. Updating in getClientData by evaluating if the client was invited or not.
    platformfee: 0,
  });

  // status states
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(true);
  const [canContinue, setCanContinue] = useState(false);
  const [formErrorsExist, setFormErrorsExist] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [isProspect, setIsProspect] = useState(false);

  // function to get client or prospect data
  const getAdviseeData = (adviceid, clientlist, prospectlist) => {
    prospectlist.forEach((prospect) => {
      if (prospect.id.toString() === adviceid) {
        setNewInvoice((prevState) => ({
          ...prevState,
          adviseeName: prospect.name,
          feeRate: prospect.invited ? 0.0495 : 0.15,
          invited: prospect.invited ? true : false,
        }));
        setEditMode(true);
        setIsProspect(true);
        return { ...prospect };
      }
    });
    clientlist.forEach((client) => {
      if (client.id.toString() === adviceid) {
        setNewInvoice((prevState) => ({
          ...prevState,
          adviseeName: client.name,
          feeRate: client.invited ? 0.0495 : 0.15,
          invited: client.invited ? true : false,
        }));
        setIsProspect(false);
        return { ...client };
      }
    });
  };

  // function to load draft data when returning from preview
  const loadDraftData = (draftdata) => {
    setNewInvoice((prevState) => ({
      ...prevState,
      subtotal: draftdata?.subtotal || 0,
      lineitems: draftdata?.returnitems || [],
      adviseeName: draftdata.adviseeName,
      feeRate: draftdata.invited ? 0.0495 : 0.15,
      invited: draftdata.invited ? true : false,
    }));
    setEditMode(true);
  };

  useEffect(() => {
    dispatch(showEditBanner(true, "Creating new invoice..."));
    // if there is an advice id, get the client or prospect name and fee rate
    if (idParam) getAdviseeData(idParam, myClientList, myProspectList);
    // if there is a location state (draft), then ppass the data to the state
    if (location.state && location.state.adviceid) {
      console.log("location.state", location.state);
      loadDraftData({ ...location.state });
    }
    setIsLoading(false);
  }, []);

  // validate form before enabling the "Continue" button.
  useEffect(() => {
    if (
      newInvoice.adviceid &&
      newInvoice.lineitems &&
      newInvoice.lineitems.length > 0
    )
      setCanContinue(true);
    else setCanContinue(false);
  }, [newInvoice]);

  // handle client selection
  const handleClientSelectInput = async (cid, value) => {
    setNewInvoice((prevState) => ({
      ...prevState,
      adviceid: cid,
      adviseeName: value,
    }));
  };

  // reorder task list (update with new list)
  const reorderTaskList = (newList) => {
    setNewInvoice((prevState) => ({
      ...prevState,
      lineitems: newList,
    }));
  };

  // submit new task
  const handleAddTaskSave = () => {
    setNewInvoice((prevState) => ({
      ...prevState,
      lineitems: [
        ...prevState.lineitems,
        {
          description: taskFormRef.current.values.description,
          attribute: parseFloat(taskFormRef.current.values.attribute).toFixed(
            2
          ),
        },
      ],
    }));
  };

  // delete task
  const handleDeleteTask = (taskId) => {
    const newTasks = newInvoice.lineitems.filter((task) => task.id !== taskId);
    setNewInvoice((prevState) => ({
      ...prevState,
      lineitems: newTasks,
    }));
  };

  // submit new invoice
  const handlePreview = () => {
    invoiceFormRef.current.validateForm().then(async () => {
      if (invoiceFormRef.current.isValid) {
        // reformat line items for preview
        let lines = [];
        newInvoice.lineitems.forEach((item) => {
          lines.push({
            description: item.description,
            amount: parseFloat(item.attribute),
          });
        });
        navigate("/adv/invoices/preview", {
          state: {
            lineitems: lines,
            adviseeName: newInvoice.adviseeName,
            subtotal: newInvoice.subtotal,
            adviceid: newInvoice.adviceid,
            invited: newInvoice.invited,
            returnitems: newInvoice.lineitems,
          },
        });
      } else {
        dispatch(showSnackbar("Form contains errors", true, "warning"));
        console.log("Client form is invalid");
        // set error state to show error message in modal
        const errorList = invoiceFormRef.current.errors;
        setFormErrors(errorList);
        setFormErrorsExist(true);
      }
    });
  };

  // get total amount
  const getTotalAmount = (list) => {
    let total = 0.0;
    if (!!list && list.length > 0) {
      list.forEach((item) => {
        total += parseFloat(item.attribute);
      });
    }
    return {
      amount: total.toFixed(2),
    };
  };

  // get total amount when task list changes
  useEffect(() => {
    const { amount } = getTotalAmount(newInvoice.lineitems);
    setNewInvoice((prevState) => ({
      ...prevState,
      subtotal: amount,
    }));
  }, [newInvoice.lineitems]);

  return (
    <>
      <FormInputErrorModal
        open={formErrorsExist}
        errorInfo={formErrors}
        handleErrorConfirmation={() => setFormErrorsExist(false)}
      />
      <GenericPage
        pageHeader="New Invoice"
        buttonlist={[
          {
            name: "Preview Invoice",
            color: "secondary",
            variant: "contained",
            onClick: handlePreview,
            disabled: !canContinue,
          },
        ]}
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading..." />
          </Box>
        ) : (
          <>
            <ConfirmPrimaryModal
              open={isProspect && !!newInvoice.pendingInvoice}
              heading="Pending Invoice"
              body="This prospect has a pending quote. The quote must be accepted before a second invoice can be sent. Would you like to review the quote?"
              action="Review Quote"
              handleCancel={() => {
                navigate(-1);
              }}
              handleConfirm={() => {
                navigate(
                  `/adv/invoices/${newInvoice.adviceid}/${newInvoice.invoiceid}`
                );
              }}
              nonaction="Go Back"
            />
            <SubsectionWrapper
              mb={2}
              border={false}
              title="Invoice Recipient"
              tipBody="Select the client that you would like to send this invoice to. Prospects are not included in this list. Please review your Prospects if you do not see the client you are looking for here."
            >
              <Box sx={{ mb: 2 }}>
                <InvoiceForm
                  editMode={editMode}
                  adviceid={newInvoice.adviceid}
                  adviseeName={newInvoice.adviseeName}
                  forwardedInvoiceFormRef={invoiceFormRef}
                  handleClientSelectInput={handleClientSelectInput}
                />
              </Box>
            </SubsectionWrapper>
            <SubsectionWrapper
              pt={0}
              mb={1}
              title="Invoice Line Items"
              tipBody="Add at least one line item to the invoice. Line items can be added or removed before the invoice is sent. The client will be able to review the line items during checkout."
            >
              <Grid container>
                <Grid item xs={12}>
                  <Box sx={{ pb: 1 }}>
                    <TaskForm
                      handleAddTaskSave={handleAddTaskSave}
                      forwardedTaskFormRef={taskFormRef}
                      attributeType="number"
                      attributeLabel="Amount"
                      descriptionLabel="Description"
                      startAdornment="$"
                      validationSchema={NewInvoiceValidationSchema}
                    />
                  </Box>
                  <TaskList
                    tasks={newInvoice.lineitems}
                    editMode={true}
                    reorderTaskList={reorderTaskList}
                    handleDeleteTask={handleDeleteTask}
                    forwardedTaskListRef={taskListRef}
                    noneMessage="No line items added yet."
                    startAdornment="$"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography className="totalAmount">
                    Total Amount (Subtotal):{" "}
                    {!matchDownSm ? (
                      <>
                        <span style={{ fontWeight: "bold" }}>
                          {newInvoice.subtotal
                            ? `$${parseFloat(newInvoice.subtotal).toFixed(2)}`
                            : "$ ---"}
                        </span>
                        <HtmlTip
                          body={
                            <Typography>
                              The amount listed here represents the payment
                              value before fees are added. Please review our{" "}
                              <a
                                href="https://rally.markets/policy/terms-of-service"
                                target={"_blank"}
                              >
                                pricing policy
                              </a>{" "}
                              to learn more.
                            </Typography>
                          }
                        >
                          <IconButton sx={{ mb: 1.5 }}>
                            <IconInfoCircle />
                          </IconButton>
                        </HtmlTip>
                      </>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "end",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            fontSize: "1.2rem",
                            fontWeight: "bold",
                          }}
                        >
                          {newInvoice.subtotal
                            ? `$${parseFloat(newInvoice.subtotal).toFixed(2)}`
                            : "$ ---"}
                        </Typography>
                        <HtmlTipButton
                          body={
                            <Typography>
                              The amount listed here represents the payment
                              value before fees are added. Please review our{" "}
                              <a
                                href="https://rally.markets/policy/terms-of-service"
                                target={"_blank"}
                              >
                                pricing policy
                              </a>{" "}
                              to learn more.
                            </Typography>
                          }
                        />
                      </Box>
                    )}
                  </Typography>
                </Grid>
              </Grid>
            </SubsectionWrapper>
            <Grid
              container
              mt={2}
              direction="row"
              display="flex"
              justifyContent={"right"}
            >
              <DynamicButton
                name="Preview Invoice"
                color="secondary"
                variant="contained"
                onClick={handlePreview}
                disabled={!canContinue}
              />
            </Grid>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default NewInvoice;
