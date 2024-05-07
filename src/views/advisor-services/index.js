import React, { useEffect, useState } from "react";
import { useNavigate, createSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { IconPackage } from "@tabler/icons";

// project imports
import ServiceList from "./components/ServiceList";
import advisoryService from "services/advisory.service";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ====================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageServices = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // data states
  const [services, setServices] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [emptyList, setEmptyList] = useState(true);

  // get service list data
  const getServicesData = async () => {
    await advisoryService
      .getServiceList({})
      .then((response) => {
        if (!!response.data.payload.success) {
          if (!!response.data.payload.services) {
            // set emptyList state so when user creates a new service, they have the option to add a niche.
            setEmptyList(false);
            let servicelist = response.data.payload.services;
            for (const service of servicelist) {
              if (!!service.id) {
                // add selection route for each service card.
                service.selectionroute = `/adv/services/${service.id}`;
              }
            }
            setServices([...servicelist]);
          } else {
            setEmptyList(true);
            dispatch(showSnackbar("No services found.", true, "warning"));
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
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
      });
  };

  // retrieve service list data from backend
  useEffect(() => {
    getServicesData();
  }, []);

  return (
    <>
      <GenericPage
        pageHeader="Your Services"
        noHrule={true}
        buttonlist={[
          {
            name: "Offer New Service",
            color: "primary",
            variant: "contained",
            startIcon: <IconPackage stroke={1.25} />,
            onClick: () => {
              navigate("/adv/services/new", {
                state: { emptyList: emptyList },
              });
            },
          },
        ]}
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Service List..." />{" "}
          </Box>
        ) : !!services && services.length > 0 ? (
          <Box className="horizontal-center">
            <ServiceList services={services} />
          </Box>
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText text="You have not created any services yet!" />
            </Box>
            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                Services will be publically displayed on your firm's Rally
                webpage. The public can search for your services by category and
                subcategory.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default ManageServices;
