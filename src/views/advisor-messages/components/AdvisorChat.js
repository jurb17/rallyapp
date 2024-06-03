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
*/

const AdvisorChat = (props) => {
  const dispatch = useDispatch();

  const [noChatMessage, setNoChatMessage] = React.useState("");

  /* get messages since a given message.
  Could be used if user has asked for previous messages,
  then wants to go forward in the message history. 
  @@@ PROBABLY NOT USEFUL FOR THE DEMO VERSION. */
  const getChatSince = (messageid, cid, toke) => {
    return new Promise((resolve, reject) => {
      console.log("getChatSince, AdvisorChat.js");
      advisoryService
        .getChatSince({
          clientid: cid,
          token: toke,
          msgid: messageid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            reject(response.data.details.text);
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
        });
    });
  };
  /* get certain number of messages before a given message.
  Could be used if there's a long chat history and too many messages to load,
  but the user wants to load previous messages. 
  @@@ PROBABLY NOT USEFUL FOR THE DEMO VERSION. */
  const getChatBefore = async (messageid, cid, toke) => {
    console.log("getChatBefore, AdvisorChat.js");
    return new Promise((resolve, reject) => {
      advisoryService
        .getChatBefore({
          clientid: cid,
          token: toke,
          msgid: messageid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            reject(response.data.details.text);
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
        });
    });
  };
  /* gets chat messages.
  NEED TO REPLACE WITH DUMMY DATA */
  const getChat = async (cid, toke) => {
    console.log("getChat, AdvisorChat.js");
    return advisorChatList[cid].messages;
    return new Promise((resolve, reject) => {
      advisoryService
        .getChat({ clientid: cid, token: toke })
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            reject(response.data.details.text);
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
        });
    });
  };
  /* post new chat messages
  NEED TO ALLOW USER TO ENTER NEW MESSAGES AND SEE THEM SHOW UP IN THE CHAT. */
  const postChat = async (cid, toke, content) => {
    console.log("postChat, AdvisorChat.js");
    return new Promise((resolve, reject) => {
      advisoryService
        .postChat({
          clientid: cid,
          token: toke,
          text: content,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            reject(response.data.details.text);
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
        });
    });
  };
  /* delete chat message
  NEED TO ALLOW USER TO DELETE CHAT MESSAGES AND HAVE SOME STATE SAVE EXISTING LIST. */
  const deleteChat = async (msgid, cid, toke) => {
    console.log("deleteChat, AdvisorChat.js");
    return new Promise((resolve, reject) => {
      advisoryService
        .deleteChat({
          clientid: cid,
          token: toke,
          msgid: msgid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response);
            dispatch(
              showSnackbar("Message deleted successfully", true, "success")
            );
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            console.log("caught error", response.data.details.text);
            reject(response.data.details.text);
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
        });
    });
  };

  useMemo(() => {
    if (!!props.notApproved) {
      setNoChatMessage(
        "Your account has not been approved yet. Please wait for the Rally team to review and approve your account. \nThank you."
      );
    } else if (!!props.notMerchant) {
      setNoChatMessage(
        "You do not have a merchant account. Please go to the Settings page and create a merchant account with Stripe."
      );
    } else {
      setNoChatMessage(
        "Please select a chat from the list to view chat messages."
      );
    }
  }, [props.noChat, props.notApproved, props.notMerchant]);

  return (
    <>
      {!!props.noChat ? (
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
          getChatSince={getChatSince}
          getChatBefore={getChatBefore}
          // getChat={getChat}
          chatMessages={props.chatMessages}
          postChat={postChat}
          deleteChat={deleteChat}
        />
      )}
    </>
  );
};

export default AdvisorChat;
