import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// project imports
import ProspectForm from "./forms/ProspectForm";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import GenericPage from "ui-component/pages/GenericPage";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import { showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import { IconUserOff, IconMessage } from "@tabler/icons";
import { myProspectList } from "utils/advisor-dummy-data";

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
  const idParam = id;

  // data states
  const [prospectPayload, setProspectPayload] = useState({});

  // mode states
  const [pendingInvoice, setPendingInvoice] = useState(false);
  const [deletingProspect, setDeletingProspect] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // get prospect profile data from server (payload states and mode states)
  const getProspectData = async (prospectlist) => {
    // get the data for the client that matches the idParam
    for (const prospect of prospectlist) {
      if (prospect.id.toString() === idParam) {
        // if there is a payments list, set the pendingInvoice mode to true
        if (prospect.payments) {
          setPendingInvoice(false);
          prospect.payments.forEach((payment) => {
            if (payment.status === "open") setPendingInvoice(true);
          });
        } else setPendingInvoice(false);
        if (prospect.dateContacted) {
          // get formatted date string
          let formattedDate = new Date(
            parseInt(prospect.dateContacted)
          ).toLocaleDateString("en-US");
          // get formatted time string
          let formattedTime = new Date(
            parseInt(prospect.dateContacted)
          ).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          // combine date and time for table
          prospect.serviceRequestDate = formattedDate + " " + formattedTime;
        }
        setProspectPayload({ ...prospect });
      }
    }
    setIsLoading(false);
  };

  // run on mount
  useEffect(() => {
    // if idParam and prospectList exist, get current prospect data
    if (idParam)
      if (myProspectList && myProspectList.length)
        getProspectData(myProspectList);
      // otherwise, go back.
      else {
        console.log("No prospect list found.");
        navigate(-1);
      }
    else navigate(-1);
  }, []);

  // DATA FUNCTIONS ======================================
  // handle confirm delete profile
  const handleDeclineProspectConfirm = async () => {
    console.log("handle delete prospect profile");
    dispatch(showSnackbar("Prospect successfully declined", true, "success"));
    navigate("/adv/prospects");
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
            heading={`Are you sure you want to turn away ${prospectPayload.name} as a prospect?`}
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
                        navigate(`/adv/invoices/new/?id=${idParam}`),
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
                              `/adv/invoices/${idParam}/${prospectPayload.payments[0].id}`
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
                  onClick: () => navigate(`/adv/messages/?id=${idParam}`),
                },
              ]}
            >
              <ProspectForm
                editMode={false}
                prospectInput={{
                  name: prospectPayload.name
                    ? prospectPayload.name
                    : "No Name Found",
                  state: prospectPayload.state,
                  serviceRequestDate: prospectPayload.serviceRequestDate,
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
