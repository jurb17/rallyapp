import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// mui
import { Box } from "@material-ui/core";

// project imports
import advisoryService from "services/advisory.service";
import DataGridPage from "ui-component/pages/DataGridPage";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";

// =====================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageProspects = () => {
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);

  // data states
  const [prospects, setProspects] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("");

  // prep data for grid
  const prepProspectsData = (prospects) => {
    for (const prospect of prospects) {
      if (!!prospect.state) {
        prospect.stateString = prospect.state.toUpperCase();
      } else {
        prospect.stateString = "--";
      }
      if (!!prospect.id) {
        prospect.selectionroute = `/adv/prospects/${prospect.id}`;
      }
      prospect.invited = false;
    }
    return prospects;
  };

  // get the prospect list from the api.
  const getProspectsData = async () => {
    await advisoryService
      .getProspectList({})
      .then((response) => {
        if (!!response.data.payload.success) {
          if (!!response.data.payload.clients) {
            let prospects = response.data.payload.clients;
            const newProspects = prepProspectsData(prospects);
            setProspects([...newProspects]);
          } else {
            dispatch(showSnackbar("No prospects found.", true, "warning"));
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log("caught error", response.data.details.text);
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
    } else {
      setPlaceholder("");
      await getProspectsData();
    }
  }, [attributes]);

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
                text={
                  placeholder
                    ? placeholder
                    : "You do not have any prospects yet!"
                }
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
