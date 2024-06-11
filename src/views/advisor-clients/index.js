import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// mui
import { Box } from "@material-ui/core";

// project imports
import DataGridPage from "ui-component/pages/DataGridPage";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";
import { IconMailForward } from "@tabler/icons";

// data and functions
import { myClientList } from "utils/advisor-dummy-data";

// ======================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageClients = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { attributes } = useSelector((state) => state.auth);

  // data states
  const [clients, setClients] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("");

  // handle preparing client data for the grid
  const prepClientsData = (clients) => {
    for (const client of clients) {
      // set displayed table data
      client.stateString = client.state ? client.state.toUpperCase() : "--";
      client.emailString = client.email ? client.email : "not available";
      client.invitedString = client.invited ? "Yes" : "No";
      client.selectionroute = client.id ? `/adv/clients/${client.id}` : "";
    }
    return clients;
  };

  // function with get request to get list of clients
  const getClientsData = async (clientlist) => {
    if (clientlist.length) {
      const tempClientsList = prepClientsData(clientlist);
      setClients([...tempClientsList]);
    } else dispatch(showSnackbar("No clients found", true, "warning"));
    setIsLoading(false);
  };

  useEffect(async () => {
    if (attributes.MERCHANT < 0) {
      setPlaceholder(
        "You do not have a merchant account. Please go to the Settings page and create a merchant account with Stripe."
      );
      setIsLoading(false);
    } else {
      setPlaceholder("");
      getClientsData(myClientList);
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
      field: "invitedString",
      headerName: "Invited",
      minWidth: 80,
      width: 80,
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
      field: "emailString",
      headerName: "Email",
      minWidth: 200,
      width: 200,
      hide: false,
    },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "invited", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "email", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "state", headerName: "", minWidth: 10, width: 10, hide: true },
    {
      field: "selectionroute",
      headerName: "",
      minWidth: 10,
      width: 10,
      hide: true,
    },
  ];

  const handleNewClick = () => {
    if (attributes.MERCHANT !== 1)
      alert(
        "You are not authorized to invite clients without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    else navigate("/adv/clients/new");
  };

  return (
    <>
      <GenericPage
        pageHeader="Client List"
        noHrule={true}
        buttonlist={[
          {
            name: "Invite New Client",
            color: "primary",
            variant: "contained",
            startIcon: <IconMailForward stroke={1.25} />,
            onClick: handleNewClick,
          },
        ]}
        backlink={
          location.state && location.state.backlink
            ? location.state.backlink
            : ""
        }
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Client List..." />
          </Box>
        ) : clients && clients.length > 0 ? (
          <DataGridPage
            rows={clients}
            columns={columns}
            rowLink="/adv/clients"
          />
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText
                text={
                  placeholder ? placeholder : "You do not have any clients yet!"
                }
              />
            </Box>

            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                Invite a client to organize their information and payments in
                one place. Your clients will be listed here once they sign up.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default ManageClients;
