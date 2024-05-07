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
import AdviceChat from "./components/AdviceChat";
import { showSnackbar } from "actions/main";
import ChatListItem from "ui-component/extended/ChatListItem";
import { useSelector } from "react-redux";
import adviceService from "services/advice.service";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";
import ChatList from "ui-component/chat/ChatList";
import { mapStateName } from "utils/DataMapFunctions";
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
  const advice = useSelector((state) => state.advice);
  const { attributes } = useSelector((state) => state.auth);

  // extract query params from url
  const [searchParams, setSearchParams] = useSearchParams();
  const idParam = searchParams.get("id");

  // data states
  const [allChatList, setAllChatList] = useState([]);
  const [chatList, setChatList] = useState([]);
  const [chatObject, setChatObject] = useState({});
  const [chatData, setChatData] = useState({});

  // mode states
  const [backlink, setBacklink] = useState("");
  const [noMessages, setNoMessages] = useState(true);
  const [noChat, setNoChat] = useState(true);
  const [notSetup, setNotSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [reportAbuse, setReportAbuse] = useState(false);

  // handle retrieving chat/advisor data
  const getAdvisorData = async (names, adviceid, token) => {
    const firmslug = names.split("/")[0];
    const advisorslug = names.split("/")[1];
    return new Promise(async (resolve, reject) => {
      await adviceService
        .getAdvisor({ firmslug: firmslug }, { advisor: advisorslug })
        .then((response) => {
          if (!!response.data.payload.success) {
            let advisorData = response.data.payload;
            if (!!advisorData.advisor && !!advisorData.advisor.state) {
              advisorData.advisor.state = mapStateName(
                advisorData.advisor.state
              );
            }
            advisorData.id = adviceid;
            advisorData.token = token;
            advisorData.firmslug = firmslug;
            advisorData.advisorslug = advisorslug;
            resolve(advisorData);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            console.log("caught error", response.data.details.text);
            reject(response.data.details.text);
            return;
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
          reject(error);
          return;
        });
    });
  };
  // handle retrieving chat list data.
  const getChatListData = async () => {
    await adviceService
      .getChatList({})
      .then(async (response) => {
        if (!!response.data.payload.success) {
          let chats = [];
          let chatobj = {};
          if (!!response.data.payload.messages) {
            setNoMessages(false);
            const chatlist = response.data.payload.messages;
            // cycle through all of the chats to collect the associated advisor data.
            for (const chat of chatlist) {
              let clientData = await getAdvisorData(
                chat.name,
                chat.adviceid,
                chat.token
              );
              chats.push({ ...chat, ...clientData });
              chatobj[chat.adviceid] = { ...chat, ...clientData };
              if (!!idParam && idParam === chat.adviceid) {
                setChatData({ ...chat, ...clientData });
                setNoChat(false);
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
            return chats;
          } else {
            dispatch(showSnackbar("No chat messages found.", true, "warning"));
            setNoMessages(true);
            setIsLoading(false);
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
          console.log(
            "uncaught error with chat list data request",
            response.data.details.text
          );
          setIsLoading(false);
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
  };

  // handle user selecting a chat from the chat list
  const handleSelectChat = async (adviceid, token, names) => {
    setSearchParams({ id: adviceid });
    setChatData({ ...chatObject[adviceid] });
  };

  // handle retrieving chat data.
  useMemo(async () => {
    await getChatListData();
    setNotSetup(Boolean(attributes.CUSTOMER !== 1));

    // if there's a chat id in the url, the chat data is assigned within the loop of "getChatListData".
  }, [attributes, advice.unreadchats]);

  // handle location change.
  useEffect(async () => {
    const searchParam = searchParams.get("id");
    if (!!searchParam) {
      setNoChat(false);
    } else {
      setNoChat(true);
      console.log("no chat id in url");
    }
  }, [location.search]);

  useEffect(() => {
    if (attributes.CUSTOMER === 0 && !isLoading) {
      navigate("/prospect/new");
    }
  }, [attributes, isLoading]);

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

  let displaychatlist = [];
  if (chatList.length > 0) {
    displaychatlist = chatList.map((chat) => {
      let body = !!chat.body ? new String(chat.body) : "...";
      let advid = new String(chat.adviceid);
      let newMessage = false;
      if (!!advice.unreadchats[advid]) {
        newMessage = true;
      }
      return (
        <ChatListItem
          key={chat.adviceid}
          adviceid={chat.adviceid}
          token={chat.token}
          selectedIndex={idParam}
          clientname={
            chat.advisor && chat.advisor.name ? chat.advisor.name : ""
          }
          advisorslug={chat.name}
          lastmessage={body.length > 37 ? body.substring(0, 38) + "..." : body}
          handleSelectChat={handleSelectChat}
          newMessage={newMessage}
          disconnected={chat.disconnected}
        />
      );
    });
  }

  // HANDLE REPORT OF ABUSE ============================================================

  // when submit button is selected.
  const handleConfirm = async (title, message) => {
    // send support request to hubspot
    await adviceService
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
              "Thank you for submitting an abuse report. We will disconnect you from this advisor and investigate this situation immediately."
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
      <ConfirmPrimaryModal
        open={notSetup}
        heading="Please Complete Customer Setup"
        body="Chat messages will not be seen by advisors until you complete your customer setup with Stripe. Please click 'Continue' below to complete this process."
        action="Continue"
        handleCancel={() => setNotSetup(false)}
        handleConfirm={() => navigate("/client/settings")}
        nonaction="Later"
      />
      {!!isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <Box display="flex">
          {/* CHAT LIST */}
          {(!idParam || !matchDownSm) && (
            <ChatList
              handleSearch={handleSearch}
              handleCancelSearch={handleCancelSearch}
              noMessages={noMessages}
              displaychatlist={displaychatlist}
            />
          )}
          {/* CHAT WINDOW */}
          {(!!idParam || !matchDownSm) && (
            <Box className={classes.flexPanel}>
              <AdviceChat
                noChat={noChat}
                disconnected={!!chatData?.disconnected ? true : false}
                firmslug={chatData.firmslug}
                advisorslug={chatData.advisorslug}
                clientname={
                  chatData.advisor && chatData.advisor.name
                    ? chatData.advisor.name
                    : ""
                }
                adviceid={chatData.id}
                token={chatData.token}
                refreshChatList={getChatListData}
              />
            </Box>
          )}
          {/* CONTACT DETAILS */}
          {!!matchUpLg ? (
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
                      Location:{" "}
                      {!!chatData.advisor && !!chatData.advisor.location
                        ? chatData.advisor.location
                        : ""}
                    </Typography>
                  </Box>
                  {!!chatData.id &&
                    !!chatData.firmslug &&
                    !!chatData.advisorslug && (
                      <List>
                        <ListItem disablePadding>
                          <ListItemButton
                            disableGutters
                            className={classes.actionButton}
                            onClick={() => {
                              history.pushState(
                                null,
                                null,
                                `/advisory/client/messages/?id=${chatData.id}`
                              );
                              window.location.href = `https://rally.markets/firm/${chatData.firmslug}/advisor/${chatData.advisorslug}`;
                            }}
                          >
                            Advisor Profile
                          </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                          <ListItemButton
                            disableGutters
                            className={classes.actionButton}
                            onClick={() => {
                              history.pushState(
                                null,
                                null,
                                `/advisory/client/messages/?id=${chatData.id}`
                              );
                              window.location.href = `https://rally.markets/firm/${chatData.firmslug}`;
                            }}
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
                              navigate(`/client/payments/?id=${chatData.id}`, {
                                state: { backlink: !!backlink ? backlink : "" },
                              })
                            }
                            disabled={!!noChat}
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
