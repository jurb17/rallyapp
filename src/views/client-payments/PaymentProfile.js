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
import accountService from "services/account.service";
import CustomLabel from "ui-component/extended/CustomLabel";

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

  // request states
  const [paymentid, setPaymentid] = useState(id);

  // data states
  const [paymentPayload, setPaymentPayload] = useState({});
  const [advisorPayload, setAdvisorPayload] = useState({});
  const [calcData, setCalcData] = useState({});
  const [account, setAccount] = useState({});

  // mode states
  const [isComplete, setIsComplete] = useState(false);
  const [declineMode, setDeclineMode] = useState(false);
  const [disputeMode, setDisputeMode] = useState(false);
  const [isDeclined, setIsDeclined] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // function to set the calcData states
  const getCalcData = (paymentLoad) => {
    // fill in all missing amounts with zero
    paymentLoad.payment.items.forEach((item) => {
      if (!item.amount) {
        item.amount = 0;
      }
    });
    // format dates and times
    let formattedCancelDate;
    let formattedCancelTime;
    let formattedCompleteDate;
    let formattedCompleteTime;
    let formattedRefundDate;
    let formattedRefundTime;
    let clientName;
    if (paymentLoad.payment.canceldate) {
      formattedCancelDate = new Date(
        parseInt(paymentLoad.payment.canceldate)
      ).toLocaleDateString("en-US");
      formattedCancelTime = new Date(
        parseInt(paymentLoad.payment.canceldate)
      ).toLocaleTimeString("en-US");
    }
    if (paymentLoad.payment.completedate) {
      formattedCompleteDate = new Date(
        parseInt(paymentLoad.payment.completedate)
      ).toLocaleDateString("en-US");
      formattedCompleteTime = new Date(
        parseInt(paymentLoad.payment.completedate)
      ).toLocaleTimeString("en-US");
    }
    if (paymentLoad.payment.refunddate) {
      formattedRefundDate = new Date(
        parseInt(paymentLoad.payment.refunddate)
      ).toLocaleDateString("en-US");
      formattedRefundTime = new Date(
        parseInt(paymentLoad.payment.refunddate)
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

  // get Advisor profile data
  const getAdvisorListData = (advid) => {
    return new Promise(async (resolve, reject) => {
      await adviceService
        .getChatList({})
        .then(async (response) => {
          if (response.data.payload.success) {
            if (
              !!response.data.payload.messages &&
              response.data.payload.messages.length > 0
            ) {
              // get the name of the advisor when the advisor id matches the id in the url
              let advisors = response.data.payload.messages;
              let advisormap = {};
              const advisor = advisors.find(
                (advisor) => advisor.adviceid === advid
              );
              if (!!advisor) {
                // name is split by a forward slash
                const firmslug = advisor.name.split("/")[0];
                const advisorslug = advisor.name.split("/")[1];
                // get more advisor data to reach the name of the advisor
                const advisordata = await getAdvisorData(firmslug, advisorslug);
                advisormap[advisor.adviceid] = {
                  ...advisor,
                  ...advisordata,
                  firmslug: firmslug,
                  advisorslug: advisorslug,
                };
              }
              resolve(advisormap);
            }
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            console.log("caught error", response.data.details.text);
            reject(error);
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
          reject(error);
        });
    });
  };

  // handle retrieving chat/advisor data
  const getAdvisorData = async (firmslug, advisorslug) => {
    return new Promise(async (resolve, reject) => {
      await adviceService
        .getAdvisor({ firmslug: firmslug }, { advisor: advisorslug })
        .then((response) => {
          if (!!response.data.payload.success) {
            const advisor = response.data.payload.advisor;
            advisor.firstname = advisor.name.split(" ")[0];
            advisor.lastname = advisor.name.split(" ")[1];
            advisor.city = advisor.location.split(", ")[0];
            advisor.state = advisor.location.split(", ")[1];
            setAdvisorPayload((prevState) => ({
              ...prevState,
              ...advisor,
            }));
            resolve({ ...advisor });
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
    });
  };

  // get payment data
  const getPaymentData = async (advid, advisormap) => {
    adviceService
      .getPayment({ paymentid: paymentid })
      .then((response) => {
        if (!!response.data.payload.success) {
          let paymentLoad = { ...response.data.payload, ...advisormap[advid] };
          setPaymentPayload(paymentLoad);
          // get calc data
          getCalcData(paymentLoad);
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
        setIsLoading(false);
      });
  };

  // get account details
  const getAccountDetails = () => {
    return new Promise(async (resolve, reject) => {
      setIsLoading(true);
      await accountService
        .getAccount({})
        .then((response) => {
          if (!!response.data.payload.success) {
            setAccount(response.data.payload.user);
            resolve(response.data.payload.user);
          }
        })
        .catch((error) => {
          console.log("uncaught error", error);
          dispatch(
            showSnackbar("Unable to get account details", true, "error")
          );
          reject(error);
        });
    });
  };

  useEffect(async () => {
    // if the request data is available, send the request
    if (!!paymentid && !!adviceid) {
      await getAccountDetails();
      getAdvisorListData(adviceid).then((advisormap) => {
        getPaymentData(adviceid, advisormap);
      });
    } else {
      dispatch(showSnackbar("No payment id found", true, "warning"));
      navigate(-1);
    }
  }, []);

  // RETRIEVING PAYMENT DATA (above) ===========================================================
  // HANDLING USER ACTIONS (below) =============================================================

  // #region --- all functions
  // select complete payment
  const handleCompletePayment = () => {
    if (attributes.CUSTOMER !== 1) {
      alert(
        "You are not authorized to complete this payment without a verified Stripe account. Please go to account settings and set up your Stripe account before making any payments."
      );
    } else {
      adviceService
        .postPayment({
          paymentid: paymentid,
          adviceid: adviceid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            if (!!response.data.payload.payment.url) {
              window.location.href = response.data.payload.payment.url;
            } else {
              setPaymentPayload((prevState) => ({
                ...prevState,
                payment: {
                  ...prevState.payment,
                  status: "complete",
                },
              }));
              dispatch(showSnackbar("Payment is complete.", true, "success"));
              setIsComplete(true);
            }
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
              ...prevState.payment,
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
              ...prevState.payment,
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
              paymentPayload.payment.status === "open"
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
                : ["complete", "refunded"].includes(
                    paymentPayload.payment.status
                  )
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
                text={paymentPayload.payment.status}
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
                    billto={{ ...account }}
                    billfrom={{ ...advisorPayload }}
                    lineitems={[...paymentPayload.payment.items]}
                    subtotal={paymentPayload.payment.subtotal}
                    invoiceid={paymentPayload.payment.id}
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
                    tasks={paymentPayload.payment.items}
                    editMode={false}
                    forwardedTaskListRef={taskListRef}
                    noneMessage="Line items did not load properly."
                    startAdornment="$"
                    attributeId="amount"
                  />
                </Grid> */}
                {paymentPayload.payment.status === "open" && (
                  <Grid item xs={12}>
                    <Typography variant="body1">
                      <em>Payment is pending a response.</em>
                    </Typography>
                  </Grid>
                )}
                {!!paymentPayload.payment.refundamount ? (
                  <Grid item xs={12}>
                    <Typography className={classes.refundLine}>
                      <em>
                        Total Refunded:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          $
                          {parseFloat(
                            paymentPayload.payment.refundamount * -1
                          ).toFixed(2)}
                        </span>
                      </em>
                    </Typography>
                  </Grid>
                ) : (
                  <p></p>
                )}
                {paymentPayload.payment.status === "cancelled" && (
                  <Grid item xs={12}>
                    <Typography className={classes.cancelledText}>
                      <em>
                        Payment Cancelled (
                        {`${calcData.cancelDate} ${calcData.cancelTime}`})
                      </em>
                    </Typography>
                  </Grid>
                )}
                {paymentPayload.payment.status === "complete" ? (
                  <Grid item xs={12}>
                    <Typography className={classes.completeText}>
                      <em>
                        Payment Complete (
                        {`${calcData.completeDate} ${calcData.completeTime}`})
                      </em>
                    </Typography>
                  </Grid>
                ) : paymentPayload.payment.status === "refunded" ? (
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
              {paymentPayload.payment.status === "open" ? (
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
