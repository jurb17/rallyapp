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
  createdText: {
    fontSize: "1.250rem",
    fontWeight: 500,
    marginTop: "12px",
    paddingRight: "12px",
    float: "right",
    color: theme.palette.grey[800],
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

  console.log("necesary", idParam, paymentid);

  // data states
  const [paymentPayload, setPaymentPayload] = useState({});
  const [adviseePayload, setAdviseePayload] = useState({});
  const [timeData, setTimeData] = useState({});
  const [profileInfo, setProfileInfo] = useState({});

  // mode states
  const [refundMode, setRefundMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isProspect, setIsProspect] = useState(false);

  // function to set the timeData states
  const getTimeData = (payment) => {
    // fill in all missing amounts with zero
    payment.lineitems.forEach((item) => {
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
    if (payment.createdate) {
      formattedCreateDate = new Date(
        parseInt(payment.createdate)
      ).toLocaleDateString("en-US");
      formattedCreateTime = new Date(
        parseInt(payment.createdate)
      ).toLocaleTimeString("en-US");
      setTimeData((prevState) => ({
        ...prevState,
        createDate: formattedCreateDate,
        createTime: formattedCreateTime,
      }));
    }
    if (payment.canceldate) {
      formattedCancelDate = new Date(
        parseInt(payment.canceldate)
      ).toLocaleDateString("en-US");
      formattedCancelTime = new Date(
        parseInt(payment.canceldate)
      ).toLocaleTimeString("en-US");
      setTimeData((prevState) => ({
        ...prevState,
        cancelDate: formattedCancelDate,
        cancelTime: formattedCancelTime,
      }));
    }
    if (payment.completedate) {
      formattedCompleteDate = new Date(
        parseInt(payment.completedate)
      ).toLocaleDateString("en-US");
      formattedCompleteTime = new Date(
        parseInt(payment.completedate)
      ).toLocaleTimeString("en-US");
      setTimeData((prevState) => ({
        ...prevState,
        completeDate: formattedCompleteDate,
        completeTime: formattedCompleteTime,
      }));
    }
    if (payment.refunddate) {
      formattedRefundDate = new Date(
        parseInt(payment.refunddate)
      ).toLocaleDateString("en-US");
      formattedRefundTime = new Date(
        parseInt(payment.refunddate)
      ).toLocaleTimeString("en-US");
      setTimeData((prevState) => ({
        ...prevState,
        refundDate: formattedRefundDate,
        refundTime: formattedRefundTime,
      }));
    }
    // set the client name state
    if (payment.name)
      setTimeData((prevState) => ({
        ...prevState,
        clientname: payment.name,
      }));
  };

  // function to set the paymentPayload and adviseePayload states
  const getInvoiceData = (paymentid, invoicelist, statedata) => {
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
        getInvoiceData(paymentid, myInvoiceList, location.state);
        getAdviseeData(idParam, myClientList, myProspectList);
        setProfileInfo(myProfileInfo);
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

  console.log("data", paymentPayload);

  // #region - handle data changes
  // calculate the invoice fee
  const calculateFee = (payment) => {
    if (payment.feerate)
      return parseFloat(payment.feerate * payment.subtotal).toFixed(2);
    else return parseFloat(0.15 * payment.subtotal).toFixed(2);
  };

  // calculaute the invoice total with fee
  const calculateTotal = (payment) => {
    if (payment.refundamount && payment.feerefund) {
      return parseFloat(
        parseFloat(payment.subtotal) +
          parseFloat(calculateFee({ ...payment })) -
          parseFloat(paymentPayload.refundamount * -1) -
          parseFloat(paymentPayload.feerefund * -1)
      ).toFixed(2);
    } else if (paymentPayload.refundamount) {
      return parseFloat(
        parseFloat(payment.subtotal) +
          parseFloat(calculateFee({ ...paymentPayload })) -
          parseFloat(paymentPayload.refundamount * -1)
      ).toFixed(2);
    }
    return parseFloat(
      parseFloat(payment.subtotal) + parseFloat(calculateFee(payment))
    ).toFixed(2);
  };

  // handle submitting payment (IN PLACE OF STRIPE PROCESS)
  const handlePaymentSubmit = (payload) => {
    setIsLoading(true);
    const newdate = new Date();
    setPaymentPayload((prevState) => ({
      ...prevState,
      status: "complete",
      completedate: newdate,
    }));
    setTimeData((prevState) => ({
      completeDate: newdate.toLocaleDateString("en-US"),
      refundTime: newdate.toLocaleTimeString("en-US"),
    }));
    dispatch(showSnackbar("Refund submitted successfully", true, "success"));
    setRefundMode(false);
  };

  // confirm refund
  const handleRefundSubmit = (refundObj) => {
    // !!! A LOT OF STATE CHANGES THAT WILL INSTIGATE PAGE RELOADING.
    setIsLoading(true);
    const newdate = new Date();
    setPaymentPayload((prevState) => ({
      ...prevState,
      status: "refunded",
      refunddate: newdate,
      refundamount: (
        parseFloat(
          paymentPayload.refundamount ? paymentPayload.refundamount : 0.0
        ) - parseFloat(refundObj.amount)
      ).toFixed(2),
    }));
    setTimeData((prevState) => ({
      ...prevState,
      refundDate: newdate.toLocaleDateString("en-US"),
      refundTime: newdate.toLocaleTimeString("en-US"),
    }));
    dispatch(showSnackbar("Refund submitted successfully", true, "success"));
    setRefundMode(false);
  };

  // confirm cancel
  const handleCancelConfirm = () => {
    // if the user has opened checkout
    if (paymentPayload.status === "in process")
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
        status: "cancelled",
        canceldate: newdate,
      }));
      setTimeData((prevState) => ({
        ...prevState,
        cancelDate: newdate.toLocaleDateString("en-US"),
        cancelTime: newdate.toLocaleTimeString("en-US"),
      }));
      dispatch(showSnackbar("Invoice Cancelled Successfully", true, "success"));
    }
    setDeleteMode(false);
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
              paymentPayload.refundamount
                ? Math.max(calculateTotal({ ...paymentPayload }), 0).toFixed(2)
                : parseFloat(paymentPayload.subtotal).toFixed(2)
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
                    calculateTotal({ ...paymentPayload }) >
                      calculateFee({ ...paymentPayload }))
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
                    lineitems={[...paymentPayload.lineitems]}
                    subtotal={paymentPayload.subtotal}
                    platformfee={calculateFee({ ...paymentPayload })}
                    platformfeerate={
                      paymentPayload.feerate ? paymentPayload.feerate * 100 : 15
                    }
                    refundamount={
                      paymentPayload.refundamount
                        ? paymentPayload.refundamount * -1
                        : 0
                    }
                    totalpaid={
                      paymentPayload.refundamount
                        ? paymentPayload.subtotal - paymentPayload.refundamount
                        : paymentPayload.subtotal
                    }
                    totalpayout={
                      paymentPayload.refundamount
                        ? paymentPayload.subtotal -
                          calculateFee({ ...paymentPayload }) -
                          paymentPayload.refundamount
                        : paymentPayload.subtotal -
                          calculateFee({ ...paymentPayload })
                    }
                    createdate={
                      timeData.createDate
                        ? `${timeData.createDate} ${timeData.createTime}`
                        : ""
                    }
                    canceldate={
                      timeData.cancelDate
                        ? `${timeData.cancelDate} ${timeData.cancelTime}`
                        : ""
                    }
                    completedate={
                      timeData.completeDate
                        ? `${timeData.completeDate} ${timeData.completeTime}`
                        : ""
                    }
                    refunddate={
                      timeData.refunddate
                        ? `${timeData.refundDate} ${timeData.refundTime}`
                        : ""
                    }
                  />
                </Paper>
              </Box>{" "}
            </SubsectionWrapper>
            {/* <Divider sx={{ borderColor: theme.palette.grey[300], mt: 1, mb: 2 }} /> */}
            <Box
              sx={{
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
                calculateTotal({ ...paymentPayload }) > 0 ? (
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
