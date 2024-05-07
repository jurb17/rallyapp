import React, { useMemo } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

// mui
import { Box, Typography } from "@material-ui/core";

// local libraries
import advisoryService from "services/advisory.service";
import { showSnackbar } from "actions/main";
import ChatPage from "ui-component/pages/ChatPage";

// ==========================================================
/* PROPS MAP
adviceid = string to identify the client
token = string to authenticate user participation in chat
*/

const AdvisorChat = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [noChatMessage, setNoChatMessage] = React.useState("");

  // getChatSince
  const getChatSince = (messageid, cid, toke) => {
    return new Promise((resolve, reject) => {
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
  // getChatBefore
  const getChatBefore = async (messageid, cid, toke) => {
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
  // getChat
  const getChat = async (cid, toke) => {
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
  // postChat
  const postChat = async (cid, toke, content) => {
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
  // deleteChat
  const deleteChat = async (msgid, cid, toke) => {
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
          getChat={getChat}
          postChat={postChat}
          deleteChat={deleteChat}
        />
      )}
    </>
  );
};

export default AdvisorChat;
