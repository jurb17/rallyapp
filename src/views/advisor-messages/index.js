import React, { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  useMediaQuery,
  Divider,
} from "@material-ui/core";

// project component imports
import AdvisorChat from "./components/AdvisorChat";
import ChatListItem from "../../ui-component/extended/ChatListItem";
import ChatList from "ui-component/chat/ChatList";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import SupportRequest from "ui-component/modals/SupportRequest";
import ReportAbuseCard from "ui-component/cards/ReportAbuseCard";

// data and functions imports
import { showSnackbar } from "actions/main";
import { advisorChatList, advisorClientList } from "utils/advisor-dummy-data";

// style constant
const useStyles = makeStyles((theme) => ({
  detailsPanel: {
    height: "100%",
    width: "200px",
    marginLeft: theme.spacing(2),
    flexShrink: 0,
    [theme.breakpoints.down("md")]: {
      hidden: true,
    },
  },
  flexPanel: {
    height: "100%",
    flexGrow: 1,
    borderRight: `1px solid ${theme.palette.grey[300]}`,
    borderLeft: `1px solid ${theme.palette.grey[300]}`,
    paddingLeft: theme.spacing(2),
  },
  actionButton: {
    marginBottom: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.text.hint,
    borderRadius: "4px",
    paddingTop: "10px",
    paddingBottom: "10px",
    justifyContent: "center",
    "&.Mui-selected": {
      // style of text in the side menu on select.
      color: theme.menuSelected,
      backgroundColor: theme.menuSelectedBack,
      "&:hover": {
        backgroundColor: theme.menuSelectedBack,
        color: theme.menuSelected,
      },
      // style of icons in side menu on select.
      "& .MuiListItemIcon-root": {
        color: theme.menuSelected,
      },
    },
    "&:hover": {
      // style of text in side menu on hover.
      backgroundColor: theme.menuSelectedBack,
      color: theme.menuSelected,
      // style of icons in side menu on hover.
      "& .MuiListItemIcon-root": {
        color: theme.menuSelected,
      },
    },
  },
  itemButton: {
    marginBottom: theme.spacing(0.5),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.primary.main,
    borderRadius: "4px",
    paddingTop: "4px",
    paddingBottom: "4px",
    justifyContent: "start",
    textDecoration: "underline",
    "&.Mui-selected": {
      // style of text in the side menu on select.
      color: theme.menuSelected,
      backgroundColor: theme.palette.background.paper,
      "&:hover": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.primary.main,
        fontWeight: "bold",
        textDecoration: "underline",
      },
      // style of icons in side menu on select.
      "& .MuiListItemIcon-root": {
        color: theme.menuSelected,
      },
    },
    "&:hover": {
      // style of text in side menu on hover.
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.primary.main,
      fontWeight: "bold",
      textDecoration: "underline",
      // style of icons in side menu on hover.
      "& .MuiListItemIcon-root": {
        color: theme.menuSelected,
      },
    },
  },
  divider: {
    marginBottom: "0.5rem",
    borderColor: theme.palette.primary.main,
    height: "1px",
  },
}));

// ============================================================
// STATE-ONLY COMPONENT

const AdvisorMessageManagement = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const { attributes } = useSelector((state) => state.auth);
  // @@@ Add the funcitonlaity of receiving new messages another time.
  // const advisory = useSelector((state) => state.advisory);

  // extract query params from url
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get("id");

  // data states
  const [chatList, setChatList] = useState([]);
  const [chatListToDisplay, setChatListToDisplay] = useState([]);
  const [chatListObject, setChatListObject] = useState({});
  const [currentChatData, setCurrentChatData] = useState({});

  // mode states
  const [noMessages, setNoMessages] = useState(true);
  const [noChat, setNoChat] = useState(true);
  const [isClient, setIsClient] = useState(true);
  const [notApproved, setNotApproved] = useState(false);
  const [notMerchant, setNotMerchant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reportAbuse, setReportAbuse] = useState(false);

  // handle retrieving chat/client data
  const getClientData = async (adviceid) => {
    for (const client of advisorClientList) {
      if ((client.adviceid = adviceid)) {
        return { ...client };
      }
      // what if the user is not a client, but a prospect?
      // @@@ Could add this functionality later. Nice to have.
      else {
        return {};
      }
    }
  };
  // handle retrieving chat list data.
  const getChatListData = (messages) => {
    // THERE ISN'T GOING TO BE AN ELSE RESPONSE HERE ONCE WE PROVIDE DUMMY DATA
    // if the chat list is found, set the chat list data
    if (!!messages) {
      let tempChatList = [];
      let tempChatListObject = {};
      const chatlist = messages;
      setNoMessages(false);
      // loop through the chat list and create a chat object for each chat
      for (const chat of chatlist) {
        let clientData = getClientData(chat.adviceid);
        tempChatList.push({ ...chat, ...clientData }); // generating a chat list
        tempChatListObject[chat.adviceid] = { ...chat, ...clientData }; // adding data to a chat object
        // for each chat, check if the adviceid exists as a url param. if so, set the selected index to the adviceid.
        if (!!idParam && idParam === chat.adviceid) {
          setCurrentChatData({ ...chat, ...clientData });
          setNoChat(false);
          if (!!clientData.isClient) {
            setIsClient(true);
          } else {
            setIsClient(false);
          }
        }
      }
      // tempChatList.sort((a, b) => {
      //   let timeA;
      //   let timeB;
      //   let today = new Date();
      //   if (!!a.timestamp) {
      //     timeA = parseInt(a.timestamp);
      //   } else {
      //     timeA = today.getTime() + 100;
      //   }
      //   if (!!b.timestamp) {
      //     timeB = parseInt(b.timestamp);
      //   } else {
      //     timeB = today.getTime() + 100;
      //   }
      //   const num = timeB - timeA;
      //   return num;
      // });
      setChatList(tempChatList);
      setChatListToDisplay(tempChatList);
      setChatListObject(tempChatListObject);
      setIsLoading(false);
      return { ...tempChatListObject };
    } else {
      dispatch(showSnackbar("No chat messages found.", true, "warning"));
      setNoMessages(true);
      setIsLoading(false);
    }
  };
  // handle user selecting a chat from the chat list
  const handleSelectChat = async (adviceid) => {
    setSearchParams({ id: adviceid });
  };

  // handle attributes and retrieving chat data
  useMemo(async () => {
    if (attributes.ADVISOR > 1 || attributes.RIA > 1) {
      setNotApproved(true);
      setIsLoading(false);
    } else {
      // perform data manipulation of incoming message data (used to be get chat list API function)
      let chatListDataObject = getChatListData(advisorChatList);
      if (!chatListDataObject[idParam]) {
        setNoChat(true);
        setSearchParams({});
      }
    }
  }, [attributes]);

  useEffect(async () => {
    if (!!idParam && Object.keys(chatListObject).indexOf(idParam) > -1) {
      // check if chat is related to an existing client or a prospect.
      if (!!chatListObject[idParam].isClient) {
        setIsClient(true);
      } else {
        setIsClient(false);
      }
      setCurrentChatData({ ...chatListObject[idParam] });
      setNoChat(false);
    } else {
      setNoChat(true);
      setCurrentChatData({});
    }
  }, [location.search, chatListObject]);

  // USER CHAT SEARCH ============================================================

  // promise to search for the user's search input
  const searchPromise = (value) => {
    return new Promise((resolve, reject) => {
      let searchlist = [];
      chatList.forEach((chat) => {
        const name = new String(chat.name);
        if (name.indexOf(value) !== -1) {
          searchlist.push(chat);
        }
      });
      resolve(searchlist);
    });
  };
  // handle searching for a chat in the List
  const handleSearch = async (value) => {
    const newlist = await searchPromise(value);
    if (newlist.length === 0) {
      dispatch(showSnackbar("Name not found in list.", true, "warning"));
      await getChatListData(advisorChatList);
    }
    setChatListToDisplay(newlist);
  };
  // handle cancel of search for a chat in the List
  const handleCancelSearch = async () => {
    await getChatListData(advisorChatList);
  };

  // PREPARE CHAT LIST UI ============================================================

  let displayableChatList = [];
  if (chatListToDisplay.length > 0) {
    displayableChatList = chatListToDisplay.map((chat) => {
      let body = !!chat.body ? new String(chat.body) : "...";
      let advid = new String(chat.adviceid);
      let newMessage = false;
      return (
        <ChatListItem
          key={chat.adviceid}
          adviceid={chat.adviceid}
          token={chat.token}
          selectedIndex={idParam}
          clientname={chat.name}
          advisorslug=""
          lastmessage={body.length > 37 ? body.substring(0, 38) + "..." : body}
          handleSelectChat={handleSelectChat}
          newMessage={newMessage}
        />
      );
    });
  }

  // HANDLE REPORT OF ABUSE ============================================================

  // when submit button is selected.
  const handleConfirmRequest = async (title, message) => {
    // send support request to hubspot
    if (true) {
      dispatch(
        showSnackbar("Report sent to support team. Thank you.", true, "success")
      );
      setReportAbuse(false);
      setTimeout(() => {
        alert(
          "Thank you for submitting an abuse report. We will remove this client from your account and investigate this situation immediately."
        );
        window.location.reload();
      }, 1000);
    } else {
      dispatch(
        showSnackbar(
          "Error sending report. Please contact the team directly for support.",
          true,
          "error"
        )
      );
      console.log("Error sending support request from advisor Chat component.");
      setReportAbuse(false);
    }
  };

  return (
    <>
      <SupportRequest
        open={reportAbuse}
        header="Report Abuse"
        handleCancel={() => setReportAbuse(false)}
        handleConfirm={handleConfirmRequest}
      />
      {!!isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <Box display="flex">
          {/* CHAT LIST */}
          {(!searchParams.get("id") || !matchDownSm) && (
            <ChatList
              handleSearch={handleSearch}
              handleCancelSearch={handleCancelSearch}
              noMessages={noMessages}
              displaychatlist={displayableChatList}
            />
          )}
          {/* CHAT WINDOW */}
          {(!!searchParams.get("id") || !matchDownSm) && (
            <Box className={classes.flexPanel}>
              <AdvisorChat
                notApproved={notApproved}
                notMerchant={notMerchant}
                noChat={noChat}
                isClient={isClient}
                clientname={currentChatData.name}
                adviceid={currentChatData.id}
                token={currentChatData.token}
                refreshChatList={() => getChatListData(advisorChatList)}
                chatMessages={currentChatData.messages}
              />
            </Box>
          )}
          {/* CONTACT DETAILS */}
          {!!matchUpLg && !notApproved && !notMerchant ? (
            <Box className={classes.detailsPanel}>
              {/* @@@ create new component for organization pruposes. */}
              <Typography variant="h3" sx={{ mb: 1 }}>
                Contact Details
              </Typography>
              {!currentChatData ||
              Object.entries(currentChatData).length === 0 ? (
                <Box
                  className="horizontal-center"
                  mt={1}
                  style={{ width: "100%" }}
                >
                  <Typography variant="h5" margin={1}>
                    <em>
                      Please select a chat from the list to view contact
                      details.
                    </em>
                  </Typography>
                </Box>
              ) : (
                <>
                  <Box className="detailsbox">
                    <Typography variant="body1">
                      Invited: {!!currentChatData.invited ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body1">
                      State:{" "}
                      {currentChatData.state
                        ? currentChatData.state.toUpperCase()
                        : ""}
                    </Typography>
                  </Box>
                  {!!currentChatData.id && (
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton
                          disableGutters
                          className={classes.actionButton}
                          onClick={() =>
                            !!isClient
                              ? navigate(`/adv/clients/${currentChatData.id}`)
                              : navigate(`/adv/prospects/${currentChatData.id}`)
                          }
                        >
                          View Profile
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          disableGutters
                          className={classes.actionButton}
                          onClick={() =>
                            navigate(`/adv/invoices/?id=${currentChatData.id}`)
                          }
                          disabled={!!noChat}
                        >
                          View Invoices
                        </ListItemButton>
                      </ListItem>
                      <Divider className={classes.divider} variant="middle" />
                      <ListItem disablePadding>
                        <ListItemButton
                          disableGutters
                          className={classes.actionButton}
                          onClick={() =>
                            navigate(
                              `/adv/invoices/new/?id=${currentChatData.id}`
                            )
                          }
                          disabled={!!noChat}
                        >
                          Send New Invoice
                        </ListItemButton>
                      </ListItem>
                    </List>
                  )}
                  <ReportAbuseCard
                    header="Report a Problem"
                    message="Clients must follow rules and policies when using the chat
                    feature. Please report any activities that may violate our
                    Terms of Service."
                    handleClick={() => setReportAbuse(true)}
                  />
                </>
              )}
            </Box>
          ) : null}
        </Box>
      )}
    </>
  );
};

export default AdvisorMessageManagement;
