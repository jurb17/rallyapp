import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import adviceService from "services/advice.service";
import DataGridPage from "ui-component/pages/DataGridPage";
import GenericPage from "ui-component/pages/GenericPage";

import { showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import CustomLabel from "ui-component/extended/CustomLabel";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================

const PaymentManagement = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);

  // extract query params from url
  const queryParams = new URLSearchParams(location.search);
  const adviceid = queryParams.get("id");

  // data states
  const [payments, setPayments] = useState([]);
  const [clientName, setClientName] = useState("");

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("");

  // calculate extra data for each invoice
  const calculateData = (payment) => {
    let formattedDate;
    let formattedTime;
    let clientname;
    let selectionroute;
    if (!!payment.createdate) {
      formattedDate = new Date(parseInt(payment.createdate)).toLocaleDateString(
        "en-US"
      );
      formattedTime = new Date(parseInt(payment.createdate)).toLocaleTimeString(
        "en-US"
      );
    } else if (!!payment.refunddate) {
      formattedDate = new Date(parseInt(payment.refunddate)).toLocaleDateString(
        "en-US"
      );
      formattedTime = new Date(parseInt(payment.refunddate)).toLocaleTimeString(
        "en-US"
      );
    }
    if (payment.adviceid && payment.id) {
      selectionroute = `/client/payments/${payment.adviceid}/${payment.id}`;
    }
    let temp = {
      ...payment,
      displaySubtotal: `$${parseFloat(payment.subtotal).toFixed(2)}`,
      displaydate: `${formattedDate} ${formattedTime}`,
      selectionroute: selectionroute,
    };
    return temp;
  };

  // handle retrieving chat/advisor data
  const getAdvisorData = async (firmslug, advisorslug) => {
    return new Promise(async (resolve, reject) => {
      await adviceService
        .getAdvisor({ firmslug: firmslug }, { advisor: advisorslug })
        .then((response) => {
          if (!!response.data.payload.success) {
            const advisor = response.data.payload.advisor;
            advisor.advisorname = advisor.name;
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

  // get Advisor profile data
  const getAdvisorListData = async (advid) => {
    return new Promise(async (resolve, reject) => {
      await adviceService
        .getChatList({})
        .then(async (response) => {
          if (response.data.payload.success) {
            // if there are messages in the response
            if (
              !!response.data.payload.messages &&
              response.data.payload.messages.length > 0
            ) {
              // get the name of the advisor when the advisor id matches the id in the url
              const advisors = response.data.payload.messages;
              let advisormap = {};
              // if there is an advisor id in the url
              if (!!advid) {
                const advisor = advisors.find(
                  (advisor) => advisor.adviceid === advid
                );
                if (!!advisor) {
                  // name is split by a forward slash
                  const firmslug = advisor.name.split("/")[0];
                  const advisorslug = advisor.name.split("/")[1];
                  // get more advisor data to reach the name of the advisor
                  const advisordata = await getAdvisorData(
                    firmslug,
                    advisorslug
                  );
                  advisormap[advisor.adviceid] = { ...advisor, ...advisordata };
                  setClientName(advisordata.advisorname);
                }
              }
              // if there is no advisor id in the url
              else {
                for (const advisor of advisors) {
                  // name is split by a forward slash
                  const firmslug = advisor.name.split("/")[0];
                  const advisorslug = advisor.name.split("/")[1];
                  // get more advisor data to reach the name of the advisor
                  const advisordata = await getAdvisorData(
                    firmslug,
                    advisorslug
                  );
                  advisormap[advisor.adviceid] = { ...advisor, ...advisordata };
                }
              }
              resolve(advisormap);
            } else {
              setClientName("");
              resolve({});
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

  // get payment list data
  const getPaymentListData = async (advid, advisormap) => {
    await adviceService
      .getPaymentList({})
      .then(async (response) => {
        if (!!response.data.payload.success) {
          // alter the data within the request response to a more useful format.
          let payments = [];
          if (
            !!response.data.payload.payments &&
            response.data.payload.payments.length > 0
          ) {
            for (const payment of response.data.payload.payments) {
              // if there is an advice id in the url, filter the list to only include payments for that advice id
              if (!!advid) {
                if (payment.adviceid === advid) {
                  const newPayment = calculateData(payment);
                  newPayment.clientname =
                    advisormap[payment.adviceid].advisorname;
                  payments.push(newPayment);
                }
              } else {
                const newPayment = calculateData(payment);
                newPayment.clientname =
                  advisormap[payment.adviceid].advisorname;
                payments.push(newPayment);
              }
              setPayments([...payments]);
            }
            setIsLoading(false);
          } else {
            dispatch(showSnackbar("No payments found.", true, "warning"));
            setIsLoading(false);
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log("caught error", response.data.details.text);
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
        setIsLoading(false);
      });
  };

  // fetch payments
  useEffect(() => {
    if (attributes.CUSTOMER !== 1) {
      setPlaceholder(
        "You're account setup is incomplete. Please create a customer account with Stripe from the settings page."
      );
      setClientName("");
      setIsLoading(false);
    } else if (!!adviceid) {
      getAdvisorListData(adviceid).then((advisormap) => {
        getPaymentListData(adviceid, advisormap);
      });
    } else {
      getAdvisorListData("").then((advisormap) => {
        getPaymentListData("", advisormap);
      });
      setClientName("");
    }
  }, []);

  // define row data. firstname, middlename, lastname, prefix, suffix, nickname, email, phone
  const columns: GridColDef[] = [
    {
      field: "clientname",
      headerName: "Requested By",
      minWidth: 200,
      width: 200,
      hide: false,
    },
    {
      field: "displaySubtotal",
      headerName: "Subtotal",
      minWidth: 150,
      width: 150,
      hide: false,
    },
    {
      field: "displaydate",
      headerName: "Date Created",
      minWidth: 200,
      width: 200,
      hide: false,
    },
    {
      field: "status",
      headerName: "Status",
      sortable: false,
      width: 120,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.status ? (
              <Box className="horizontal-center" style={{ width: "100%" }}>
                <CustomLabel
                  textStyle={{ fontSize: "1rem", fontWeight: "normal" }}
                  text={params.row.status}
                />
              </Box>
            ) : null}
          </>
        );
      },
    },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
    {
      field: "selectionroute",
      headerName: "",
      minWidth: 10,
      width: 10,
      hide: true,
    },
  ];

  return (
    <>
      <GenericPage
        pageHeader={!!clientName ? `Payments to ${clientName}` : "My Payments"}
        noHrule={!!clientName ? false : true}
        backlink={
          location.state && location.state.backlink
            ? location.state.backlink
            : ""
        }
        buttonlist={
          !!clientName
            ? [
                {
                  name: "Show All",
                  color: "primary",
                  variant: "outlined",
                  onClick: () => {
                    getAdvisorListData("").then((advisormap) => {
                      getPaymentListData("", advisormap);
                    });
                    setClientName("");
                  },
                },
              ]
            : []
        }
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Payments List..." />
          </Box>
        ) : !clientName && !!payments && payments.length > 0 ? (
          <DataGridPage rows={payments} columns={columns} />
        ) : !!clientName && !!payments && payments.length > 0 ? (
          <SubsectionWrapper
            title="Advisor Payment History"
            tipBody="The following list of payments is filtered by a specific advisor. To review all payments, select the Show All button."
            mb={0.5}
          >
            <DataGridPage rows={payments} columns={columns} />
          </SubsectionWrapper>
        ) : !!clientName && !!payments && payments.length === 0 ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="You do not have a payment history with this advisor. To review all payments, select the Show All button." />
          </Box>
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText
                text={
                  placeholder
                    ? placeholder
                    : "You have no advisor connections yet!"
                }
              />
            </Box>
            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                When you receive an invoice from an advisor, it will be listed
                here. After making a payment, the list will be updated to
                reflect historical payments as well.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default PaymentManagement;
