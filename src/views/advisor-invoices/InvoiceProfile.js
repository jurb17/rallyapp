import React, { useState, useEffect } from "react";
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
import RefundForm from "./forms/RefundForm";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import GenericPage from "ui-component/pages/GenericPage";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import DynamicButton from "ui-component/buttons/DynamicButton";
import { showSnackbar } from "actions/main";
import InvoiceTemplate from "ui-component/templates/InvoiceTemplate";
import CustomLabel from "ui-component/extended/CustomLabel";

// data and functions
import {
  myClientList,
  myInvoiceList,
  myProfileInfo,
  myProspectList,
} from "utils/advisor-dummy-data";

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

  const { adviceid, id } = useParams();
  const idParam = adviceid;
  const paymentid = id;

  // data states
  const [paymentPayload, setPaymentPayload] = useState({});
  const [adviseePayload, setAdviseePayload] = useState({});
  const [calcData, setCalcData] = useState({});
  const [profileInfo, setProfileInfo] = useState({});

  // mode states
  const [refundMode, setRefundMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProspect, setIsProspect] = useState(false);

  // function to set the calcData states
  const getTimeData = (paymentLoad) => {
    // fill in all missing amounts with zero
    paymentLoad.items.forEach((item) => {
      if (!item.amount) item.amount = 0;
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
    if (paymentLoad.createdate) {
      formattedCreateDate = new Date(
        parseInt(paymentLoad.createdate)
      ).toLocaleDateString("en-US");
      formattedCreateTime = new Date(
        parseInt(paymentLoad.createdate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        createDate: formattedCreateDate,
        createTime: formattedCreateTime,
      }));
    }
    if (paymentLoad.canceldate) {
      formattedCancelDate = new Date(
        parseInt(paymentLoad.canceldate)
      ).toLocaleDateString("en-US");
      formattedCancelTime = new Date(
        parseInt(paymentLoad.canceldate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        cancelDate: formattedCancelDate,
        cancelTime: formattedCancelTime,
      }));
    }
    if (paymentLoad.completedate) {
      formattedCompleteDate = new Date(
        parseInt(paymentLoad.completedate)
      ).toLocaleDateString("en-US");
      formattedCompleteTime = new Date(
        parseInt(paymentLoad.completedate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        completeDate: formattedCompleteDate,
        completeTime: formattedCompleteTime,
      }));
    }
    if (paymentLoad.refunddate) {
      formattedRefundDate = new Date(
        parseInt(paymentLoad.refunddate)
      ).toLocaleDateString("en-US");
      formattedRefundTime = new Date(
        parseInt(paymentLoad.refunddate)
      ).toLocaleTimeString("en-US");
      setCalcData((prevState) => ({
        ...prevState,
        refundDate: formattedRefundDate,
        refundTime: formattedRefundTime,
      }));
    }
    // set the client name state
    if (paymentLoad.name)
      setCalcData((prevState) => ({
        ...prevState,
        clientname: paymentLoad.name,
      }));
  };

  // function to set the paymentPayload and adviseePayload states
  const getInvoiceData = (paymentid, invoicelist) => {
    // get the specific invoice details and pass to state
    invoicelist.forEach((invoice) => {
      if (invoice.id.toString() === paymentid) {
        setPaymentPayload({ ...invoice });
        getTimeData({ ...invoice });
        return { ...invoice };
      }
    });
  };

  // function to get client or prospect data
  const getAdviseeData = (adviceid, clientlist, prospectlist) => {
    prospectlist.forEach((prospect) => {
      if (prospect.id.toString() === adviceid) {
        setAdviseePayload({ ...prospect });
        setIsProspect(true);
        return { ...prospect };
      }
    });
    clientlist.forEach((client) => {
      if (client.id.toString() === adviceid) {
        setAdviseePayload({ ...client });
        setIsProspect(false);
        return { ...client };
      }
    });
  };

  // get current data from the server
  useEffect(() => {
    // if there is an adviceid and paymentid, and the invoice list exists, then retrieve invoice data
    if (idParam && paymentid)
      if (myInvoiceList && myInvoiceList.length) {
        getInvoiceData(paymentid, myInvoiceList);
        getAdviseeData(idParam, myClientList, myProspectList);
        setProfileInfo(myProfileInfo);
        setIsLoading(false);
      }
      // otherwise, go back
      else {
        console.log("No client list found.");
        navigate(-1);
      }
    else navigate(-1);
  }, []);

  // #region - handle data changes
  // confirm refund
  const handleRefundSubmit = async (refundObj) => {
    // !!! A LOT OF STATE CHANGES THAT WILL INSTIGATE PAGE RELOADING.
    setIsLoading(true);
    const newdate = new Date();
    setPaymentPayload((prevState) => ({
      ...prevState,
      payment: {
        ...paymentPayload,
        status: "refunded",
        refundamount: (
          parseFloat(
            paymentPayload.refundamount ? paymentPayload.refundamount : 0.0
          ) - parseFloat(refundObj.amount)
        ).toFixed(2),
      },
    }));
    setCalcData((prevState) => ({
      ...prevState,
      refundDate: newdate.toLocaleDateString("en-US"),
      refundTime: newdate.toLocaleTimeString("en-US"),
    }));
    dispatch(showSnackbar("Refund submitted successfully", true, "success"));
    setRefundMode(false);
  };

  // confirm delete
  const handleCancelConfirm = async () => {
    // if the user has opened checkout
    if (paymentPayload.status === "open")
      dispatch(
        showSnackbar(
          "Client has opened the checkout page. Cannot retract payment while checkout page is in use.",
          true
        )
      );
    else {
      const newdate = new Date();
      setPaymentPayload((prevState) => ({
        ...prevState,
        payment: {
          ...paymentPayload,
          status: "cancelled",
        },
      }));
      setCalcData((prevState) => ({
        ...prevState,
        cancelDate: newdate.toLocaleDateString("en-US"),
        cancelTime: newdate.toLocaleTimeString("en-US"),
      }));
      dispatch(showSnackbar("Invoice Cancelled Successfully", true, "success"));
    }
    setDeleteMode(false);
  };

  // calculate remaining total after refund
  const calcRemainingTotal = () => {
    if (paymentPayload.refundamount && paymentPayload.feerefund) {
      return (
        parseFloat(paymentPayload.total) -
        parseFloat(paymentPayload.fee) -
        parseFloat(paymentPayload.refundamount * -1) +
        parseFloat(paymentPayload.feerefund * -1)
      ).toFixed(2);
    } else if (!!paymentPayload.refundamount) {
      return (
        parseFloat(paymentPayload.total) -
        parseFloat(paymentPayload.fee) -
        parseFloat(paymentPayload.refundamount * -1)
      ).toFixed(2);
    }
    return (
      parseFloat(paymentPayload.total) - parseFloat(paymentPayload.fee)
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
              !!paymentPayload.refundamount
                ? Math.max(calcRemainingTotal(), 0).toFixed(2)
                : (
                    parseFloat(paymentPayload.total) -
                    parseFloat(paymentPayload.fee)
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
              paymentPayload.status === "open"
                ? [
                    {
                      name: "Cancel Invoice",
                      color: "error",
                      variant: "outlined",
                      startIcon: <IconAlertOctagon stroke={1.25} />,
                      onClick: () => setDeleteMode(true),
                    },
                  ]
                : paymentPayload.status === "complete" ||
                  (paymentPayload.status === "refunded" &&
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
                      isProspect
                        ? `/adv/prospects/${adviseePayload.id}`
                        : `/adv/clients/${adviseePayload.id}`
                    ),
                },
                {
                  name: "View Chat",
                  color: "primary",
                  variant: "text",
                  startIcon: <IconMessage stroke={1.25} />,
                  onClick: () =>
                    navigate(`/adv/messages/?id=${adviseePayload.id}`),
                },
              ]}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: "normal" }}>
                  Status:
                </Typography>
                <CustomLabel
                  text={paymentPayload.status}
                  textStyle={{ fontSize: "1rem", fontWeight: "bold" }}
                />
              </Box>
              <Box sx={{ mb: 2 }}>
                <Paper
                  variant="outlined"
                  sx={{
                    padding: 2,
                    backgroundColor: theme.palette.background.paper,
                  }}
                >
                  <InvoiceTemplate
                    adviceid={adviseePayload.id}
                    billto={{ ...adviseePayload }}
                    billfrom={{ ...profileInfo }}
                    lineitems={[...paymentPayload.items]}
                    subtotal={paymentPayload.subtotal}
                    createdate={calcData.createDate}
                    canceldate={calcData.cancelDate}
                    completedate={calcData.completeDate}
                    refunddate={calcData.refundDate}
                  />
                </Paper>
              </Box>{" "}
            </SubsectionWrapper>
            {!["open"].includes(paymentPayload.status) && (
              <SubsectionWrapper
                pt={0}
                mb={1.5}
                title="Additional Details"
                tipBody="This is a log of the events that have taken place during the life of this invoice."
              >
                <Grid container>
                  {paymentPayload.fee && (
                    <Grid item xs={12}>
                      <Typography className={classes.feeLine}>
                        <em>
                          Platform Fee:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            ${parseFloat(paymentPayload.fee).toFixed(2)}
                          </span>
                        </em>
                        {paymentPayload.feerefund && (
                          <em>
                            {" ("}Refunded:{" "}
                            <span style={{ fontWeight: "bold" }}>
                              $
                              {parseFloat(
                                paymentPayload.feerefund * -1
                              ).toFixed(2)}
                            </span>
                            {")"}
                          </em>
                        )}
                      </Typography>
                    </Grid>
                  )}
                  {paymentPayload.refundamount && (
                    <Grid item xs={12}>
                      <Typography className={classes.refundLine}>
                        <em>
                          Total Refunded:{" "}
                          <span style={{ fontWeight: "bold" }}>
                            $
                            {parseFloat(
                              paymentPayload.refundamount * -1
                            ).toFixed(2)}
                          </span>
                        </em>
                      </Typography>
                    </Grid>
                  )}
                  {!["open", "cancelled", "declined"].includes(
                    paymentPayload.status
                  ) && (
                    <Grid item xs={12}>
                      <Typography className={classes.finalTotalAmount}>
                        {"Total Received: "}
                        <span style={{ fontWeight: "bold" }}>
                          {paymentPayload.refundamount
                            ? "$" + Math.max(calcRemainingTotal(), 0).toFixed(2)
                            : "$" +
                              Math.max(
                                parseFloat(
                                  paymentPayload.subtotal - paymentPayload.fee
                                ),
                                0
                              ).toFixed(2)}
                        </span>
                      </Typography>
                    </Grid>
                  )}
                  {paymentPayload.status === "cancelled" && (
                    <Grid item xs={12}>
                      <Typography className={classes.cancelledText}>
                        <em>
                          Invoice Cancelled (
                          {`${calcData.cancelDate} ${calcData.cancelTime}`})
                        </em>
                      </Typography>
                    </Grid>
                  )}
                  {paymentPayload.status === "complete" ? (
                    <Grid item xs={12}>
                      <Typography className={classes.completeText}>
                        <em>
                          Invoice Complete (
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
              {paymentPayload.status === "open" ? (
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
              ) : (paymentPayload.status === "complete" ||
                  paymentPayload.status === "refunded") &&
                (
                  parseFloat(paymentPayload.total) -
                  parseFloat(paymentPayload.fee) -
                  parseFloat(paymentPayload.refundamount * -1) +
                  parseFloat(paymentPayload.feerefund * -1)
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
