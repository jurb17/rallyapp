import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import DataGridPage from "ui-component/pages/DataGridPage";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import CustomLabel from "ui-component/extended/CustomLabel";
import { IconBrandStripe } from "@tabler/icons";

// data and functions
import {
  myInvoiceList,
  myClientList,
  myProspectList,
} from "utils/advisor-dummy-data";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =====================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageInvoices = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const { attributes } = useSelector((state) => state.auth);

  // extract query params from url
  const queryParams = new URLSearchParams(location.search);
  const idParam = queryParams.get("id");

  // define state for invoice list. Then select variables from the user state.
  const [invoices, setInvoices] = useState([]);
  const [clientName, setClientName] = useState("");
  const [placeholder, setPlaceholder] = useState("");

  // mode states
  const [isLoading, setIsLoading] = useState(true);

  // calculate extra data for each payment
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
    } else if (payment.refunddate) {
      formattedDate = new Date(parseInt(payment.refunddate)).toLocaleDateString(
        "en-US"
      );
      formattedTime = new Date(parseInt(payment.refunddate)).toLocaleTimeString(
        "en-US"
      );
    }
    if (payment.adviceid && payment.id)
      selectionroute = `/adv/invoices/${payment.adviceid}/${payment.id}`;
    let temp = {
      ...payment,
      displaySubtotal: `$${parseFloat(payment.subtotal).toFixed(2)}`,
      displayDate: `${formattedDate} ${formattedTime}`,
      selectionroute: selectionroute,
    };
    return temp;
  };

  // get invoice list data into state variable
  const getInvoiceListData = async (adviceid, invoicelist) => {
    let payments = [];
    invoicelist.forEach((invoice) => {
      if (adviceid) {
        if (adviceid.toString() === invoice.adviceid.toString())
          payments.push(calculateData(invoice));
      } else payments.push(calculateData(invoice));
    });
    setInvoices([...payments]);
    setIsLoading(false);
  };

  // get client info for client-specific invoice list.
  const getClientData = (adviceid, clientlist, prospectlist) => {
    const combinedList = [...clientlist, ...prospectlist];
    combinedList.forEach((item) => {
      if (adviceid.toString() === item.id.toString()) {
        setClientName(item.name);
        return item;
      }
    });
  };

  useEffect(() => {
    // if the advisor doesn't have a merchant account, then they can't process payments
    if (attributes.MERCHANT < 0) {
      setPlaceholder(
        "You do not have a merchant account. Please go to the Settings page and create a merchant account with Stripe."
      );
      setIsLoading(false);
    }
    // if there is an invoice list, then get invoice data
    else if (myInvoiceList && myInvoiceList.length) {
      // if there's an idParam, then get client info and invoice data only for that client.
      if (idParam) {
        getClientData(idParam, myClientList, myProspectList);
        getInvoiceListData(idParam, myInvoiceList);
      } else getInvoiceListData("", myInvoiceList);
    }
    // Otherwise, retrieve payments data
    else
      setPlaceholder(
        "No invoice data found. Send a new invoice to a prospect to start earning revenue on the Rally platform."
      );
  }, [attributes]);

  // handle new invoice without clientid
  const handleDashboardClick = () => {
    if (attributes.MERCHANT !== 1)
      alert(
        "You do not have access to the Stripe Dashboard without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    // getDashboardLink();
    else
      alert(
        "The Stripe Dashboard feature is not available for the demo version."
      );
  };
  // handle new invoice without clientid
  const handleNewClick = () => {
    if (attributes.MERCHANT !== 1)
      alert(
        "You are not authorized to create invoices without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    else navigate("/adv/invoices/new");
  };
  // handle new invoice with clientid
  const handleNewWithClientClick = (adviceid) => {
    if (attributes.MERCHANT !== 1)
      alert(
        "You are not authorized to create invoices without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    else navigate(`/adv/invoices/new/?id=${adviceid}`);
  };

  // define row data. firstname, middlename, lastname, prefix, suffix, nickname, email, phone
  const columns: GridColDef[] = [
    {
      field: "clientname",
      headerName: "Client Name",
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
      field: "displayDate",
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
    { field: "adviceid", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "subtotal", headerName: "", minWidth: 10, width: 10, hide: true },
  ];

  return (
    <>
      <GenericPage
        pageHeader={clientName ? `Invoices for ${clientName}` : "Invoice List"}
        noHrule={clientName ? false : true}
        backlink={
          location.state && location.state.backlink
            ? location.state.backlink
            : ""
        }
        buttonlist={
          clientName
            ? [
                {
                  name: "Show All",
                  color: "primary",
                  variant: "outlined",
                  onClick: () => {
                    getInvoiceListData("", myInvoiceList);
                    setClientName("");
                  },
                },
                {
                  name: "Send New Invoice",
                  color: "primary",
                  variant: "contained",
                  onClick: () => handleNewWithClientClick(idParam),
                },
              ]
            : [
                {
                  name: "Stripe Dashboard",
                  color: "primary",
                  variant: "contained",
                  startIcon: <IconBrandStripe stroke={1.25} />,
                  onClick: handleDashboardClick,
                },
                {
                  name: "Send New Invoice",
                  color: "primary",
                  variant: "contained",
                  onClick: handleNewClick,
                },
              ]
        }
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Invoice List..." />
          </Box>
        ) : !clientName && !!invoices && invoices.length > 0 ? (
          <DataGridPage rows={invoices} columns={columns} />
        ) : clientName && !!invoices && invoices.length > 0 ? (
          <SubsectionWrapper
            title="Client Invoice History"
            tipBody="The following list of invoices is filtered specifically to display the invoices for a specific client. To review all invoices, select the Show All button."
            mb={0.5}
          >
            <DataGridPage rows={invoices} columns={columns} />
          </SubsectionWrapper>
        ) : clientName && !!invoices && invoices.length === 0 ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="This client does not have an invoice history. Add a new invoice for this client or remove the filter to review all invoices." />
          </Box>
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText
                text={
                  placeholder
                    ? placeholder
                    : "You do not have an invoice history yet!"
                }
              />
            </Box>
            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                A list of your invoices will be displayed here once there is a
                history. New invoices can be sent to clients from this page. To
                send an invoice to a prospect, go to your Prospect List.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default ManageInvoices;
