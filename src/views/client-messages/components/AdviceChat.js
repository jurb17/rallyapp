import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// mui
import { Box, Typography } from "@material-ui/core";

// local libraries
import adviceService from "services/advice.service";
import { showSnackbar } from "actions/main";
import ChatPage from "ui-component/pages/ChatPage";

// ==========================================================
/* PROPS MAP
adviceid = string to identify the client
token = string to authenticate user participation in chat
*/

const AdviceChat = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getChatSince = (messageid, cid, toke) => {
    return new Promise((resolve, reject) => {
      adviceService
        .getChatSince({
          adviceid: cid,
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
  // getChatBefore
  const getChatBefore = async (messageid, cid, toke) => {
    return new Promise((resolve, reject) => {
      adviceService
        .getChatBefore({
          adviceid: cid,
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
  // getChat
  const getChat = async (cid, toke) => {
    return new Promise((resolve, reject) => {
      adviceService
        .getChat({ adviceid: cid, token: toke })
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
  // postChat
  const postChat = async (cid, toke, content) => {
    return new Promise((resolve, reject) => {
      adviceService
        .postChat({
          adviceid: cid,
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
  // deleteChat
  const deleteChat = async (msgid, cid, toke) => {
    return new Promise((resolve, reject) => {
      adviceService
        .deleteChat({
          adviceid: cid,
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
  // reconnectChat
  const reconnectChat = async (cid) => {
    return new Promise((resolve, reject) => {
      adviceService
        .reconnect({
          adviceid: cid,
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            resolve(response);
            dispatch(
              showSnackbar("Chat reconnected successfully.", true, "success")
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

  return (
    <>
      {!!props.noChat ? (
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
          disconnected={props.disconnected}
          advisor={0}
          contactname={props.clientname}
          token={props.token}
          height={"73.5vh"}
          titleStyle={{
            fontSize: "1.25rem",
            lineHeight: "1.5rem",
          }}
          getChatSince={getChatSince}
          getChatBefore={getChatBefore}
          getChat={getChat}
          postChat={postChat}
          deleteChat={deleteChat}
          reconnectChat={reconnectChat}
        />
      )}
    </>
  );
};

export default AdviceChat;
