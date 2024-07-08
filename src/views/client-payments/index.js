import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import DataGridPage from "ui-component/pages/DataGridPage";
import GenericPage from "ui-component/pages/GenericPage";

import { showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import CustomLabel from "ui-component/extended/CustomLabel";

// data and functions
import { myAdvisorList, clientInvoiceList } from "utils/client-dummy-data";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================

const PaymentManagement = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);

  // extract query params from url
  const queryParams = new URLSearchParams(location.search);
  const idParam = queryParams.get("id");

  // data states
  const [payments, setPayments] = useState([]);
  const [advisorName, setAdvisorName] = useState("");

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("");

  // calculate extra data for each invoice
  const calculateData = (payment) => {
    let formattedDate;
    let formattedTime;
    let selectionroute;
    if (payment.createdate) {
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
    if (payment.adviceid && payment.id)
      selectionroute = `/client/payments/${payment.adviceid}/${payment.id}`;
    let temp = {
      ...payment,
      displaySubtotal: `$${parseFloat(payment.subtotal).toFixed(2)}`,
      displaydate: `${formattedDate} ${formattedTime}`,
      selectionroute: selectionroute,
    };
    return temp;
  };

  // handle retrieving chat/advisor data
  const getInvoiceListData = async (adviceid, invoicelist) => {
    let payments = [];
    invoicelist.forEach((invoice) => {
      if (adviceid) {
        if (adviceid.toString() === invoice.adviceid.toString())
          payments.push(calculateData(invoice));
      } else payments.push(calculateData(invoice));
    });
    setPayments([...payments]);
    setIsLoading(false);
  };

  // get advisor info for client-specific invoice list.
  const getAdvisorData = (adviceid, advisorlist) => {
    advisorlist.forEach((item) => {
      if (adviceid.toString() === item.id.toString()) {
        setAdvisorName(item.name);
        return item;
      }
    });
  };

  // fetch payments data
  useEffect(() => {
    if (attributes.CUSTOMER !== 1) {
      setPlaceholder(
        "You're account setup is incomplete. Please create a customer account with Stripe from the settings page."
      );
      setIsLoading(false);
    }
    // if there is an invoice list, then get invoice data
    else if (clientInvoiceList && clientInvoiceList.length) {
      // if there's an idParam, then get client info and invoice data only for that client.
      if (idParam) {
        getAdvisorData(idParam, myAdvisorList);
        getInvoiceListData(idParam, clientInvoiceList);
      } else getInvoiceListData("", clientInvoiceList);
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
        pageHeader={advisorName ? `Payments to ${advisorName}` : "My Payments"}
        noHrule={advisorName ? false : true}
        backlink={
          location.state && location.state.backlink
            ? location.state.backlink
            : ""
        }
        buttonlist={
          advisorName
            ? [
                {
                  name: "Show All",
                  color: "primary",
                  variant: "outlined",
                  onClick: () => {
                    getInvoiceListData("", clientInvoiceList);
                    setAdvisorName("");
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
        ) : !advisorName && !!payments && payments.length > 0 ? (
          <DataGridPage rows={payments} columns={columns} />
        ) : advisorName && !!payments && payments.length > 0 ? (
          <SubsectionWrapper
            title="Advisor Payment History"
            tipBody="The following list of payments is filtered by a specific advisor. To review all payments, select the Show All button."
            mb={0.5}
          >
            <DataGridPage rows={payments} columns={columns} />
          </SubsectionWrapper>
        ) : advisorName && !!payments && payments.length === 0 ? (
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
