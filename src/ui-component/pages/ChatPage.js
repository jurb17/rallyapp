import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// third party libraries
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  Button,
  Typography,
  Grid,
  useMediaQuery,
} from "@material-ui/core";
import * as chatui from "chat-ui-react";
import { IconMessageOff, IconRefresh, IconUser } from "@tabler/icons";

// local libraries
import CustomChatInput from "ui-component/chat/CustomChatInput";
import { CustomMuiChat } from "ui-component/chat/CustomMuiChat";
import config from "config";
import { showSnackbar } from "actions/main";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import { advisorMarksRead } from "actions/advisory";
import { clientMarksRead } from "actions/advice";
import DynamicButton from "ui-component/buttons/DynamicButton";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ==========================================================
/* PROPS MAP
clientid = string of id representing the relatipnship between client and advisor (clientid or adviceid)
advisor = integer to determine how messages display to the user (1 for advisor, 0 for client)
contactname = string of name of the client (for advisor) or advisor (for client)
token = string of token for the user
height = string for height of the chat window
getChatSince = function to get the chat since a certain message
getChatBefore = function to get the chat before a certain message
getChat = function to get the chat message list
postChat = function to post a chat message
deleteChat = function to delete a chat message
*/

const ChatPage = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));
  const { attributes } = useSelector((state) => state.auth);

  // new chats from global state
  const advice = useSelector((state) => state.advice);
  const advisory = useSelector((state) => state.advisory);

  // chat states
  const [chatCtl] = React.useState(
    new chatui.ChatController({ showDateTime: true })
  );
  const [earliestMessage, setEarliestMessage] = React.useState({});
  const [latestMessage, setLatestMessage] = React.useState({});
  const [numMessages, setNumMessages] = React.useState(0);

  // mode states
  const [scroll, setScroll] = React.useState(true);
  const [notSetup, setNotSetup] = React.useState(false);
  const [notConnected, setNotConnected] = React.useState(false);

  // FUNCTIONS TO ADD/DELETE/UPDATE CHAT DATA ==========================================================

  // update unix time to date time
  const updateTime = (time) => {
    const date = new Date(parseInt(time));
    const dateString = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return date;
  };
  // update the scroll of the chat window.
  const updateScroll = async (scroll) => {
    return new Promise((resolve, reject) => {
      setScroll(scroll);
      chatCtl
        .setActionRequest({
          ...chatCtl.getActionRequest(),
          scroll: scroll,
        })
        .then(() => {
          resolve();
        });
    });
  };
  // setting the messages in the chat
  const updateMessages = (messages, scroll) => {
    if (
      messages.length !== numMessages ||
      messages[messages.length - 1].id !== latestMessage.id
    ) {
      return new Promise((resolve, reject) => {
        updateScroll(scroll).then(() => {
          chatCtl.setMessages(messages);
          // set the number of messages in this chat.
          setNumMessages(messages.length);
          // set the earliest message and last message states.
          if (messages.length > 0) {
            setEarliestMessage(messages[0]);
            setLatestMessage(messages[messages.length - 1]);
          } else {
            setEarliestMessage({});
            setLatestMessage({});
          }
          resolve();
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve();
      });
    }
  };
  // add show previous button to list of messages
  const addShowPreviousButton = (list) => {
    if (list.length !== config.maxServerChatMessages - 1) {
      return list;
    } else {
      const newList = [
        ...list,
        {
          type: "jsx",
          content: (
            <Button
              onClick={async () => {
                requestChatBefore(list[list.length - 1].id); // TEST THIS
              }}
            >
              <Typography variant="body1">Show Previous Messages</Typography>
            </Button>
          ),
          self: false,
        },
      ];
      return newList;
    }
  };
  // add show next button to list of messages
  const addShowNextButton = (list) => {
    const newList = [
      ...list,
      {
        type: "jsx",
        content: (
          <Button
            onClick={async () => {
              requestChatSince(list[list.length - 1].id); // TEST THIS
            }}
          >
            <Typography variant="body1">Show Next Messages</Typography>
          </Button>
        ),
        self: false,
      },
    ];
    return newList;
  };
  // add messages in controller format to the chat.
  const addControllerMessages = (messages) => {
    return new Promise((resolve, reject) => {
      updateScroll(false).then(() => {
        messages.forEach((message) => {
          chatCtl.addMessage({ ...message });
        });
      });
      resolve();
    });
  };
  // add messages in server format to the chat.
  const addServerMessages = (messages) => {
    return new Promise((resolve, reject) => {
      updateScroll(false).then(() => {
        messages.forEach((message) => {
          chatCtl.addMessage({
            type: "text",
            content: message.body,
            self: Boolean(!!message.advisor === !!props.advisor),
            id: message.id,
            clientid: props.clientid,
            token: props.token,
            createdAt: updateTime(message.timestamp),
            username: Boolean(!!message.advisor !== !!props.advisor)
              ? props.contactname
              : "",
          });
        });
      });
      resolve();
    });
  };
  // delete a message from the chat and then reload without scrolling.
  const deleteChatNoScroll = async (messageid) => {
    props
      .deleteChat(messageid, props.clientid, props.token)
      .then(async (response) => {
        let messages = chatCtl.getMessages();
        let before = [];
        let after = [];
        messages.forEach((message) => {
          let m1 = messageid.replace("-", "");
          let m2 = message.id.replace("-", "");
          if (m1 === m2) {
            after = messages.slice(messages.indexOf(message) + 1);
            before = messages.slice(0, messages.indexOf(message));
          }
        });
        before.reverse();
        before = addShowPreviousButton(before);
        before.reverse();

        updateScroll(true).then(() => {
          updateMessages(before, true).then(() => {
            updateScroll(false).then(() => {
              addControllerMessages(after);
            });
          });
        });
      })
      .catch((error) => {
        dispatch(showSnackbar("Error deleting message.", true, "error"));
        console.log("error", error);
      });
  };
  // delete a message from the chat and then reload.
  const deleteChatScroll = async (messageid) => {
    props
      .deleteChat(messageid, props.clientid, props.token)
      .then(() => {
        showServerMessages(true);
      })
      .catch((error) => {
        dispatch(showSnackbar("Error deleting message.", true, "error"));
        console.log("uncaught error", error);
      });
  };
  // post new message to the chat.
  const sendNewMessage = async (value) => {
    if (
      (!!props.advisor && attributes.MERCHANT === -1) ||
      (!props.advisor && attributes.CUSTOMER === -1)
    ) {
      setNotSetup(true);
      return;
    } else if (!!props.disconnected) {
      setNotConnected(true);
      return;
    } else {
      props
        .postChat(props.clientid, props.token, value)
        .then((response) => {
          if (!!response.data.payload.success) {
            showServerMessages(true);
            // updateScroll(true).then(() => {
            //   chatCtl.addMessage({
            //     type: "text",
            //     content: value,
            //     self: true,
            //     id: response.data.payload.chat.id,
            //     clientid: props.clientid,
            //     token: props.token,
            //     createdAt: new Date(),
            //   });
            //   setNumMessages(numMessages + 1);
            // });
          } else {
            dispatch(showSnackbar("Error sending message.", true, "error"));
          }
        })
        .catch((error) => {
          dispatch(
            showSnackbar(
              "Could not send message. Please try again later.",
              true,
              "error"
            )
          );
          console.log("error", error);
        });
    }
  };

  // FUNCTIONS TO GATHER/REQUEST CHAT DATA ======================================================

  // find latest message from the client
  const getSelfAndContactMessages = (messages) => {
    let selfmessages = [];
    let contactmessages = [];
    messages.forEach((message) => {
      if (!message.self) {
        contactmessages.push(message);
      } else {
        selfmessages.push(message);
      }
    });
    return {
      contactmessages: [...contactmessages],
      selfmessages: [...selfmessages],
    };
  };
  // retrieving previous messages from the backend.
  const requestChatBefore = async (messageid) => {
    let currentMessages = chatCtl.getMessages();
    props
      .getChatBefore(messageid, props.clientid, props.token)
      .then(async (response) => {
        let responseMessages = response.data.payload.messages;
        // if there are no messages before the earliest, then we need to remove the show previous button.
        if (!responseMessages) {
          currentMessages = currentMessages.slice(1);
          updateMessages(currentMessages, false);
          dispatch(showSnackbar("No previous messages.", true, "info"));
        } else {
          // create list of messages in controller format
          createControllerList(responseMessages).then((list) => {
            list = addShowPreviousButton(list); // REMOVE THIS FOR THE CODE BELOW WHEN YOU CAN SAVE THE EARLIEST MESSAGE STATE EFFECTIVELY
            // if (
            //   responseMessages[responseMessages.length - 1].id !==
            //   earliestMessage.id
            // ) {
            //   list = addShowPreviousButton(list);
            // }
            list.reverse();
            list = addShowNextButton(list);
            updateMessages(list, true);
          });
        }
      })
      .catch((error) => {
        dispatch(
          showSnackbar("Error getting previous messages.", true, "error")
        );
        console.log("error", error);
      });
  };
  // get messages after a certain message.
  const requestChatSince = async (messageid) => {
    let currentMessages = chatCtl.getMessages();
    props
      .getChatSince(messageid, props.clientid, props.token)
      .then((response) => {
        let responseMessages = response.data.payload.messages;
        // if there are no messages after the latest, then we need to remove the show next button.
        if (!responseMessages) {
          currentMessages = currentMessages.slice(0, -1);
          dispatch(showSnackbar("No additional messages.", true, "info"));
          updateMessages(currentMessages, true);
        }
        // if there are less than 99 messages, then we can just get the latest server messages.
        else if (responseMessages.length < config.maxServerChatMessages - 2) {
          showServerMessages(false);
        } else {
          // create list of messages in controller format
          createControllerList(responseMessages).then((list) => {
            list = addShowPreviousButton(list);
            list.reverse();
            list = addShowNextButton(list); // REMOVE THIS FOR THE CODE BELOW WHEN YOU CAN SAVE THE LATEST MESSAGE STATE EFFECTIVELY
            // if (responseMessages[0].id !== latestSelfMessage.id) {
            //   list = addShowNextButton(list);
            // }
            updateMessages(list, false);
          });
        }
      })
      .catch((error) => {
        dispatch(
          showSnackbar("Error getting additional messages.", true, "error")
        );
        console.log("error", error);
      });
  };

  // FUNCTIONS TO ORGANIZE/SHOW MESSAGES ===================================================

  // create list of server messages
  const createControllerList = (messages) => {
    return new Promise((resolve, reject) => {
      let list = [];
      if (!!messages) {
        messages.forEach((message) => {
          if (message.advisor === -1) {
            list.push({
              system: true,
              type: "jsx",
              content: (
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ mr: 0 }}>
                    <Grid item>
                      <Typography
                        variant="body1"
                        fontStyle="italic"
                        fontWeight={"bold"}
                      >
                        Payment Request
                      </Typography>
                    </Grid>
                    <Grid item>
                      <Typography variant="body1">
                        {message.body.indexOf("$") !== -1
                          ? "Status: open, $" +
                            parseFloat(
                              message.body.slice(message.body.indexOf("$") + 1)
                            ).toFixed(2)
                          : "Status: " + message.body}
                      </Typography>
                    </Grid>
                  </Box>
                  <DynamicButton
                    name="View"
                    color="secondary"
                    variant={
                      message.body.indexOf("$") !== -1
                        ? "contained"
                        : "outlined"
                    }
                    onClick={async () => {
                      if (!!props.advisor) {
                        navigate(
                          `/adv/invoices/${props.clientid}/${message.id}`,
                          {
                            state: {
                              backlink: `/adv/messages/?id=${props.clientid}`,
                            },
                          }
                        );
                      } else {
                        navigate(
                          `/client/payments/${props.clientid}/${message.id}`,
                          {
                            state: {
                              backlink: `/client/messages/?id=${props.clientid}`,
                            },
                          }
                        );
                      }
                    }}
                  ></DynamicButton>
                </Box>
              ),
              self: Boolean(!!message.advisor === !!props.advisor),
              id: message.id,
              clientid: props.clientid,
              token: props.token,
              createdAt: updateTime(message.timestamp),
              username: Boolean(!!message.advisor !== !!props.advisor)
                ? props.contactname
                : "",
            });
          } else {
            list.push({
              type: "text",
              content: message.body,
              self: Boolean(!!message.advisor === !!props.advisor),
              id: message.id,
              clientid: props.clientid,
              token: props.token,
              createdAt: updateTime(message.timestamp),
              username: Boolean(!!message.advisor !== !!props.advisor)
                ? props.contactname
                : "",
            });
          }
        });
      } else {
        resolve(list);
      }
      resolve(list);
    });
  };

  // get messages from backend and display them in the chat.
  const showServerMessages = async (scroll) => {
    props
      .getChat(props.clientid, props.token)
      .then((response) => {
        // remove this advice id from the unread advice list.
        if (!!props.advisor) {
          dispatch(advisorMarksRead(props.clientid));
        } else {
          dispatch(clientMarksRead(props.clientid));
        }
        let serverMessages = response.data.payload.messages;
        // create list of messages in controller format
        createControllerList(serverMessages).then((list) => {
          const { contactmessages, selfmessages } =
            getSelfAndContactMessages(list);
          // add show previous button to the list.
          list = addShowPreviousButton(list);
          list.reverse();
          // update the messages in the chat.
          updateMessages(list, scroll);
        });
      })
      .catch((error) => {
        dispatch(
          showSnackbar("Could not retrieve messages from server", true, "error")
        );
        console.log("error", error);
      });
  };
  // prompt user to complete account setup.
  const showSetupMessage = () => {
    const message = {
      type: "text",
      system: true,
      content:
        "Your account setup is incomplete. Chat messages are not available until you complete your account setup.",
      self: false,
      id: 1,
      clientid: props.clientid,
      token: props.token,
      createdAt: updateTime(new Date().getTime()),
      username: "",
    };
    updateMessages([message], true);
  };

  // INITIAL CONFIGURATION OF CHAT CONTROLLER MESSAGES ==========================================================

  // create chat controller DURING FIRST RENDER.
  React.useMemo(async () => {
    const custom = await chatCtl.setActionRequest({
      type: "custom",
      placeholder: "Enter message...",
      Component: CustomChatInput,
      always: true,
      scroll: scroll,
      onSubmit: sendNewMessage,
    });
    // load initial messages from the server for advisor.
    if (!!props.advisor && !advisory.unreadchats[props.clientid]) {
      if (attributes.MERCHANT === -1) {
        showSetupMessage();
      } else {
        showServerMessages(true);
      }
    }
    // load initial messages from the server for client.
    if (!props.advisor && !advice.unreadchats[props.clientid]) {
      if (attributes.CUSTOMER === -1) {
        showSetupMessage();
      } else {
        showServerMessages(true);
      }
    }
  }, [chatCtl, props.clientid]);

  // check for new messages AFTER RENDERING.
  React.useEffect(() => {
    // if user is an advisor and there are unread ADVISORY messages, reload chat.
    if (!!props.advisor && !!advisory.unreadchats[props.clientid]) {
      showServerMessages(true);
    }
    // if user is a client and there are unread ADVICE messages, reload chat.
    if (!props.advisor && !!advice.unreadchats[props.clientid]) {
      showServerMessages(true);
    }
  }, [advisory.unreadchats, advice.unreadchats, props.clientid]);

  // FUNCTIONS FOR BUTTONS ==========================================================
  // navigate to the advisor profile on the public website.
  const navigateAdvisor = () => {
    history.pushState(
      null,
      null,
      `/advisory/client/messages/?id=${props.clientid}`
    );
    window.location.href = `https://rally.markets/firm/${props.firmslug}/advisor/${props.advisorslug}`;
  };

  // reconnect the relationship between the client and the advisor.
  const reconnectAdvisor = () => {
    props.reconnectChat(props.clientid).then(() => {
      setTimeout(() => {
        window.location.reload(false);
      }, 1000);
    });
  };

  // JSX CODE ==========================================================
  return (
    <>
      <ConfirmPrimaryModal
        open={notSetup}
        heading="Please Complete Account Setup"
        body="Chat messages will not be sent until you complete your account setup with Stripe. Please click 'Continue' below to complete this process."
        action="Continue"
        handleCancel={() => setNotSetup(false)}
        handleConfirm={() => navigate("/client/settings")}
        nonaction="Later"
      />
      <ConfirmPrimaryModal
        open={notConnected}
        heading="Chat Has Been Disconnected"
        body='The advisor was not able to meet your request at this time. You may reconnect with this advisor by selecting the "Reconnect" button. Yet, the firm may deny your request.'
        action="OK"
        handleConfirm={() => setNotConnected(false)}
      />
      <SubsectionWrapper
        mb={1}
        title={props.contactname}
        titleStyle={props.titleStyle}
        tipBody="Please review our platform guidelines regarding the appropriate
        use of the chat feature. Messages can be deleted by selecting the
        vertical triple dot icon next to a message. Selecting the Refresh button
        will also ensure you are seeing the latest messages."
        backButton={!!matchDownSm}
        buttonlist={
          !matchDownLg && !props?.disconnected
            ? [
                {
                  iconButton: true,
                  component: <IconRefresh />,
                  onClick: showServerMessages,
                },
              ]
            : !matchDownLg && !!props?.disconnected
            ? [
                {
                  iconButton: true,
                  component: <IconMessageOff color="red" />,
                  onClick: () => setNotConnected(true),
                },
                {
                  name: "Reconnect",
                  color: "primary",
                  variant: "outlined",
                  onClick: () => reconnectAdvisor(),
                },
              ]
            : !!matchDownLg && !props?.disconnected
            ? [
                {
                  iconButton: true,
                  component: <IconUser />,
                  onClick: () =>
                    !props.advisor
                      ? navigateAdvisor()
                      : !!props.isClient
                      ? navigate(`/adv/clients/${props.clientid}`)
                      : navigate(`/adv/prospects/${props.clientid}`),
                },
                {
                  iconButton: true,
                  component: <IconRefresh />,
                  onClick: showServerMessages,
                },
              ]
            : !!matchDownLg && !!props?.disconnected
            ? [
                {
                  iconButton: true,
                  component: <IconUser />,
                  onClick: () =>
                    !props.advisor
                      ? navigateAdvisor()
                      : !!props.isClient
                      ? navigate(`/adv/clients/${props.clientid}`)
                      : navigate(`/adv/prospects/${props.clientid}`),
                },
                {
                  iconButton: true,
                  component: <IconMessageOff color="red" />,
                  onClick: () => setNotConnected(true),
                },
                {
                  name: "Reconnect",
                  color: "primary",
                  variant: "outlined",
                  onClick: () => reconnectAdvisor(),
                },
              ]
            : []
        }
      >
        <Box
          sx={{
            height: props.height,
            overflowX: "hidden",
            borderTop: `1px solid ${theme.palette.grey[200]}`,
          }}
        >
          <CustomMuiChat
            chatController={chatCtl}
            deleteChat={deleteChatScroll}
          />
        </Box>
      </SubsectionWrapper>
    </>
  );
};

export default ChatPage;
