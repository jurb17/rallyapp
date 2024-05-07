import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Grid } from "@material-ui/core";
import { IconSend } from "@tabler/icons";

// local imports
import advisoryService from "services/advisory.service";
import GenericPage from "ui-component/pages/GenericPage";
import { showEditBanner, showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import DynamicButton from "ui-component/buttons/DynamicButton";
import accountService from "services/account.service";
import InvoiceTemplate from "ui-component/templates/InvoiceTemplate";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ==============================================================
// NO PROPS, ONLY LOCATION.STATE
// this page can be accessed from the invoice list page or the client invoice list page

const PreviewInvoice = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // extract query params from url
  // const queryParams = new URLSearchParams(location.search);
  // const id = queryParams.get("id");
  console.log(location.state);

  // data states
  const {
    clientid,
    lineitems,
    clientName,
    subtotal,
    invitedClient,
    returnitems,
  } = location.state;
  const [account, setAccount] = useState({});
  const [client, setClient] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(false);
  const [invoiceFailed, setInvoiceFailed] = useState(false);

  // get account details
  const getAccountDetails = async () => {
    setIsLoading(true);
    await accountService
      .getAccount({})
      .then((response) => {
        if (!!response.data.payload.success) {
          setAccount(response.data.payload.user);
        }
      })
      .catch((error) => {
        console.log("uncaught error", error);
        dispatch(showSnackbar("Unable to get account details", true, "error"));
      });
    setIsLoading(false);
  };

  // get client details
  const getClientDetails = async () => {
    setIsLoading(true);
    await advisoryService
      .getClient({ clientid: clientid })
      .then(async (response) => {
        if (
          !!response.data.payload.success &&
          Object.entries(response.data.payload.client).length > 0
        ) {
          setClient(response.data.payload.client);
        } else {
          await advisoryService
            .getProspect({ clientid: clientid })
            .then((response) => {
              if (
                !!response.data.payload.success &&
                Object.entries(response.data.payload.client).length > 0
              ) {
                const prospect = response.data.payload.client;
                const names = prospect.name.split(" ");
                prospect.lastname = names[names.length - 1];
                prospect.firstname = names.slice(0, names.length - 1).join(" ");
                setClient(prospect);
              } else {
                setClient({});
              }
            })
            .catch((error) => {
              console.log("uncaught error", error);
              dispatch(
                showSnackbar("Unable to get prospect details", true, "error")
              );
            });
        }
      })
      .catch((error) => {
        console.log("uncaught error", error);
        dispatch(showSnackbar("Unable to get client details", true, "error"));
      });
    setIsLoading(false);
  };

  useEffect(() => {
    dispatch(showEditBanner(true, "Creating new invoice..."));
    getAccountDetails();
    getClientDetails();
  }, []);

  // submit new invoice
  const handleSubmit = async () => {
    await advisoryService
      .postPayment({
        clientid: clientid,
        lineitems: lineitems,
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          navigate(
            `/adv/invoices/${clientid}/${response.data.payload.payment.id}`,
            { state: { backlink: "/adv/invoices" } }
          );
          dispatch(
            showSnackbar("Invoice created successfully", true, "success")
          );
        } else {
          if (!!invitedClient) {
            setInvoiceFailed(true);
            dispatch(
              showSnackbar(
                "Invoice failed to send. The client may not have completed account setup.",
                true,
                "error"
              )
            );
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
          }
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

  // handle user selecting back button on preview page
  const handleBack = () => {
    navigate(`/adv/invoices/new/?id=${clientid}`, {
      state: {
        fromPreview: true,
        clientid: clientid,
        clientName: clientName,
        subtotal: subtotal,
        lineitems: lineitems,
        invitedClient: invitedClient,
        returnitems: returnitems,
      },
    });
  };

  return (
    <>
      <GenericPage
        pageHeader="Invoice Preview"
        handleBack={handleBack}
        buttonlist={[
          {
            name: "Send Invoice",
            color: "secondary",
            variant: "contained",
            startIcon: <IconSend stroke={1.25} />,
            onClick: handleSubmit,
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
              handleConfirm={() => {
                setInvoiceFailed(false);
              }}
              open={invoiceFailed}
              heading="We Could Not Send Your Invoice"
              body="It is likely that the client has not completed the account setup. Please confirm with the client before opening a support request. Thank you."
              action="OK"
            />
            <InvoiceTemplate
              billto={{ ...client }}
              billfrom={{ ...account }}
              lineitems={lineitems}
              subtotal={subtotal}
              invoiceid=""
            />
            <Grid
              container
              mt={2}
              direction="row"
              display="flex"
              justifyContent={"right"}
            >
              <DynamicButton
                name="Send Invoice"
                color="secondary"
                variant="contained"
                startIcon={<IconSend stroke={1.25} />}
                onClick={handleSubmit}
              />
            </Grid>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default PreviewInvoice;
