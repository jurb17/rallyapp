import { Box } from "@mui/material";
import dayjs from "dayjs";
import React from "react";
// import { MuiAudioInput } from "./MuiAudioInput";
// import { MuiFileInput } from "./MuiFileInput";
import { MuiMessage } from "./MuiMessage";
// CREATE ANOTHER COMPONENT FOR THE SYSTEM MESSAGES
// import { MuiMultiSelectInput } from "./MuiMultiSelectInput";
// import { MuiSelectInput } from "./MuiSelectInput";
// import { MuiTextInput } from "./MuiTextInput";
export function CustomMuiChat({ chatController, deleteChat, clientid }) {
  const chatCtl = chatController;
  const [messages, setMessages] = React.useState(chatCtl.getMessages());
  const [actReq, setActReq] = React.useState(chatCtl.getActionRequest());
  const msgRef = React.useRef(null);
  const scroll = React.useCallback(() => {
    if (msgRef.current) {
      msgRef.current.scrollTop = msgRef.current.scrollHeight; // msgRef.current.scrollIntoView(true);
    }
  }, [msgRef]);
  React.useEffect(() => {
    function handleMessagesChanged() {
      setMessages([...chatCtl.getMessages()]);
      if (!!chatCtl.getActionRequest().scroll) {
        scroll();
      }
    }

    function handleActionChanged() {
      setActReq(chatCtl.getActionRequest());
      if (!!chatCtl.getActionRequest().scroll) {
        scroll();
      }
    }

    chatCtl.addOnMessagesChanged(handleMessagesChanged);
    chatCtl.addOnActionChanged(handleActionChanged);
  }, [chatCtl, scroll]);

  const CustomComponent = React.useMemo(() => {
    if (!actReq || actReq.type !== "custom") {
      return null;
    }

    return actReq.Component;
  }, [actReq]);

  const unknownMsg = {
    type: "text",
    content: "Unknown message.",
    self: false,
  };
  let prevDate = dayjs(0);
  let prevTime = dayjs(0);

  return /*#__PURE__*/ React.createElement(
    Box,
    {
      sx: {
        height: "100%",
        width: "100%",
        p: 0,
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        "& > *": {
          maxWidth: "100%",
        },
        "& > * + *": {
          mt: 1,
        },
      },
    },
    /*#__PURE__*/ React.createElement(
      Box,
      {
        sx: {
          flex: "1 1 0%",
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          flexDirection: "column",
          "& > *": {
            maxWidth: "100%",
          },
        },
        ref: msgRef,
      },
      messages.map((msg) => {
        let showDate = false;
        let showTime = !!chatCtl.getOption().showDateTime;

        if (!!chatCtl.getOption().showDateTime && !msg.deletedAt) {
          const current = dayjs(msg.updatedAt ? msg.updatedAt : msg.createdAt);

          if (current.format("YYYYMMDD") !== prevDate.format("YYYYMMDD")) {
            showDate = true;
          }

          prevDate = current;

          if (current.diff(prevTime) < 60000) {
            showTime = false;
          } else {
            prevTime = current;
          }
        }

        if (msg.type === "text") {
          return /*#__PURE__*/ React.createElement(MuiMessage, {
            key: messages.indexOf(msg),
            id: `cu-msg-${messages.indexOf(msg) + 1}`,
            message: msg,
            showDate: showDate,
            showTime: showTime,
            chatController: chatCtl,
            deleteChat: deleteChat,
            clientid: clientid,
          });
        }

        if (msg.type === "jsx") {
          return /*#__PURE__*/ React.createElement(MuiMessage, {
            key: messages.indexOf(msg),
            id: `cu-msg-${messages.indexOf(msg) + 1}`,
            message: msg,
            showDate: false,
            showTime: showTime,
            chatController: chatCtl,
            deleteChat: deleteChat,
            clientid: clientid,
          });
        }

        return /*#__PURE__*/ React.createElement(MuiMessage, {
          key: messages.indexOf(msg),
          id: `cu-msg-${messages.indexOf(msg) + 1}`,
          message: unknownMsg,
          showDate: showDate,
          showTime: showTime,
          chatController: chatCtl,
          deleteChat: deleteChat,
          clientid: clientid,
        });
      })
    ),
    /*#__PURE__*/ React.createElement(
      Box,
      {
        sx: {
          flex: "0 1 auto",
          display: "flex",
          alignContent: "flex-end",
          "& > *": {
            minWidth: 0,
          },
        },
      },
      // actReq &&
      //   actReq.type === "text" &&
      //   /*#__PURE__*/ React.createElement(MuiTextInput, {
      //     chatController: chatCtl,
      //     actionRequest: actReq,
      //   }),
      // actReq &&
      //   actReq.type === "select" &&
      //   /*#__PURE__*/ React.createElement(MuiSelectInput, {
      //     chatController: chatCtl,
      //     actionRequest: actReq,
      //   }),
      // actReq &&
      //   actReq.type === "multi-select" &&
      //   /*#__PURE__*/ React.createElement(MuiMultiSelectInput, {
      //     chatController: chatCtl,
      //     actionRequest: actReq,
      //   }),
      // actReq &&
      //   actReq.type === "file" &&
      //   /*#__PURE__*/ React.createElement(MuiFileInput, {
      //     chatController: chatCtl,
      //     actionRequest: actReq,
      //   }),
      // actReq &&
      //   actReq.type === "audio" &&
      //   /*#__PURE__*/ React.createElement(MuiAudioInput, {
      //     chatController: chatCtl,
      //     actionRequest: actReq,
      //   }),
      actReq &&
        actReq.type === "custom" &&
        /*#__PURE__*/ React.createElement(CustomComponent, {
          chatController: chatCtl,
          actionRequest: actReq,
        })
    )
  );
}
