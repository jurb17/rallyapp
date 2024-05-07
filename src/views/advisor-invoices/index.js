import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import advisoryService from "services/advisory.service";
import DataGridPage from "ui-component/pages/DataGridPage";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import CustomLabel from "ui-component/extended/CustomLabel";
import { IconBrandStripe } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =====================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageInvoices = (props) => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);

  // extract query params from url
  const queryParams = new URLSearchParams(location.search);
  const adviceid = queryParams.get("id");

  // define state for invoice list. Then select variables from the user state.
  const [invoices, setInvoices] = useState([]);
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
    if (!!payment.description) {
      clientname = payment.description;
    } else {
      clientname = "Name Not Found";
    }
    if (payment.adviceid && payment.id) {
      selectionroute = `/adv/invoices/${payment.adviceid}/${payment.id}`;
    }
    let temp = {
      ...payment,
      clientname: clientname,
      displaySubtotal: `$${parseFloat(payment.subtotal).toFixed(2)}`,
      displaydate: `${formattedDate} ${formattedTime}`,
      selectionroute: selectionroute,
    };
    return temp;
  };

  // get client profile data
  const getClientData = async (clientid) => {
    await advisoryService
      .getClient({ clientid: clientid })
      .then(async (response) => {
        if (!!response.data.payload.success) {
          if (Object.entries(response.data.payload.client).length > 0) {
            setClientName(response.data.payload.client.name);
            return response.data.payload.client;
          } else {
            await advisoryService
              .getProspect({ clientid: clientid })
              .then((response) => {
                if (!!response.data.payload.success) {
                  setClientName(response.data.payload.client.name);
                  return response.data.payload.client;
                }
              })
              .catch((error) => {
                console.log("uncaught error", error);
                return error;
              });
          }
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

  // get invoice list data
  const getInvoiceListData = async (adviceid) => {
    await advisoryService
      .getPaymentList({})
      .then(async (response) => {
        if (!!response.data.payload.success) {
          if (!!response.data.payload.payments) {
            // alter the data within the request response to a more useful format.
            let payments = [];
            response.data.payload.payments.forEach((payment) => {
              // if we have a clientid, then we need to filter the list by clientid
              if (!!adviceid) {
                if (adviceid === payment.adviceid) {
                  const newPayment = calculateData(payment);
                  payments.push(newPayment);
                }
              } else {
                const newPayment = calculateData(payment);
                payments.push(newPayment);
              }
            });
            setInvoices([...payments]);
            setIsLoading(false);
          } else {
            dispatch(showSnackbar("No invoices found.", true, "warning"));
            setIsLoading(false);
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(
            "error with getting payments data",
            response.data.details.text
          );
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

  useEffect(async () => {
    if (attributes.ADVISOR > 1 || attributes.RIA > 1) {
      setPlaceholder(
        "Your account has not been approved yet. Please wait for the Rally team to review and approve your account. \nThank you."
      );
      setIsLoading(false);
    } else if (attributes.MERCHANT < 0) {
      setPlaceholder(
        "You do not have a merchant account. Please go to the Settings page and create a merchant account with Stripe."
      );
      setIsLoading(false);
    } else if (!!adviceid) {
      setPlaceholder("");
      await getInvoiceListData(adviceid);
      await getClientData(adviceid);
    } else {
      setPlaceholder("");
      await getInvoiceListData("");
      setClientName("");
    }
  }, [attributes]);

  // function to handle navigation to the Stripe dashboard.
  const getDashboardLink = async () => {
    await advisoryService
      .getDashboard({})
      .then((response) => {
        if (response.data.payload.success) {
          window.open(response.data.payload.url, "_blank");
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
  // handle new invoice without clientid
  const handleDashboardClick = () => {
    if (attributes.MERCHANT !== 1) {
      alert(
        "You do not have access to the Stripe Dashboard without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    } else {
      getDashboardLink();
    }
  };
  // handle new invoice without clientid
  const handleNewClick = () => {
    if (attributes.MERCHANT !== 1) {
      alert(
        "You are not authorized to create invoices without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    } else {
      navigate("/adv/invoices/new");
    }
  };
  // handle new invoice with clientid
  const handleNewWithClientClick = (clientid) => {
    if (attributes.MERCHANT !== 1) {
      alert(
        "You are not authorized to create invoices without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    } else {
      navigate(`/adv/invoices/new/?id=${clientid}`);
    }
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
    { field: "adviceid", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "subtotal", headerName: "", minWidth: 10, width: 10, hide: true },
  ];

  return (
    <>
      <GenericPage
        pageHeader={
          !!clientName ? `Invoices for ${clientName}` : "Invoice List"
        }
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
                    getInvoiceListData("");
                    setClientName("");
                  },
                },
                {
                  name: "Send New Invoice",
                  color: "primary",
                  variant: "contained",
                  onClick: () => handleNewWithClientClick(adviceid),
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
        ) : !!clientName && !!invoices && invoices.length > 0 ? (
          <SubsectionWrapper
            title="Client Invoice History"
            tipBody="The following list of invoices is filtered specifically to display the invoices for a specific client. To review all invoices, select the Show All button."
            mb={0.5}
          >
            <DataGridPage rows={invoices} columns={columns} />
          </SubsectionWrapper>
        ) : !!clientName && !!invoices && invoices.length === 0 ? (
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
