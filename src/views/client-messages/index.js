import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";

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

// project imports
import ClientChat from "./components/ClientChat";
import { showSnackbar } from "actions/main";
import ChatListItem from "ui-component/extended/ChatListItem";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";
import ChatList from "ui-component/chat/ChatList";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import SupportRequest from "ui-component/modals/SupportRequest";
import ReportAbuseCard from "ui-component/cards/ReportAbuseCard";

// data and functions
import { clientChatList } from "utils/client-dummy-data";

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
    paddingLeft: theme.spacing(1),
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
    // marginTop: "0.5rem",
    marginBottom: "0.5rem",
    borderColor: theme.palette.primary.main,
    height: "1px",
  },
}));

// ============================================================
// STATE-ONLY COMPONENT

const ClientChatManagement = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchUpLg = useMediaQuery(theme.breakpoints.up("lg"));
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  // extract query params from url
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get("id");

  // data states
  const [chatSearch, setChatSearch] = useState("");
  const [chatList, setChatList] = useState([]);
  const [chatObject, setChatObject] = useState({});

  // mode states
  const [backlink, setBacklink] = useState("");
  const [noMessages, setNoMessages] = useState(true);
  const [notSetup, setNotSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reportAbuse, setReportAbuse] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // handle retrieving chat/advisor data
  const getAdvisorData = async (names, adviceid, token) => {};
  // load data into chatList state variable
  const loadChatList = (chatdata) => {
    // generate the initial chatList
    let tempChatList = [...chatdata];
    // sort the chat list by date
    tempChatList.sort((a, b) => {
      let timeA;
      let timeB;
      let today = new Date();
      if (a.timestamp) timeA = parseInt(a.timestamp);
      else timeA = today.getTime() + 100;
      if (b.timestamp) timeB = parseInt(b.timestamp);
      else timeB = today.getTime() + 100;
      const num = timeB - timeA;
      return num;
    });
    setChatList(tempChatList);
  };
  // load data into chatObject state variable
  const loadChatObject = (chatdata) => {
    // generate the initial chat object
    let tempChatObject = {};
    // loop through the chat list and create a chat list object
    for (const chat of chatdata) tempChatObject[chat.adviceid] = { ...chat };
    setChatObject(tempChatObject);
  };

  // update all of the state variables when the index.js file mounts.
  useEffect(() => {
    if (clientChatList) {
      setNoMessages(false);
      loadChatList(clientChatList);
      loadChatObject(clientChatList);
      // be careful that isLoading isn't flipped before the previous functions are done running.
      setIsLoading(false);
    } else {
      dispatch(showSnackbar("No chat messages found.", true, "warning"));
      setNoMessages(true);
      setIsLoading(false);
    }
  }, []);

  // CHAT MESSAGES ==========================================================
  // handle user selecting a chat from the chat list
  const handleSelectChat = async (adviceid) =>
    setSearchParams({ id: adviceid });

  // handle chat list and object updates for new message.
  const handlePostChatMessage = (newmessage, timestamp, adviceid) => {
    // update object with new message
    setChatObject((prevState) => ({
      ...prevState,
      [adviceid]: {
        ...prevState[adviceid],
        body: newmessage,
        timestamp: timestamp,
        messages: [...prevState[adviceid].messages, newmessage],
      },
    }));
    // create temp list of chats and update chat with current adviceid
    const tempchatlist = chatList.map((chat) => {
      if (chat.adviceid === adviceid)
        return { ...chat, body: newmessage.body, timestamp: timestamp };
      else return chat;
    });
    // regenerate the chat list.
    loadChatList(tempchatlist);
  };

  // handle chat list and object updates for deleted message.
  const handleDeleteChatMessage = (messageid, timestamp, adviceid) => {
    let tempmessageslist = [];
    // add the "deletedAt" attribute to the deleted message
    for (const message of chatObject[adviceid].messages) {
      if (message.id === messageid) message["deletedAt"] = timestamp;
      tempmessageslist.push(message);
    }
    setChatObject((prevState) => ({
      ...prevState,
      [adviceid]: {
        ...prevState[adviceid],
        body: "[message deleted]",
        timestamp: timestamp,
        messages: [...tempmessageslist],
      },
    }));
    // create temp list of chats and update chat with current adviceid
    const tempchatlist = chatList.map((chat) => {
      if (chat.adviceid === adviceid)
        return { ...chat, body: "[message deleted]", timestamp: timestamp };
      else return chat;
    });
    // regenerate the chat list.
    loadChatList(tempchatlist);
  };

  // CHAT LIST ============================================================
  // generate list of components that are displayed in the chat window.
  const createChatList = (chatlist) => {
    let components = [];
    components = chatlist.map((chat) => {
      let body = !!chat.body ? new String(chat.body) : "...";
      let newMessage = false;
      return (
        <ChatListItem
          key={chat.adviceid}
          adviceid={chat.adviceid}
          token={chat.token}
          selectedIndex={idParam}
          contactname={chat.advisorname}
          lastmessage={body.length > 37 ? body.substring(0, 38) + "..." : body}
          handleSelectChat={handleSelectChat}
          newMessage={newMessage}
        />
      );
    });
    return components;
  };
  // search for matching chats
  const searchForChats = (value) => {
    let searchlist = [];
    chatList.forEach((chat) => {
      const name = new String(chat.name.toLowerCase());
      if (name.indexOf(value.toLowerCase()) !== -1) searchlist.push(chat);
    });
    return searchlist;
  };
  // memoize the displayChats
  const displayChats = useMemo(() => {
    // no user search, then generate the entire list of chats.
    if (!chatSearch) return createChatList(chatList);
    // if there's a chatSearch, then search for chats and generate new list.
    else {
      const newlist = searchForChats(chatSearch);
      if (!newlist.length) {
        dispatch(showSnackbar("Name not found in list.", true, "warning"));
        return createChatList(chatList);
      } else return createChatList(newlist);
    }
  }, [chatSearch, chatList, idParam]);
  // handle cancel of search for a chat in the List
  const handleCancelSearch = () => setChatSearch("");

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
      console.log("Error sending support request from client Chat component.");
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
      <ConfirmPrimaryModal
        open={notSetup}
        heading="Please Complete Customer Setup"
        body="Chat messages will not be seen by advisors until you complete your customer setup with Stripe. Please click 'Continue' below to complete this process."
        action="Continue"
        handleCancel={() => setNotSetup(false)}
        handleConfirm={() => navigate("/client/settings")}
        nonaction="Later"
      />
      <ConfirmPrimaryModal
        open={showProfile}
        heading="Web Profiles Not Available"
        body="Typically each Rally advisor would have an associated firm profile and advisor profile on the Rally website. These web pages showcase services and content created by the advisors themselves using the tools on the Rally app. Web profiles are not available for this demo version."
        action="Continue"
        handleConfirm={() => setShowProfile(false)}
      />
      {isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <Box display="flex">
          {/* CHAT LIST */}
          {(!idParam || !matchDownSm) && (
            <ChatList
              handleSearch={searchForChats}
              handleCancelSearch={handleCancelSearch}
              noMessages={noMessages}
              displaychatlist={displayChats}
            />
          )}
          {/* CHAT WINDOW */}
          {(idParam || !matchDownSm) && (
            <Box className={classes.flexPanel}>
              <ClientChat
                noChat={true}
                firmslug={idParam ? chatObject[idParam].firmslug : undefined}
                advisorslug={
                  idParam ? chatObject[idParam].advisorslug : undefined
                }
                advisorname={
                  idParam ? chatObject[idParam].advisorname : undefined
                }
                adviceid={idParam ? chatObject[idParam].adviceid : undefined}
                token={idParam ? chatObject[idParam].token : undefined}
                currentMessages={idParam ? chatObject[idParam].messages : []}
                postChatMessage={handlePostChatMessage}
                deleteChatMessage={handleDeleteChatMessage}
              />
            </Box>
          )}
          {/* CONTACT DETAILS */}
          {matchUpLg ? (
            <Box className={classes.detailsPanel}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Contact Details
              </Typography>
              {!idParam ? (
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
                      Location:{" "}
                      {chatObject[idParam].advisorstate
                        ? chatObject[idParam].advisorstate.toUpperCase()
                        : ""}
                    </Typography>
                  </Box>
                  {chatObject[idParam].adviceid &&
                    chatObject[idParam].firmslug &&
                    chatObject[idParam].advisorslug && (
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton
                            disableGutters
                            className={classes.actionButton}
                            onClick={() => setShowProfile(true)}
                            //   () => {
                            //   history.pushState(
                            //     null,
                            //     null,
                            //     `/advisory/client/messages/?id=${chatObject[idParam].adviceid}`
                            //   );
                            //   window.location.href = `https://rally.markets/firm/${chatObject[idParam].firmslug}/advisor/${chatObject[idParam].advisorslug}`;
                            // }}
                          >
                            Advisor Profile
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton
                            disableGutters
                            className={classes.actionButton}
                            onClick={() => setShowProfile(true)}
                            //   () => {
                            //   history.pushState(
                            //     null,
                            //     null,
                            //     `/advisory/client/messages/?id=${chatObject[idParam].adviceid}`
                            //   );
                            //   window.location.href = `https://rally.markets/firm/${chatObject[idParam].firmslug}`;
                            // }}
                          >
                            Firm Profile
                          </ListItemButton>
                        </ListItem>
                        <Divider className={classes.divider} />
                        <ListItem disablePadding>
                          <ListItemButton
                            disableGutters
                            className={classes.actionButton}
                            onClick={() =>
                              navigate(
                                `/client/payments/?id=${chatObject[idParam].adviceid}`,
                                {
                                  state: {
                                    backlink: !!backlink ? backlink : "",
                                  },
                                }
                              )
                            }
                            disabled={true}
                          >
                            Payment History
                          </ListItemButton>
                        </ListItem>
                      </List>
                    )}
                  <ReportAbuseCard
                    header="Report a Problem"
                    message="Advisors are prohibited from carrying out transactions outside of the platform for your safety. Please report any activities that may violate our Terms of Service."
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

export default ClientChatManagement;
