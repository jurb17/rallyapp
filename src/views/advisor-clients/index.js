import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// mui
import { Box } from "@material-ui/core";

// project imports
import advisoryService from "services/advisory.service";
import DataGridPage from "ui-component/pages/DataGridPage";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";
import { IconMailForward } from "@tabler/icons";

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
      if (!!client.state) {
        client.stateString = client.state.toUpperCase();
      } else {
        client.stateString = "--";
      }
      if (!!client.invited) {
        client.invitedString = "Yes";
        client.emailString = client.email;
      } else {
        client.invitedString = "No";
        client.emailString = "not available";
      }
      if (!!client.id) {
        client.selectionroute = `/adv/clients/${client.id}`;
      }
    }
    return clients;
  };

  // function with get request to get list of clients
  const getClientsData = async () => {
    await advisoryService
      .getClientList({})
      .then((response) => {
        if (!!response.data.payload.success) {
          if (!!response.data.payload.clients) {
            let clients = response.data.payload.clients;
            const newClients = prepClientsData(clients);
            setClients([...newClients]);
          } else {
            dispatch(showSnackbar("No clients found.", true, "warning"));
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
      await getClientsData();
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
    // {
    //   field: "invitedString",
    //   headerName: "Invited",
    //   minWidth: 80,
    //   width: 80,
    //   hide: false,
    // },
    {
      field: "stateString",
      headerName: "State",
      minWidth: 150,
      width: 150,
      hide: false,
    },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
    // { field: "invited", headerName: "", minWidth: 10, width: 10, hide: true },
    // { field: "email", headerName: "", minWidth: 10, width: 10, hide: true },
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
    if (attributes.MERCHANT !== 1) {
      alert(
        "You are not authorized to invite clients without a merchant account with Stripe. Please finish setting up your merchant account by navigating to account settings."
      );
    } else {
      navigate("/adv/clients/new");
    }
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
