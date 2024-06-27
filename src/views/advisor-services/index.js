import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { IconPackage } from "@tabler/icons";

// project imports
import ServiceList from "./components/ServiceList";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";

// data and fucntions
import { myServiceList } from "utils/advisor-dummy-data";

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
  const getServicesData = async (services) => {
    // set emptyList state so when user creates a new service, they have the option to add a niche.
    setEmptyList(false);
    let servicelist = services;
    for (const service of servicelist) {
      // add selection route for each service card.
      if (service.id) service.selectionroute = `/adv/services/${service.id}`;
    }
    setServices([...servicelist]);
    setIsLoading(false);
  };

  // retrieve service list data from backend
  useEffect(() => {
    if (myServiceList.length) getServicesData(myServiceList);
    else {
      setIsLoading(false);
      dispatch(showSnackbar("No services found.", true, "warning"));
    }
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
