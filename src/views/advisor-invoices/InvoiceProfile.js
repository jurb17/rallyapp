import React, { useRef, useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Grid, Divider, Typography, Paper } from "@material-ui/core";
import {
  IconAlertOctagon,
  IconMessage,
  IconReceiptRefund,
  IconUser,
} from "@tabler/icons";

// project imports
import advisoryService from "services/advisory.service";
import RefundForm from "./forms/RefundForm";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import GenericPage from "ui-component/pages/GenericPage";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import DynamicButton from "ui-component/buttons/DynamicButton";
import { showSnackbar } from "actions/main";
import InvoiceTemplate from "ui-component/templates/InvoiceTemplate";
import accountService from "services/account.service";
import CustomLabel from "ui-component/extended/CustomLabel";

// style constant
const useStyles = makeStyles((theme) => ({
  feeLine: {
    fontSize: "1.250rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.primary.main,
  },
  refundLine: {
    fontSize: "1.250rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.error.main,
  },
  finalTotalAmount: {
    // borderTop: `1px solid ${theme.palette.primary.dark}`,
    // paddingTop: "12px",
    paddingLeft: "16px",
    fontSize: "1.250rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
  },
  cancelledText: {
    fontSize: "1.250rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.error.main,
  },
  completeText: {
    fontSize: "1.250rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.success.main,
  },
}));

// =============================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the invoice list page, client profile page, and prospect profile page

const InvoiceProfile = () => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const invoiceFormRef = useRef({});
  const taskListRef = useRef([]);

  const { adviceid, id } = useParams();

  // request states
  const [paymentid, setPaymentid] = useState(id);
  const [clientid, setClientid] = useState(adviceid);

  // data states
  const [paymentPayload, setPaymentPayload] = useState({});
  const [clientPayload, setClientPayload] = useState({});
  const [calcData, setCalcData] = useState({});
  const [account, setAccount] = useState({});

  // mode states
  const [refundMode, setRefundMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProspect, setIsProspect] = useState(false);

  // function to set the calcData states
  const getCalcData = (paymentLoad, clientLoad) => {
    // fill in all missing amounts with zero
    paymentLoad.payment.items.forEach((item) => {
      if (!item.amount) {
        item.amount = 0;
      }
    });
    // format dates and times
    let formattedCreateDate = null;
    let formattedCreateTime = null;
    let formattedCancelDate = null;
    let formattedCancelTime = null;
    let formattedCompleteDate = null;
    let formattedCompleteTime = null;
    let formattedRefundDate = null;
    let formattedRefundTime = null;
    if (paymentLoad.payment.createdate) {
      formattedCreateDate = new Date(
        parseInt(paymentLoad.payment.createdate)
      ).toLocaleDateString("en-US");
      formattedCreateTime = new Date(
        parseInt(paymentLoad.payment.createdate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        createDate: formattedCreateDate,
        createTime: formattedCreateTime,
      }));
    }
    if (paymentLoad.payment.canceldate) {
      formattedCancelDate = new Date(
        parseInt(paymentLoad.payment.canceldate)
      ).toLocaleDateString("en-US");
      formattedCancelTime = new Date(
        parseInt(paymentLoad.payment.canceldate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        cancelDate: formattedCancelDate,
        cancelTime: formattedCancelTime,
      }));
    }
    if (paymentLoad.payment.completedate) {
      formattedCompleteDate = new Date(
        parseInt(paymentLoad.payment.completedate)
      ).toLocaleDateString("en-US");
      formattedCompleteTime = new Date(
        parseInt(paymentLoad.payment.completedate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        completeDate: formattedCompleteDate,
        completeTime: formattedCompleteTime,
      }));
    }
    if (paymentLoad.payment.refunddate) {
      formattedRefundDate = new Date(
        parseInt(paymentLoad.payment.refunddate)
      ).toLocaleDateString("en-US");
      formattedRefundTime = new Date(
        parseInt(paymentLoad.payment.refunddate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        refundDate: formattedRefundDate,
        refundTime: formattedRefundTime,
      }));
    }
    // set the client name state
    if (paymentLoad.client.name) {
      setCalcData((prevState) => ({
        ...prevState,
        clientname: paymentLoad.client.name,
      }));
    }
  };

  // function to set the paymentPayload and clientPayload states
  const getInvoiceData = async () => {
    // get invoice payload
    await advisoryService
      .getPayment({
        clientid: clientid,
        paymentid: paymentid,
      })
      .then(async (paymentResponse) => {
        if (!!paymentResponse.data.payload.success) {
          setPaymentPayload({ ...paymentResponse.data.payload });
          // get client payload
          await advisoryService
            .getClient({
              clientid: clientid,
            })
            .then(async (clientResponse) => {
              if (!!clientResponse.data.payload.success) {
                // check the client object in the payload, then determine if the client is a prospect.
                if (
                  Object.entries(clientResponse.data.payload.client).length > 0
                ) {
                  setClientPayload({ ...clientResponse.data.payload });
                  // get calc data
                  getCalcData(
                    paymentResponse.data.payload,
                    clientResponse.data.payload
                  );
                } else {
                  setIsProspect(true);
                }
                setIsLoading(false);
                // }
              } else {
                dispatch(
                  showSnackbar(clientResponse.data.details.text, true, "error")
                );
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
          dispatch(
            showSnackbar(paymentResponse.data.details.text, true, "error")
          );
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
  };

  // get account details
  const getAccountDetails = () => {
    return new Promise(async (resolve, reject) => {
      setIsLoading(true);
      await accountService
        .getAccount({})
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response.data.payload.user);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // get current data from the server
  useEffect(async () => {
    // logic of the useEffect request
    if (!!clientid && !!paymentid) {
      getAccountDetails()
        .then((data) => {
          setAccount(data);
          getInvoiceData();
        })
        .catch((error) => {
          console.log("uncaught error", error);
          dispatch(
            showSnackbar("Unable to get account details", true, "error")
          );
          navigate(-1);
        });
    } else {
      dispatch(
        showSnackbar("No advice ID or payment ID found", true, "warning")
      );
      setIsLoading(false);
      if (!!location.state.backlink) {
        navigate(location.state.backlink);
      } else {
        navigate(-1);
      }
    }
  }, []);

  // #region - handle data changes
  // confirm refund
  const handleRefundSubmit = async (refundObj) => {
    setIsLoading(true);
    setRefundMode(false);
    await advisoryService
      .postPaymentRefund({
        paymentid: paymentid,
        amount: parseFloat(parseFloat(refundObj.amount).toFixed(2)),
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          const newdate = new Date();
          setPaymentPayload((prevState) => ({
            ...prevState,
            payment: {
              ...paymentPayload.payment,
              status: "refunded",
              refundamount: (
                parseFloat(
                  paymentPayload.payment.refundamount
                    ? paymentPayload.payment.refundamount
                    : 0.0
                ) - parseFloat(refundObj.amount)
              ).toFixed(2),
            },
          }));
          setCalcData((prevState) => ({
            ...prevState,
            refundDate: newdate.toLocaleDateString("en-US"),
            refundTime: newdate.toLocaleTimeString("en-US"),
          }));
          dispatch(
            showSnackbar("Refund submitted successfully", true, "success")
          );
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log("caught error", response.data.details.text);
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

  // confirm delete
  const handleCancelConfirm = async () => {
    // there is no form to validate here.
    await advisoryService
      .deletePayment({ paymentid: paymentid })
      .then((response) => {
        if (!!response.data.payload.success) {
          // if the user has opened checkout
          if (
            paymentPayload.payment.status === "open" &&
            response.data.payload.text === "Cannot Retract Accepted Payment" // is Justin still returning this string value?
          ) {
            dispatch(
              showSnackbar(
                "Client has opened the checkout page. Cannot retract payment while checkout page is in use.",
                true
              )
            );
          } else {
            const newdate = new Date();
            setPaymentPayload((prevState) => ({
              ...prevState,
              payment: {
                ...paymentPayload.payment,
                status: "cancelled",
              },
            }));
            setCalcData((prevState) => ({
              ...prevState,
              cancelDate: newdate.toLocaleDateString("en-US"),
              cancelTime: newdate.toLocaleTimeString("en-US"),
            }));
            dispatch(
              showSnackbar("Invoice Cancelled Successfully", true, "success")
            );
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log("caught error", response.data.details.text);
        }
        setDeleteMode(false);
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

  // calculate remaining total after refund
  const calcRemainingTotal = () => {
    if (
      !!paymentPayload.payment.refundamount &&
      !!paymentPayload.payment.feerefund
    ) {
      return (
        parseFloat(paymentPayload.payment.total) -
        parseFloat(paymentPayload.payment.fee) -
        parseFloat(paymentPayload.payment.refundamount * -1) +
        parseFloat(paymentPayload.payment.feerefund * -1)
      ).toFixed(2);
    } else if (!!paymentPayload.payment.refundamount) {
      return (
        parseFloat(paymentPayload.payment.total) -
        parseFloat(paymentPayload.payment.fee) -
        parseFloat(paymentPayload.payment.refundamount * -1)
      ).toFixed(2);
    }
    return (
      parseFloat(paymentPayload.payment.total) -
      parseFloat(paymentPayload.payment.fee)
    ).toFixed(2);
  };

  // #endregion

  return (
    <>
      <ConfirmDeleteModal
        open={deleteMode}
        handleConfirm={handleCancelConfirm}
        handleCancel={() => setDeleteMode(false)}
        heading={"Are you sure you want to cancel this invoice?"}
        body="A record of this invoice will be recorded, but this action cannot be undone."
        action={"Cancel Invoice"}
        nonaction={"Nevermind"}
      />
      {isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <>
          {/* refund form modal, doesn't need to be centered */}
          <RefundForm
            open={refundMode}
            subtotalAfterRefund={
              !!paymentPayload.payment.refundamount
                ? Math.max(calcRemainingTotal(), 0).toFixed(2)
                : (
                    parseFloat(paymentPayload.payment.total) -
                    parseFloat(paymentPayload.payment.fee)
                  ).toFixed(2)
            }
            handleRefundSubmit={handleRefundSubmit}
            handleRefundCancel={() => setRefundMode(false)}
          />
          <GenericPage
            pageHeader="Invoice Overview"
            backlink={
              location.state && location.state.backlink
                ? location.state.backlink
                : null
            }
            buttonlist={
              paymentPayload.payment.status === "open"
                ? [
                    {
                      name: "Cancel Invoice",
                      color: "error",
                      variant: "outlined",
                      startIcon: <IconAlertOctagon stroke={1.25} />,
                      onClick: () => setDeleteMode(true),
                    },
                  ]
                : paymentPayload.payment.status === "complete" ||
                  (paymentPayload.payment.status === "refunded" &&
                    calcRemainingTotal() > 0)
                ? [
                    {
                      name: "Process Refund",
                      color: "primary",
                      variant: "outlined",
                      startIcon: <IconReceiptRefund stroke={1.25} />,
                      onClick: () => setRefundMode(true),
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
              title="Detailed Report"
              tipBody="This is the report of invoice information, including parties involved and the itemized list of deliverables. Please direct all communication with the client to the chat."
              mb={1.5}
              buttonlist={[
                {
                  name: "View Profile",
                  color: "primary",
                  variant: "text",
                  startIcon: <IconUser stroke={1.25} />,
                  onClick: () =>
                    navigate(
                      !!isProspect
                        ? `/adv/prospects/${clientid}`
                        : `/adv/clients/${clientid}`
                    ),
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
              <Box sx={{ mb: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    padding: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <InvoiceTemplate
                    billto={{ ...clientPayload.client }}
                    billfrom={{ ...account }}
                    lineitems={[...paymentPayload.payment.items]}
                    subtotal={paymentPayload.payment.subtotal}
                    invoiceid={paymentPayload.payment.id}
                    createdate={calcData.createDate}
                    canceldate={calcData.cancelDate}
                    completedate={calcData.completeDate}
                    refunddate={calcData.refundDate}
                  />
                </Paper>
              </Box>{" "}
            </SubsectionWrapper>
            {!["open"].includes(paymentPayload.payment.status) && (
              <SubsectionWrapper
                pt={0}
                mb={1.5}
                title="Additional Details"
                tipBody="This is a log of the events that have taken place during the life of this invoice."
              >
                <Grid container>
                  {!!paymentPayload.payment.fee && (
                    <Grid item xs={12}>
                      <Typography className={classes.feeLine}>
                        <em>
                          Platform Fee:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            ${parseFloat(paymentPayload.payment.fee).toFixed(2)}
                          </span>
                        </em>
                        {!!paymentPayload.payment.feerefund && (
                          <em>
                            {" ("}Refunded:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              $
                              {parseFloat(
                                paymentPayload.payment.feerefund * -1
                              ).toFixed(2)}
                            </span>
                            {")"}
                          </em>
                        )}
                      </Typography>
                    </Grid>
                  )}
                  {!!paymentPayload.payment.refundamount && (
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
                  )}
                  {!["open", "cancelled", "declined"].includes(
                    paymentPayload.payment.status
                  ) && (
                    <Grid item xs={12}>
                      <Typography className={classes.finalTotalAmount}>
                        {"Total Received: "}
                        <span style={{ fontWeight: "bold" }}>
                          {!!paymentPayload.payment.refundamount
                            ? "$" + Math.max(calcRemainingTotal(), 0).toFixed(2)
                            : "$" +
                              Math.max(
                                parseFloat(
                                  paymentPayload.payment.subtotal -
                                    paymentPayload.payment.fee
                                ),
                                0
                              ).toFixed(2)}
                        </span>
                      </Typography>
                    </Grid>
                  )}
                  {paymentPayload.payment.status === "cancelled" && (
                    <Grid item xs={12}>
                      <Typography className={classes.cancelledText}>
                        <em>
                          Invoice Cancelled (
                          {`${calcData.cancelDate} ${calcData.cancelTime}`})
                        </em>
                      </Typography>
                    </Grid>
                  )}
                  {paymentPayload.payment.status === "complete" ? (
                    <Grid item xs={12}>
                      <Typography className={classes.completeText}>
                        <em>
                          Invoice Complete (
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
            )}
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
                      name="Cancel Invoice"
                      color="error"
                      variant="outlined"
                      startIcon={<IconAlertOctagon stroke={1.25} />}
                      onClick={() => setDeleteMode(true)}
                    />
                  </Grid>
                </>
              ) : (paymentPayload.payment.status === "complete" ||
                  paymentPayload.payment.status === "refunded") &&
                (
                  parseFloat(paymentPayload.payment.total) -
                  parseFloat(paymentPayload.payment.fee) -
                  parseFloat(paymentPayload.payment.refundamount * -1) +
                  parseFloat(paymentPayload.payment.feerefund * -1)
                ).toFixed(2) > 0 ? (
                <>
                  <Grid item display="flex" justifyContent={"end"}>
                    <DynamicButton
                      name="Process Refund"
                      color="primary"
                      variant="outlined"
                      startIcon={<IconReceiptRefund stroke={1.25} />}
                      onClick={() => setRefundMode(true)}
                    />
                  </Grid>
                </>
              ) : (
                <p></p>
              )}
            </Box>
          </GenericPage>
        </>
      )}
    </>
  );
};

export default InvoiceProfile;
