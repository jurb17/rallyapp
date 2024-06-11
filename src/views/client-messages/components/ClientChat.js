import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// mui
import { Box, Typography } from "@material-ui/core";

// local libraries
import ChatPage from "ui-component/pages/ChatPage";

// ==========================================================
/* PROPS MAP
adviceid = string to identify the client
token = string to authenticate user participation in chat
firmslug = string of the firm's url slug
advisorslug = string of the advisor's url slug
advisorname = name of the advisor that the client user is chatting with 
currentMessages = messages between the advisor and client
postChatMessage = function passed to update the state when a new message is posted
deleteChatMessage = function passed to update state when a message is deleted
*/

const ClientChat = (props) => {
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

  /* gets chat messages. */
  const getChat = async (cid, toke) => {};

  /* post new chat messages */
  const postChat = async (newmessage, timestamp, adviceid) =>
    props.postChatMessage(newmessage, timestamp, adviceid);

  /* delete chat message */
  const deleteChat = async (messageid, timestamp, adviceid) =>
    props.deleteChatMessage(messageid, timestamp, adviceid);

  // reconnectChat
  const reconnectChat = async (cid) => {};

  return (
    <>
      {!props.currentMessages.length ? (
        <Box className="horizontal-center" mt={5} style={{ width: "100%" }}>
          <Typography variant="h5" margin={1}>
            <em>Please select a chat from the list to view chat messages.</em>
          </Typography>
        </Box>
      ) : (
        <ChatPage
          clientid={props.adviceid}
          firmslug={props.firmslug}
          advisorslug={props.advisorslug}
          advisor={0}
          contactname={props.advisorname}
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

export default ClientChat;
