import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@material-ui/core/styles";
import { Box, Grid, Typography, Paper, Divider } from "@material-ui/core";

// project imports
import adviceService from "services/advice.service";
import ErrorModal from "ui-component/modals/ErrorModal";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import GenericPage from "ui-component/pages/GenericPage";
import SupportRequest from "ui-component/modals/SupportRequest";
import { showSnackbar } from "actions/main";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import DynamicButton from "ui-component/buttons/DynamicButton";
import { IconAlertOctagon, IconExternalLink, IconMessage } from "@tabler/icons";
import InvoiceTemplate from "ui-component/templates/InvoiceTemplate";
import CustomLabel from "ui-component/extended/CustomLabel";

// data and functions
import {
  clientInvoiceList,
  clientProfileInfo,
  myAdvisorList,
} from "utils/client-dummy-data";

// style constant
const useStyles = makeStyles((theme) => ({
  refundLine: {
    fontSize: "1.125rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.error.main,
  },
  cancelledText: {
    fontSize: "1.125rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.error.main,
  },
  completeText: {
    fontSize: "1.125rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.success.main,
  },
}));

// =============================================================
// NO PROPS, ONLY LOCATION.STATE

const InvoiceProfile = () => {
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const taskListRef = useRef([]);
  const { attributes } = useSelector((state) => state.auth);

  // get params from url
  const { adviceid, id } = useParams();
  const idParam = adviceid;
  const paymentid = id;

  // data states
  const [paymentPayload, setPaymentPayload] = useState({});
  const [advisorPayload, setAdvisorPayload] = useState({});
  const [calcData, setCalcData] = useState({});
  const [profileInfo, setProfileInfo] = useState({});

  // mode states
  const [isComplete, setIsComplete] = useState(false);
  const [declineMode, setDeclineMode] = useState(false);
  const [disputeMode, setDisputeMode] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // function to set the calcData states
  const getTimeData = (paymentLoad) => {
    // fill in all missing amounts with zero
    paymentLoad.items.forEach((item) => {
      if (!item.amount) item.amount = 0;
    });
    // format dates and times
    let formattedCancelDate;
    let formattedCancelTime;
    let formattedCompleteDate;
    let formattedCompleteTime;
    let formattedRefundDate;
    let formattedRefundTime;
    let clientName;
    if (paymentLoad.canceldate) {
      formattedCancelDate = new Date(
        parseInt(paymentLoad.canceldate)
      ).toLocaleDateString("en-US");
      formattedCancelTime = new Date(
        parseInt(paymentLoad.canceldate)
      ).toLocaleTimeString("en-US");
    }
    if (paymentLoad.completedate) {
      formattedCompleteDate = new Date(
        parseInt(paymentLoad.completedate)
      ).toLocaleDateString("en-US");
      formattedCompleteTime = new Date(
        parseInt(paymentLoad.completedate)
      ).toLocaleTimeString("en-US");
    }
    if (paymentLoad.refunddate) {
      formattedRefundDate = new Date(
        parseInt(paymentLoad.refunddate)
      ).toLocaleDateString("en-US");
      formattedRefundTime = new Date(
        parseInt(paymentLoad.refunddate)
      ).toLocaleTimeString("en-US");
    }
    setCalcData((prevState) => ({
      ...prevState,
      cancelDate: formattedCancelDate,
      cancelTime: formattedCancelTime,
      completeDate: formattedCompleteDate,
      completeTime: formattedCompleteTime,
      refundDate: formattedRefundDate,
      refundTime: formattedRefundTime,
      clientname: clientName,
    }));
  };

  // get payment data
  const getPaymentData = async (paymentid, invoicelist, statedata) => {
    // if payment id is less than 100, get the specific invoice details and pass to state
    if (paymentid < 100) {
      invoicelist.forEach((invoice) => {
        if (invoice.id.toString() === paymentid) {
          setPaymentPayload({ ...invoice });
          getTimeData({ ...invoice });
          return { ...invoice };
        }
      });
    } else {
      setPaymentPayload((prevState) => ({
        ...prevState,
        ...statedata,
        status: "open",
      }));
      getTimeData({ ...statedata });
      return { ...statedata };
    }
  };

  // handle retrieving chat/advisor data
  const getAdvisorData = async (adviceid, advisorlist) => {
    advisorlist.forEach((advisor) => {
      if (advisor.id.toString() === adviceid) {
        setAdvisorPayload({ ...advisor });
        return { ...advisor };
      }
    });
  };

  useEffect(async () => {
    // if there is an adviceid and paymentid, and the invoice list exists, then retrieve invoice data
    if (idParam && paymentid)
      if (clientInvoiceList && clientInvoiceList.length) {
        getPaymentData(paymentid, clientInvoiceList);
        getAdvisorData(idParam, myAdvisorList);
        setProfileInfo(clientProfileInfo);
        setIsLoading(false);
      }
      // otherwise, go back
      else {
        console.log("No invoice list found.");
        navigate(-1);
      }
    else {
      console.log("No advice id and payment id found");
      navigate(-1);
    }
  }, []);

  // RETRIEVING PAYMENT DATA (above) ===========================================================
  // HANDLING USER ACTIONS (below) =============================================================

  // #region --- all functions
  // select complete payment
  const handleCompletePayment = () => {
    if (attributes.CUSTOMER !== 1)
      alert(
        "You are not authorized to complete this payment without a verified Stripe account. Please go to account settings and set up your Stripe account before making any payments."
      );
    else {
      dispatch(showSnackbar("Payment is complete.", true, "success"));
      setIsComplete(true);
    }
  };

  // handle confirm notification modal
  const handlePaymentNotification = () => {
    setIsDeclined(false);
    setIsComplete(false);
    navigate("/client/payments");
  };

  // when submit button is selected.
  const handleSubmitDispute = async (title, message) => {
    // send email to the user with a link to reset their password
    await adviceService
      .postDispute({
        title: title,
        message: message,
        paymentid: paymentid,
        adviceid: adviceid,
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          setDisputeMode(false);
          setPaymentPayload((prevState) => ({
            ...prevState,
            payment: {
              ...prevState,
              status: "disputed",
            },
          }));
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
  };

  // handle declining payment
  const handleDeclineConfirm = async () => {
    await adviceService
      .deletePayment({ paymentid: paymentid, adviceid: adviceid })
      .then((response) => {
        if (!!response.data.payload.success) {
          setIsDeclined(true);
          setIsComplete(false);
          setPaymentPayload((prevState) => ({
            ...prevState,
            payment: {
              ...prevState,
              status: "declined",
            },
          }));
          dispatch(showSnackbar("Payment has been declined.", true, "success"));
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
        }
        setIsLoading(false);
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

  // #endregion

  return (
    <>
      {!isLoading ? (
        <>
          <ConfirmDeleteModal
            open={declineMode}
            handleConfirm={handleDeclineConfirm}
            handleCancel={() => setDeclineMode(false)}
            heading="Decline Payment?"
            body={`NOTE: If this is the first invoice from ${advisorPayload.name}, then the your request will be cancelled and the chat will be disconnected should you choose to decline the payment.`}
            action="Decline"
          />
          <ErrorModal
            open={isDeclined}
            heading="Payment Declined"
            body="The payment has been successfully declined. Select 'OK' to return to the payment list."
            handleErrorConfirmation={handlePaymentNotification}
          />
          <SupportRequest
            open={disputeMode}
            header={"Dispute Payment"}
            handleCancel={() => setDisputeMode(false)}
            handleConfirm={handleSubmitDispute}
          />
          <GenericPage
            pageHeader="Payment Overview"
            backlink={
              location.state && location.state.backlink
                ? location.state.backlink
                : ""
            }
            buttonlist={
              paymentPayload.status === "open"
                ? [
                    {
                      name: "Decline Payment",
                      color: "error",
                      variant: "outlined",
                      onClick: () => setDeclineMode(true),
                    },
                    {
                      name: "Complete Payment",
                      color: "secondary",
                      variant: "contained",
                      onClick: handleCompletePayment,
                    },
                  ]
                : ["complete", "refunded"].includes(paymentPayload.status)
                ? [
                    {
                      name: "Dispute Payment",
                      color: "error",
                      variant: "outlined",
                      startIcon: <IconAlertOctagon stroke={1.25} />,
                      onClick: () => setDisputeMode(true),
                    },
                  ]
                : []
            }
          >
            <Box sx={{ display: "flex", alignItems: "center", mt: 1, mb: 1 }}>
              <Typography variant="h4" sx={{ fontWeight: "normal" }}>
                Status:
              </Typography>
              <CustomLabel
                text={paymentPayload.status}
                textStyle={{ fontSize: "1rem", fontWeight: "bold" }}
              />
            </Box>
            <SubsectionWrapper
              mb={1.5}
              title="Detailed Report"
              tipBody="Each transaction is completed through our third-party payments solution, Stripe. You can decline a first-time payment from an advisor, also known as a 'quote', without opening a dispute. To decline any subsequent payment, opening a dispute is required. Please review our platform guidelines for more information."
              buttonlist={[
                {
                  name: "Firm Profile",
                  color: "primary",
                  variant: "text",
                  startIcon: <IconExternalLink stroke={1.25} />,
                  onClick: () => {
                    window.location.href = `https://rally.markets/firm/${paymentPayload.firmslug}`;
                  },
                },
                {
                  name: "Advisor Profile",
                  color: "primary",
                  variant: "text",
                  startIcon: <IconExternalLink stroke={1.25} />,
                  onClick: () => {
                    window.location.href = `https://rally.markets/firm/${paymentPayload.firmslug}/advisor/${paymentPayload.advisorslug}`;
                  },
                },
                {
                  name: "View Chat",
                  color: "primary",
                  variant: "text",
                  startIcon: <IconMessage stroke={1.25} />,
                  onClick: () => navigate(`/client/messages/?id=${adviceid}`),
                },
              ]}
            >
              <Box sx={{ mb: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    padding: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <InvoiceTemplate
                    billto={{ ...profileInfo }}
                    billfrom={{ ...advisorPayload }}
                    lineitems={[...paymentPayload.items]}
                    subtotal={paymentPayload.subtotal}
                    invoiceid={paymentPayload.id}
                  />
                </Paper>
              </Box>
            </SubsectionWrapper>
            <SubsectionWrapper
              title="Additional Details"
              tipBody="Key information about this payment."
            >
              <Grid container>
                {/* <Grid item xs={12}>
                  <TaskList
                    tasks={paymentPayload.items}
                    editMode={false}
                    forwardedTaskListRef={taskListRef}
                    noneMessage="Line items did not load properly."
                    startAdornment="$"
                    attributeId="amount"
                  />
                </Grid> */}
                {paymentPayload.status === "open" && (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <em>Payment is pending a response.</em>
                    </Typography>
                  </Grid>
                )}
                {!!paymentPayload.refundamount ? (
                  <Grid item xs={12}>
                    <Typography className={classes.refundLine}>
                      <em>
                        Total Refunded:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          $
                          {parseFloat(paymentPayload.refundamount * -1).toFixed(
                            2
                          )}
                        </span>
                      </em>
                    </Typography>
                  </Grid>
                ) : (
                  <p></p>
                )}
                {paymentPayload.status === "cancelled" && (
                  <Grid item xs={12}>
                    <Typography className={classes.cancelledText}>
                      <em>
                        Payment Cancelled (
                        {`${calcData.cancelDate} ${calcData.cancelTime}`})
                      </em>
                    </Typography>
                  </Grid>
                )}
                {paymentPayload.status === "complete" ? (
                  <Grid item xs={12}>
                    <Typography className={classes.completeText}>
                      <em>
                        Payment Complete (
                        {`${calcData.completeDate} ${calcData.completeTime}`})
                      </em>
                    </Typography>
                  </Grid>
                ) : paymentPayload.status === "refunded" ? (
                  <Grid item xs={12}>
                    <Typography className={classes.refundLine}>
                      <em>
                        Last Refund Processed (
                        {`${calcData.refundDate} ${calcData.refundTime}`})
                      </em>
                    </Typography>
                  </Grid>
                ) : (
                  <p></p>
                )}
              </Grid>
            </SubsectionWrapper>
            <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1 }} />
            <Box
              sx={{
                mt: 2,
                width: "100%",
                display: "flex",
                justifyContent: "end",
              }}
            >
              {paymentPayload.status === "open" ? (
                <>
                  <Grid item display="flex" justifyContent={"end"}>
                    <DynamicButton
                      name="Decline Payment"
                      color="error"
                      variant="outlined"
                      onClick={() => setDeclineMode(true)}
                    />
                  </Grid>
                  <Grid item display="flex" justifyContent={"end"}>
                    <DynamicButton
                      name="Complete Payment"
                      color="secondary"
                      variant="contained"
                      onClick={handleCompletePayment}
                    />
                  </Grid>
                </>
              ) : (
                <>
                  <Grid item display="flex" justifyContent={"end"}>
                    <DynamicButton
                      name="Dispute Payment"
                      color="error"
                      variant="outlined"
                      startIcon={<IconAlertOctagon stroke={1.25} />}
                      onClick={() => setDisputeMode(true)}
                    />
                  </Grid>
                </>
              )}
            </Box>
          </GenericPage>
        </>
      ) : (
        <div> Loading... </div>
      )}
    </>
  );
};

export default InvoiceProfile;
