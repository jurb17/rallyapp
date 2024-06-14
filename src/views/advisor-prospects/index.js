import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

// mui
import { Box } from "@material-ui/core";

// project imports
import DataGridPage from "ui-component/pages/DataGridPage";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";

// data and functions imports
import { myProspectList } from "utils/advisor-dummy-data";

// =====================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageProspects = () => {
  const dispatch = useDispatch();

  // data states
  const [prospects, setProspects] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);

  // prep data for grid
  const prepProspectsData = (prospects) => {
    for (const prospect of prospects) {
      if (prospect.state) prospect.stateString = prospect.state.toUpperCase();
      else prospect.stateString = "--";
      if (prospect.id)
        prospect.selectionroute = `/adv/prospects/${prospect.id}`;
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
        prospect.dateContactedString = formattedDate + " " + formattedTime;
      }
      prospect.invited = false;
    }
    return prospects;
  };

  // get the prospect list from the api.
  const getProspectsData = async (prospectlist) => {
    let prospects = prospectlist;
    const newProspects = prepProspectsData(prospects);
    setProspects([...newProspects]);
    setIsLoading(false);
  };

  useEffect(async () => {
    if (myProspectList) getProspectsData(myProspectList);
    else {
      setIsLoading(false);
      dispatch(showSnackbar("No prospects found.", true, "warning"));
    }
  }, []);

  // define row data. firstname, middlename, lastname, prefix, suffix, nickname, email, phone
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      minWidth: 200,
      width: 200,
      hide: false,
    },
    {
      field: "stateString",
      headerName: "State",
      minWidth: 150,
      width: 150,
      hide: false,
    },
    {
      field: "dateContactedString",
      headerName: "Service Request Date",
      minWidth: 180,
      width: 180,
      hide: false,
    },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
  ];

  return (
    <>
      <GenericPage pageHeader="Prospect List" noHrule={true}>
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Prospect List..." />
          </Box>
        ) : prospects && prospects.length > 0 ? (
          <DataGridPage
            rows={prospects}
            columns={columns}
            rowLink="/adv/prospects"
          />
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText
                text={"You do not have any prospects yet!"}
              />
            </Box>
            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                To get more prospects, try advertising the value you offer by
                creating a service or sharing your thoughts by posting an
                article.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default ManageProspects;
