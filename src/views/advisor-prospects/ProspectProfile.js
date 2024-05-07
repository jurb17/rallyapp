import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import ProspectForm from "./forms/ProspectForm";
import advisoryService from "services/advisory.service";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import GenericPage from "ui-component/pages/GenericPage";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import { showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import {
  IconMailForward,
  IconUserOff,
  IconMessage,
  IconReceipt2,
} from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================
// NO PROPS, ONLY LOCATION.STATE
// this page can be accessed from the prospect list page, the messages page, and the invoice page.

const ProspectProfile = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const prospectFormRef = useRef({});

  // bring in params from url
  const { id } = useParams();

  // request states
  const [adviceid, setProspectid] = useState(id);

  // data states
  const [prospectPayload, setProspectPayload] = useState({});
  const [calcData, setCalcData] = useState({});

  // mode states
  const [pendingInvoice, setPendingInvoice] = useState(false);
  const [deletingProspect, setDeletingProspect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // function to set the calcData states (calcData states only)
  const getCalcData = (prospectLoad) => {
    console.log("nothing to calculate");
  };

  // get prospect profile data from server (payload states and mode states)
  const getProspectData = async () => {
    await advisoryService
      .getProspect({
        clientid: adviceid,
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          setProspectPayload(response.data.payload);
          // if there is a payments list, set the pendingInvoice mode to true
          if (!!response.data.payload.payments) {
            response.data.payload.payments.forEach((payment) => {
              if (payment.status === "open") {
                setPendingInvoice(true);
              }
            });
          } else {
            setPendingInvoice(false);
          }
          // get the calcData states
          getCalcData(response.data.payload);
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(response.data.details.text);
          navigate(-1);
          // $$$ or show error-related page instead of navigating away
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
        navigate(-1);
        // $$$ or show error-related page
      });
  };
  // get current data from the server
  useEffect(() => {
    if (!!adviceid) {
      getProspectData();
    }
    // if there is no paymentid, then redirect to the prospect list
    else {
      dispatch(
        showSnackbar("No advice ID or payment ID found", true, "warning")
      );
      setIsLoading(false);
      if (!!location.state && !!location.state.backlink) {
        navigate(location.state.backlink);
      } else {
        navigate(-1);
      }
    }
  }, []);

  // DATA FUNCTIONS ======================================

  // handle confirm delete profile
  const handleDeclineProspectConfirm = async () => {
    // API request to delete the profile.
    await advisoryService
      .deleteProspect({ clientid: adviceid })
      .then((response) => {
        if (!!response.data.payload.success) {
          dispatch(
            showSnackbar("Prospect successfully declined", true, "success")
          );
          navigate("/adv/prospects");
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(response.data.details.text);
          setDeletingProspect(false);
        }
      })
      .catch((error) => {
        dispatch(
          showSnackbar("Decline failed. Please try again later.", true, "error")
        );
        console.log("something went wrong with declining the prospect.", error);
      });
  };

  return (
    <>
      {isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <>
          <ConfirmDeleteModal
            open={deletingProspect}
            handleConfirm={handleDeclineProspectConfirm}
            handleCancel={() => setDeletingProspect(false)}
            heading={`Are you sure you want to turn away ${prospectPayload.client.name} as a prospect?`}
            body="This action cannot be undone."
            action={"Decline"}
            nonaction={"Cancel"}
          />
          <GenericPage
            pageHeader="Prospect Profile"
            backlink={
              !!location.state && !!location.state.backlink
                ? location.state.backlink
                : ""
            }
            buttonlist={
              !pendingInvoice
                ? [
                    {
                      name: "Decline Prospect",
                      color: "error",
                      variant: "outlined",
                      startIcon: <IconUserOff stroke={1.25} />,
                      onClick: () => setDeletingProspect(true),
                    },
                    {
                      name: "Send Quote",
                      color: "primary",
                      variant: "contained",
                      onClick: () =>
                        navigate(`/adv/invoices/new/?id=${adviceid}`),
                    },
                  ]
                : [
                    {
                      name: "Decline Prospect",
                      color: "error",
                      variant: "outlined",
                      startIcon: <IconUserOff stroke={1.25} />,
                      onClick: () => setDeletingProspect(true),
                    },
                    {
                      name: "Review Quote",
                      color: "primary",
                      variant: "contained",
                      onClick: () =>
                        !!prospectPayload.payments
                          ? navigate(
                              `/adv/invoices/${adviceid}/${prospectPayload.payments[0].id}`
                            )
                          : null,
                    },
                  ]
            }
          >
            <SubsectionWrapper
              title="Prospect Information"
              tipBody="Basic information about the prospect who has reached you through the platform. Send a service quote to this prospect to onboard them as a client."
              mb={2}
              buttonlist={[
                {
                  name: "View Chat",
                  color: "primary",
                  variant: "text",
                  startIcon: <IconMessage stroke={1.25} />,
                  onClick: () => navigate(`/adv/messages/?id=${adviceid}`),
                },
              ]}
            >
              <ProspectForm
                editMode={false}
                prospectInput={{
                  name: prospectPayload.client.name
                    ? prospectPayload.client.name
                    : "No Name Found",
                  state: prospectPayload.client.state,
                }}
                forwardedProspectFormRef={prospectFormRef}
              />
            </SubsectionWrapper>
          </GenericPage>
        </>
      )}
    </>
  );
};

export default ProspectProfile;
