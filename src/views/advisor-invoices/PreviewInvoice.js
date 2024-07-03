import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Grid } from "@material-ui/core";
import { IconSend } from "@tabler/icons";

// local imports
import GenericPage from "ui-component/pages/GenericPage";
import { showEditBanner, showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import DynamicButton from "ui-component/buttons/DynamicButton";
import InvoiceTemplate from "ui-component/templates/InvoiceTemplate";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";
import { myClientList, myProfileInfo } from "utils/advisor-dummy-data";

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
  // console.log(location.state);

  // data states
  const { adviceid, lineitems, adviseeName, subtotal, invited, returnitems } =
    location.state;
  const [profileInfo, setProfileInfo] = useState({});
  const [adviseeData, setAdviseeData] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [invoiceFailed, setInvoiceFailed] = useState(false);

  // get client details
  const getAdviseeDetails = (adviceid, clientlist) => {
    clientlist.forEach((client) => {
      if (client.id.toString() === adviceid.toString()) {
        setAdviseeData({ ...client });
        return { ...client };
      }
    });
  };

  useEffect(() => {
    dispatch(showEditBanner(true, "Creating new invoice..."));
    if (adviceid && myClientList && myClientList.length)
      getAdviseeDetails(adviceid, myClientList);
    else dispatch(showSnackbar("Unable to get client details", true, "error"));
    if (myProfileInfo && Object.entries(myProfileInfo).length)
      setProfileInfo({ ...myProfileInfo });
    else dispatch(showSnackbar("Unable to get profile details", true, "error"));
    setIsLoading(false);
  }, []);

  // submit new invoice
  const handleSubmit = async () => {
    navigate(`/adv/invoices/${adviceid}/100`, {
      state: {
        backlink: "/adv/invoices",
        adviceid: adviceid,
        adviseeName: adviseeName,
        subtotal: subtotal,
        lineitems: lineitems,
        invited: invited,
        returnitems: returnitems,
      },
    });
    dispatch(showSnackbar("Invoice created successfully", true, "success"));
  };

  // handle user selecting back button on preview page
  const handleBack = () => {
    navigate(`/adv/invoices/new/?id=${adviceid}`, {
      state: {
        fromPreview: true,
        adviceid: adviceid,
        adviseeName: adviseeName,
        subtotal: subtotal,
        lineitems: lineitems,
        invited: invited,
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
              billto={{ ...adviseeData }}
              billfrom={{ ...profileInfo }}
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
