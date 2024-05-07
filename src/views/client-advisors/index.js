import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { IconExternalLink } from "@tabler/icons";

// project imports
import adviceService from "services/advice.service";
import DataGridPage from "ui-component/pages/DataGridPage";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import DynamicButton from "ui-component/buttons/DynamicButton";

// style constant
const useStyles = makeStyles((theme) => ({}));

// =============================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const RequestManagement = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { attributes } = useSelector((state) => state.auth);

  // data states
  const [advisors, setAdvisors] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [placeholder, setPlaceholder] = useState("");

  // get payment list data
  const retrieveAdvisorListData = async () => {
    await adviceService
      .getAdvisorList({})
      .then((response) => {
        if (!!response.data.payload.success) {
          if (!!response.data.payload.clients) {
            let advisorlist = response.data.payload.clients;
            for (const advisor of advisorlist) {
              if (!!advisor.firmslug) {
                advisor.selectionroute = `https://www.rally.markets/firm/${advisor.firmslug}/`;
              }
            }
            setAdvisors([...advisorlist]);
          } else {
            dispatch(showSnackbar("No advisors found.", true, "warning"));
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(response.data.details.text);
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

  useEffect(() => {
    if (attributes.CUSTOMER !== 1) {
      setPlaceholder(
        "You're account setup is incomplete. Please create a customer account with Stripe from the settings page."
      );
      setIsLoading(false);
    } else {
      retrieveAdvisorListData();
    }
  }, []);

  // define row data. firstname, middlename, lastname, prefix, suffix, nickname, email, phone
  const columns: GridColDef[] = [
    {
      field: "advisorname",
      headerName: "Advisor Name",
      minWidth: 200,
      width: 200,
      hide: false,
    },
    {
      field: "firmname",
      headerName: "Firm Name",
      minWidth: 200,
      width: 200,
      hide: false,
    },
    {
      field: "viewfirm",
      headerName: "",
      sortable: false,
      width: 120,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.firmslug ? (
              <Box
                className="horizontal-center"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <DynamicButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    window.location.href = `https://www.rally.markets/firm/${params.row.firmslug}/`;
                  }}
                >
                  {" "}
                  View Firm{" "}
                </DynamicButton>
              </Box>
            ) : null}
          </>
        );
      },
    },
    {
      field: "viewadvisor",
      headerName: "",
      sortable: false,
      width: 140,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.firmslug ? (
              <Box
                className="horizontal-center"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <DynamicButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    window.location.href = `https://www.rally.markets/firm/${params.row.firmslug}/advisor/${params.row.advisorslug}/`;
                  }}
                >
                  {" "}
                  View Advisor{" "}
                </DynamicButton>
              </Box>
            ) : null}
          </>
        );
      },
    },
    {
      field: "viewchat",
      headerName: "",
      sortable: false,
      width: 120,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        return (
          <>
            {params.row.id ? (
              <Box
                className="horizontal-center"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <DynamicButton
                  variant="outlined"
                  color="primary"
                  onClick={() => {
                    navigate(`/client/messages/?id=${params.row.id}`);
                  }}
                >
                  {" "}
                  View Chat{" "}
                </DynamicButton>
              </Box>
            ) : null}
          </>
        );
      },
    },
    { field: "id", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "token", headerName: "", minWidth: 10, width: 10, hide: true },
    { field: "firmslug", headerName: "", minWidth: 10, width: 10, hide: true },
    {
      field: "advisorslug",
      headerName: "",
      minWidth: 10,
      width: 10,
      hide: true,
    },
    {
      field: "selectionroute",
      headerName: "",
      minWidth: 10,
      width: 10,
      hide: true,
    },
  ];

  return (
    <>
      <GenericPage
        pageHeader="My Advisors"
        noHrule={true}
        buttonlist={[
          {
            // name: "Request New Advisor",
            name: "Search For Advice",
            color: "primary",
            variant: "contained",
            // startIcon: <IconExternalLink stroke={1.25} />,
            // onClick: () => {
            //   navigate("/client/advisors/new");
            // },
            onClick: () =>
              (window.location.href =
                "https://www.rally.markets/advisor-finder/"),
          },
        ]}
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Advisor List..." />
          </Box>
        ) : advisors && advisors.length > 0 ? (
          <DataGridPage rows={advisors} columns={columns} noRowClick={true} />
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText
                text={
                  placeholder
                    ? placeholder
                    : "You have no advisor connections yet!"
                }
              />
            </Box>

            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                Search for advice with our advisor finder. Once you find the
                right advisor, send a request to connect. Your advisor
                connections will be listed here.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default RequestManagement;
