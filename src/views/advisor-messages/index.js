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
  const [userSearch, setUserSearch] = useState("");
  const [chatList, setChatList] = useState([]);
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
      if ((client.id = adviceid)) {
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
    // if the chat list is found, set the chat list data
    if (!!messages) {
      setNoMessages(false);
      let tempChatList = [];
      let tempChatListObject = {};
      const chatlist = messages;
      // loop through the chat list and create a chat object for each chat
      for (const chat of chatlist) {
        let clientData = getClientData(chat.adviceid);
        tempChatList.push({ ...chat, ...clientData }); // generating a chat list
        tempChatListObject[chat.adviceid] = { ...chat, ...clientData }; // adding data to a chat object
        // for each chat, check if the adviceid exists as a url param. if so, set the selected index to the adviceid.
        if (idParam && idParam === chat.adviceid) {
          setCurrentChatData({ ...chat, ...clientData });
          setNoChat(false);
          if (clientData.isClient) {
            setIsClient(true);
          } else {
            setIsClient(false);
          }
        }
      }
      tempChatList.sort((a, b) => {
        let timeA;
        let timeB;
        let today = new Date();
        if (a.timestamp) {
          timeA = parseInt(a.timestamp);
        } else {
          timeA = today.getTime() + 100;
        }
        if (b.timestamp) {
          timeB = parseInt(b.timestamp);
        } else {
          timeB = today.getTime() + 100;
        }
        const num = timeB - timeA;
        return num;
      });
      setChatList(tempChatList);
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

  //use cases
  // 1: user just logged on, no idParam
  // load chatList, leave currentChatDAta empty
  // 2: user switches to a specific chat, chatList exists, idParam change
  // leave chatList alone, load currentCHatDAta
  // 3: user arrives to chat with idParam in url, no chatList, idParam exists
  // load chatList, load currentChatData

  // if a message is sent, that chat should move to the top of the chat list. -> new messages are only really going to persist in global state, so when "refresh" is selected, all data is erased.
  // if a message is deleted, that chat should move to the top of the list.
  // open the page -> need list of chats. Need to determine list of displayable chats. Need a function to convert those chats to displayable components
  // search for a chat -> need to update list of displayable chats. Then need to run function for displayable components.
  // @@@ evaluating attributes? is that necessary?

  useEffect(() => {
    // if no chatList and there is an advisorChatList (dummy data), then update all state variables
    if (
      !chatList.length &&
      !Object.keys(chatListObject).length &&
      advisorChatList.length
    )
      getChatListData(advisorChatList);
    else {
      // if there is a chatList, but the idParam has changed, then update currentChatData
      if (idParam && Object.keys(chatListObject).length) {
        setCurrentChatData({ ...chatListObject[idParam] });
        setNoChat(false);
        // @@@ Add isClient logic for prospects? Maybe later
      } else {
        setNoChat(true);
        setCurrentChatData({});
      }
    }
  }, [idParam, chatList]);

  // PREPARE CHAT LIST UI ============================================================
  const createChatList = (chatlist) => {
    let components = [];
    if (chatlist.length > 0) {
      components = chatlist.map((chat) => {
        let body = !!chat.body ? new String(chat.body) : "...";
        let newMessage = false;
        return (
          <ChatListItem
            key={chat.adviceid}
            adviceid={chat.adviceid}
            token={chat.token}
            selectedIndex={idParam}
            clientname={chat.name}
            advisorslug=""
            lastmessage={
              body.length > 37 ? body.substring(0, 38) + "..." : body
            }
            handleSelectChat={handleSelectChat}
            newMessage={newMessage}
          />
        );
      });
      return components;
    } else return components;
  };
  // memoize the displayChats
  const displayChats = useMemo(() => {
    if (!userSearch) return createChatList(chatList);
    else return handleSearch(userSearch);
  }, [userSearch, chatList]);

  // USER CHAT SEARCH ============================================================
  // promise to search for the user's search input
  const searchPromise = (value) => {
    return new Promise((resolve, reject) => {
      let searchlist = [];
      chatList.forEach((chat) => {
        const name = new String(chat.name.toLowerCase());
        if (name.indexOf(value.toLowerCase()) !== -1) {
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
      createChatList(chatList);
    } else createChatList(newlist);
  };
  // handle cancel of search for a chat in the List
  const handleCancelSearch = () => setUserSearch("");

  // HANDLE REPORT OF ABUSE ============================================================

  // when submit button is selected.
  const handleConfirmRequest = async (title, message) => {
    // send support request to hubspot - NOT IN DEMO VERSION
    /* @@@ Maybe this would be a good opportunity to record the user email or have
    an email message sent to them explaining that there isn't a connected database,
    etc. This would help showcase your management of automated process. */
    if (true) {
      dispatch(
        showSnackbar("Report sent to support team. Thank you.", true, "success")
      );
      setReportAbuse(false);
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
              displaychatlist={displayChats}
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
                adviceid={currentChatData.adviceid}
                token={currentChatData.token}
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
                  {!!currentChatData.adviceid && (
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton
                          disableGutters
                          className={classes.actionButton}
                          onClick={() =>
                            !!isClient
                              ? navigate(
                                  `/adv/clients/${currentChatData.adviceid}`
                                )
                              : navigate(
                                  `/adv/prospects/${currentChatData.adviceid}`
                                )
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
                            navigate(
                              `/adv/invoices/?id=${currentChatData.adviceid}`
                            )
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
                              `/adv/invoices/new/?id=${currentChatData.adviceid}`
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
