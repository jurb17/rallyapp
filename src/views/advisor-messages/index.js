import React, { useEffect, useState, useMemo, useRef } from "react";
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
import AdvisorChat from "./components/AdvisorChat";
import advisoryService from "services/advisory.service";
import { showSnackbar } from "actions/main";
import ChatListItem from "../../ui-component/extended/ChatListItem";
import { useSelector } from "react-redux";
import ChatList from "ui-component/chat/ChatList";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import SupportRequest from "ui-component/modals/SupportRequest";
import ReportAbuseCard from "ui-component/cards/ReportAbuseCard";

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
  const advisory = useSelector((state) => state.advisory);

  // extract query params from url
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get("id");

  // data states
  const [allChatList, setAllChatList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [chatObject, setChatObject] = useState({});
  const [chatData, setChatData] = useState({});

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
    return new Promise(async (resolve, reject) => {
      await advisoryService
        .getClient({ clientid: adviceid })
        .then(async (response) => {
          if (!!response.data.payload.success) {
            // if the client is found, set the client data
            if (!!Object.entries(response.data.payload.client).length > 0) {
              resolve({ ...response.data.payload.client, isClient: true });
            }
            // otherwise, request the prospect data
            else {
              await advisoryService
                .getProspect({ clientid: adviceid })
                .then((response) => {
                  if (!!response.data.payload.success) {
                    resolve({
                      ...response.data.payload.client,
                      isClient: false,
                    });
                  } else {
                    dispatch(
                      showSnackbar(response.data.details.text, true, "error")
                    );
                    console.log(
                      "error with prospect data request",
                      response.data.details.text
                    );
                  }
                });
            }
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            console.log(
              "error with client data request",
              response.data.details.text
            );
          }
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
        });
    });
  };
  // handle retrieving chat list data.
  const getChatListData = async () => {
    return new Promise(async (resolve, reject) => {
      await advisoryService
        .getChatList({})
        .then(async (response) => {
          if (!!response.data.payload.success) {
            let chats = [];
            let chatobj = {};
            // if the chat list is found, set the chat list data
            if (!!response.data.payload.messages) {
              setNoMessages(false);
              const chatlist = response.data.payload.messages;
              // loop through the chat list and create a chat object for each chat
              for (const chat of chatlist) {
                let clientData = await getClientData(chat.adviceid);
                chats.push({ ...chat, ...clientData });
                chatobj[chat.adviceid] = { ...chat, ...clientData };
                // for each chat, check if the adviceid exists as a url param. if so, set the selected index to the adviceid.
                if (!!idParam && idParam === chat.adviceid) {
                  setChatData({ ...chat, ...clientData });
                  setNoChat(false);
                  if (!!clientData.isClient) {
                    setIsClient(true);
                  } else {
                    setIsClient(false);
                  }
                }
              }
              chats.sort((a, b) => {
                let timeA;
                let timeB;
                let today = new Date();
                if (!!a.timestamp) {
                  timeA = parseInt(a.timestamp);
                } else {
                  timeA = today.getTime() + 100;
                }
                if (!!b.timestamp) {
                  timeB = parseInt(b.timestamp);
                } else {
                  timeB = today.getTime() + 100;
                }
                const num = timeB - timeA;
                return num;
              });
              setAllChatList(chats);
              setChatList(chats);
              setChatObject(chatobj);
              setIsLoading(false);
              resolve({ ...chatobj });
            } else {
              dispatch(
                showSnackbar("No chat messages found.", true, "warning")
              );
              setNoMessages(true);
              setIsLoading(false);
            }
          } else {
            reject(response.data.details.text);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          reject(error.message);
        });
    });
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
    } else if (attributes.MERCHANT < 1) {
      setNotMerchant(true);
      setIsLoading(false);
    } else {
      await getChatListData()
        .then((chatobj) => {
          if (!chatobj[idParam]) {
            setNoChat(true);
            setSearchParams({});
          }
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
    }
    // if there's a chat id in the url, the chat data is assigned within the loop of "getChatListData".
  }, [attributes, advisory.unreadchats]);

  useEffect(async () => {
    if (!!idParam && Object.keys(chatObject).indexOf(idParam) > -1) {
      if (!!chatObject[idParam].isClient) {
        setIsClient(true);
      } else {
        setIsClient(false);
      }
      setChatData({ ...chatObject[idParam] });
      setNoChat(false);
    } else {
      setNoChat(true);
      setChatData({});
    }
  }, [location.search]);

  // USER CHAT SEARCH ============================================================

  // promise to search for the user's search input
  const searchPromise = (value) => {
    return new Promise((resolve, reject) => {
      let searchlist = [];
      allChatList.forEach((chat) => {
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
      await getChatListData();
    }
    setChatList(newlist);
  };
  // handle cancel of search for a chat in the List
  const handleCancelSearch = async () => {
    await getChatListData();
  };

  // PREPARE CHAT LIST UI ============================================================

  let displaychatlist = [];
  if (chatList.length > 0) {
    displaychatlist = chatList.map((chat) => {
      let body = !!chat.body ? new String(chat.body) : "...";
      let advid = new String(chat.adviceid);
      let newMessage = false;
      if (!!advisory.unreadchats[advid]) {
        newMessage = true;
      }
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
  const handleConfirm = async (title, message) => {
    // send support request to hubspot
    await advisoryService
      .postReport({
        title: title,
        message: message,
        adviceid: idParam,
      })
      .then((response) => {
        if (!!response.data.payload.success) {
          dispatch(
            showSnackbar(
              "Report sent to support team. Thank you.",
              true,
              "success"
            )
          );
          setReportAbuse(false);
          setTimeout(() => {
            alert(
              "Thank you for submitting an abuse report. We will remove this client from your account and investigate this situation immediately."
            );
            window.location.reload();
          }, 1000);
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(response.data.details.text);
          setReportAbuse(false);
        }
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
      });
  };

  return (
    <>
      <SupportRequest
        open={reportAbuse}
        header="Report Abuse"
        handleCancel={() => setReportAbuse(false)}
        handleConfirm={handleConfirm}
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
              displaychatlist={displaychatlist}
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
                clientname={chatData.name}
                adviceid={chatData.id}
                token={chatData.token}
                refreshChatList={getChatListData}
              />
            </Box>
          )}
          {/* CONTACT DETAILS */}
          {!!matchUpLg && !notApproved && !notMerchant ? (
            <Box className={classes.detailsPanel}>
              <Typography variant="h3" sx={{ mb: 1 }}>
                Contact Details
              </Typography>
              {!chatData || Object.entries(chatData).length === 0 ? (
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
                      Invited: {!!chatData.invited ? "Yes" : "No"}
                    </Typography>
                    <Typography variant="body1">
                      State:{" "}
                      {chatData.state ? chatData.state.toUpperCase() : ""}
                    </Typography>
                  </Box>
                  {!!chatData.id && (
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton
                          disableGutters
                          className={classes.actionButton}
                          onClick={() =>
                            !!isClient
                              ? navigate(`/adv/clients/${chatData.id}`)
                              : navigate(`/adv/prospects/${chatData.id}`)
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
                            navigate(`/adv/invoices/?id=${chatData.id}`)
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
                            navigate(`/adv/invoices/new/?id=${chatData.id}`)
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
