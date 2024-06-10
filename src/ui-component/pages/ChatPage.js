import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// third party libraries
import { useTheme } from "@material-ui/styles";
import { Box, Typography, Grid, useMediaQuery } from "@material-ui/core";
import * as chatui from "chat-ui-react";
import { IconRefresh, IconUser } from "@tabler/icons";

// local libraries
import CustomChatInput from "ui-component/chat/CustomChatInput";
import { CustomMuiChat } from "ui-component/chat/CustomMuiChat";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import { advisorMarksRead } from "actions/advisory";
import { clientMarksRead } from "actions/advice";
import DynamicButton from "ui-component/buttons/DynamicButton";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";

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
  const theme = useTheme();
  const navigate = useNavigate();
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  const matchDownLg = useMediaQuery(theme.breakpoints.down("lg"));
  const { attributes } = useSelector((state) => state.auth);

  // new chats from global state
  // NOT TO BE USED IN THE DEMO VERSION
  // const advice = useSelector((state) => state.advice);
  // const advisory = useSelector((state) => state.advisory);

  // chat states
  const [chatCtl] = React.useState(
    new chatui.ChatController({ showDateTime: true })
  );
  let parentChatMessages = [...props.currentMessages];

  console.log(
    "BEGINIING OF CHATPAGE - PARENT MESSAGES",
    parentChatMessages,
    props.clientid
  );

  // mode states
  const [scroll, setScroll] = React.useState(true);
  const [notSetup, setNotSetup] = React.useState(false);
  const [notConnected, setNotConnected] = React.useState(false);
  const [messageLimitReached, setMessageLimitReached] = React.useState(false);

  // update unix time to date time
  const updateTime = (time) => {
    const date = new Date(parseInt(time));
    const dateString = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    return date;
  };

  // FUNCTIONS TO UPDATE CHAT CONTROLLER ==================================================
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
  // updating the messages in the chat controller
  const updateControllerMessages = (messages, scroll) => {
    updateScroll(scroll);
    chatCtl.setMessages(messages);
  };
  // create list of message components given all message data. (super critical)
  const createControllerMessage = (message) => {
    // check if message is undefined
    if (!message) return false;
    else {
      if (message.advisor === -1) {
        return {
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
                  message.body.indexOf("$") !== -1 ? "contained" : "outlined"
                }
                onClick={async () => {
                  if (!!props.advisor) {
                    navigate(`/adv/invoices/${props.clientid}/${message.id}`, {
                      state: {
                        backlink: `/adv/messages/?id=${props.clientid}`,
                      },
                    });
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
          deletedAt: message.deletedAt ? message.deletedAt : null,
          username: Boolean(!!message.advisor !== !!props.advisor)
            ? props.contactname
            : "",
        };
      } else {
        return {
          type: "text",
          content: message.body,
          self: Boolean(!!message.advisor === !!props.advisor),
          id: message.id,
          clientid: props.clientid,
          token: props.token,
          createdAt: updateTime(message.timestamp),
          deletedAt: message.deletedAt ? message.deletedAt : null,
          username: Boolean(!!message.advisor !== !!props.advisor)
            ? props.contactname
            : "",
        };
      }
    }
  };

  // FUNCTIONS TO GET OTHER CHAT DATA ======================================================
  // find latest message from the client
  const getSelfAndContactMessages = (messages) => {};
  // retrieving previous messages from the backend.
  const requestChatBefore = async (messageid) => {};
  // get messages after a certain message.
  const requestChatSince = async (messageid) => {};

  // FUNCTIONS TO INITIALIZE CHAT DATA ===================================================
  // get messages from backend and display them in the chat.
  const intializeChatMessages = async (scroll) => {
    // create list of messages in controller format
    let controllerlist = [];
    for (const message of parentChatMessages) {
      let controllermessage = createControllerMessage(message);
      // if message is false, don't add it to the list.
      if (controllermessage) controllerlist.push(controllermessage);
    }
    // @@@ beware of this reverse function. Change if necessary.
    // list.reverse();
    updateScroll(scroll);
    chatCtl.setMessages(controllerlist);
  };
  // create prompt for user to complete account setup.
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
    updateControllerMessages([message], true);
  };
  // create chat controller DURING FIRST RENDER.
  React.useEffect(async () => {
    const custom = await chatCtl.setActionRequest({
      type: "custom",
      placeholder: "Enter message...",
      Component: CustomChatInput,
      always: true,
      scroll: scroll,
      onSubmit: sendNewMessage,
      clientid: props.clientid,
    });
    // if not a merchant or customer, show set up message instead of chat messages.
    if (attributes.MERCHANT === -1) showSetupMessage();
    // load initial messages from the server for client.
    if (attributes.CUSTOMER === -1) showSetupMessage();
    if (parentChatMessages) intializeChatMessages(true);
  }, [props.clientid]);

  // FUNCTIONS FOR USER ACTIONS ===========================================================
  // add show previous button to list of messages
  const addShowPreviousButton = (list) => {};
  // add show next button to list of messages
  const addShowNextButton = (list) => {};
  // delete a message from the chat
  const deleteChatScroll = async (messageid, id) => {
    // generate new timestamp
    let timestamp = Date.now();
    // remove message from chat controller (removeMessage() uses INDEX of message in list)
    chatCtl.removeMessage(messageid - 1);
    // remove message from state in parent component
    props.deleteChat(messageid, timestamp, id);
  };
  // post new message to the chat.
  const sendNewMessage = async (value, id) => {
    // if number of chat messages exceeds 20, stop adding messages.
    if (chatCtl.getMessages().length > 30) setMessageLimitReached(true);
    else {
      // generate new raw message
      let msgid = chatCtl.getMessages().length + 1; // msgid has to be an integer
      let timestamp = Date.now();
      let rawMessage = {
        id: msgid,
        advisor: props.advisor,
        body: value,
        timestamp: timestamp,
      };
      // generate new controller message
      let newControllerMessage = createControllerMessage(rawMessage);
      // add new message to the chat controller
      chatCtl.addMessage({ ...newControllerMessage });
      // send new message data back up to the index file.
      props.postChat(rawMessage, timestamp, id);
    }
  };

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

  // JSX CODE ==========================================================
  return (
    <>
      <ConfirmPrimaryModal
        open={messageLimitReached}
        heading="Chat Message Limit Reached"
        body="You have reached the limit for posting messages in this chat. Please refresh the page to clear the chat or select another chat from the list."
        action="Okay"
        handleConfirm={() => setMessageLimitReached(false)}
      />
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
          !matchDownLg
            ? [
                {
                  iconButton: true,
                  component: <IconRefresh />,
                  onClick: intializeChatMessages,
                },
              ]
            : [
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
                  onClick: intializeChatMessages,
                },
              ]
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
            clientid={props.clientid}
          />
        </Box>
      </SubsectionWrapper>
    </>
  );
};

export default ChatPage;
