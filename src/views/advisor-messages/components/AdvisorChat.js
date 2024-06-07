import React, { useMemo } from "react";
import { useDispatch } from "react-redux";

// mui
import { Box, Typography } from "@material-ui/core";

// local libraries
import advisoryService from "services/advisory.service";
import { showSnackbar } from "actions/main";
import ChatPage from "ui-component/pages/ChatPage";
import { advisorChatList } from "utils/advisor-dummy-data";

// ==========================================================
/* PROPS MAP
adviceid = string to identify the client
token = string to authenticate user participation in chat
notApproved = whether the advisor is approved to be using the chat feature
notMerchant = whether the advisor user is approved to be a merchant on the platform
noChat = whether a chat has been selected or not.
isClient = whether the current chat is with a client or a prospect
clientname = name of the client or prospect the advisor user is chatting with
adviceid = id of the advisor-client relationship
chatMessages = messages between the advisor and client
*/

const AdvisorChat = (props) => {
  const dispatch = useDispatch();

  // determine the chat message to be shared when there is no current chat selected.
  const noChatMessage = useMemo(() => {
    if (!!props.notApproved)
      return "Your account has not been approved yet. Please wait for the Rally team to review and approve your account. \nThank you.";
    else if (!!props.notMerchant)
      return "You do not have a merchant account. Please go to the Settings page and create a merchant account with Stripe.";
    else return "Please select a chat from the list to view chat messages.";
  }, [props.noChat, props.notApproved, props.notMerchant]);

  /* get messages since a given message.
  Could be used if user has asked for previous messages,
  then wants to go forward in the message history. 
  @@@ PROBABLY NOT USEFUL FOR THE DEMO VERSION. */
  const getChatSince = (messageid, cid, toke) => {};

  /* get certain number of messages before a given message.
  Could be used if there's a long chat history and too many messages to load,
  but the user wants to load previous messages. 
  @@@ PROBABLY NOT USEFUL FOR THE DEMO VERSION. */
  const getChatBefore = async (messageid, cid, toke) => {};

  /* gets chat messages.
  NEED TO REPLACE WITH DUMMY DATA */
  const getChat = async (cid, toke) => {};

  /* post new chat messages
  NEED TO ALLOW USER TO ENTER NEW MESSAGES AND SEE THEM SHOW UP IN THE CHAT. */
  const postChat = async (newmessage, adviceid) =>
    props.updateChatMessages(newmessage, adviceid);

  /* delete chat message
  NEED TO ALLOW USER TO DELETE CHAT MESSAGES AND HAVE SOME STATE SAVE EXISTING LIST. */
  const deleteChat = async (newmessage, adviceid) =>
    props.updateChatMessages(newmessage, adviceid);

  return (
    <>
      {!props.currentMessages.length ? (
        <Box className="horizontal-center" style={{ width: "100%" }}>
          <Typography variant="h5" sx={{ m: 6 }}>
            <em>{noChatMessage}</em>
          </Typography>
        </Box>
      ) : (
        <ChatPage
          clientid={props.adviceid}
          isClient={props.isClient}
          advisor={1}
          contactname={props.clientname}
          token={props.token}
          height={"73.5vh"}
          titleStyle={{
            fontSize: "1.25rem",
            lineHeight: "1.5rem",
          }}
          currentMessages={[...props.currentMessages]}
          postChat={postChat}
          deleteChat={deleteChat}
        />
      )}
    </>
  );
};

export default AdvisorChat;
