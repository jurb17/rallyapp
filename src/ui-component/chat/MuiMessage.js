import React from "react";
import { useDispatch } from "react-redux";

// mui imports
import { useTheme } from "@material-ui/styles";
import {
  Avatar,
  Box,
  Grow,
  Typography,
  Divider,
  useMediaQuery,
} from "@mui/material";

// local imports
import BasicMenuIconButton from "ui-component/extended/BasicMenuIconButton";
import { showSnackbar } from "actions/main";
import { stringAvatar } from "utils/chat-avatar";

export function MuiMessage({
  id,
  message,
  showDate,
  showTime,
  chatController,
  deleteChat,
  clientid,
}) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const chatCtl = chatController;
  const matchDownSm = useMediaQuery(theme.breakpoints.down("sm"));
  if (message.deletedAt) {
    return /*#__PURE__*/ React.createElement("div", {
      id: id,
    });
  }

  const dispDate = message.updatedAt ? message.updatedAt : message.createdAt;
  const ChatAvator = /*#__PURE__*/ React.createElement(
    Box,
    {
      minWidth: 0,
      flexShrink: 0,
      mr: 1,
    },
    /*#__PURE__*/ React.createElement(Avatar, {
      ...stringAvatar(message.username ? String(message.username) : ""),
    })
  );
  const ChatSettings = /*#__PURE__*/ React.createElement(
    Box,
    {
      minWidth: 0,
      flexShrink: 0,
    },
    !message.system &&
      /*#__PURE__*/ React.createElement(BasicMenuIconButton, {
        color: "inherit",
        size: "small",
        disableRipple: true,
        items: !message.system
          ? [
              {
                id: "delete",
                name: "Delete",
                onClick: () => {
                  deleteChat(message.id, clientid);
                },
              },
            ]
          : [],
      })
  );
  const ChatUsername = /*#__PURE__*/ React.createElement(
    Box,
    {
      maxWidth: "100%",
      mx: 1,
    },
    /*#__PURE__*/ React.createElement(
      Typography,
      {
        variant: "body2",
        align: message.self ? "right" : "left",
      }
      // message.username
    )
  );
  const ChatDate = /*#__PURE__*/ React.createElement(
    Box,
    {
      maxWidth: "100%",
      mx: 1,
    },
    /*#__PURE__*/ React.createElement(
      Typography,
      {
        variant: "body2",
        weight: "bold",
        align: message.self ? "right" : "left",
        color: "textSecondary",
      },
      dispDate === null || dispDate === void 0
        ? void 0
        : dispDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
    )
  );
  return /*#__PURE__*/ React.createElement(
    Grow,
    {
      in: true,
    },
    /*#__PURE__*/ React.createElement(
      Box,
      {
        maxWidth: "100%",
        display: "flex",
        flexDirection: "column",
        marginBottom: 0,
      },
      showDate &&
        /*#__PURE__*/ React.createElement(
          Divider,
          {
            alignitems: "center",
            justifycontent: "center",
          },
          /*#__PURE__*/ React.createElement(
            Typography,
            {
              variant: "body2",
              align: message.self ? "right" : "left",
              lineHeight: "0",
              paddingTop: 2,
            },
            dispDate === null || dispDate === void 0
              ? void 0
              : dispDate.toLocaleDateString()
          )
        ),
      /*#__PURE__*/ React.createElement(
        Box,
        {
          id: id,
          maxWidth: "100%",
          mt: 2,
          mb: 0,
          mx: matchDownSm ? 0.5 : 1,
          pl: message.self && !matchDownSm ? "20%" : "4px",
          pr: message.self || matchDownSm ? 0 : "20%",
          display: "flex",
          justifyContent: message.self ? "flex-end" : "flex-start",
          style: {
            overflowWrap: "break-word",
          },
        },
        message.avatar && !message.self && !message.system && ChatAvator,
        !message.self && !message.system && ChatAvator,
        /*#__PURE__*/ React.createElement(
          Box,
          {
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
          },
          message.username && ChatUsername,
          /*#__PURE__*/ React.createElement(
            Box,
            {
              maxWidth: "100%",
              py: 1,
              px: 2,
              bgcolor: message.self ? "primary.main" : "background.paper",
              color: message.self ? "primary.contrastText" : "text.primary",
              borderRadius: 4,
              boxShadow: 2,
            },
            message.type === "text" &&
              /*#__PURE__*/ React.createElement(
                Typography,
                {
                  variant: "body1",
                  style: {
                    whiteSpace: "pre-wrap",
                  },
                },
                message.content
              ),
            message.type === "jsx" &&
              /*#__PURE__*/ React.createElement("div", null, message.content)
          ),
          showTime && ChatDate
        ),
        message.avatar && message.self && !message.system && ChatAvator,
        message.self && ChatSettings
      )
    )
  );
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9tdWkvTXVpTWVzc2FnZS50c3giXSwibmFtZXMiOlsiQXZhdGFyIiwiQm94IiwiR3JvdyIsIlR5cG9ncmFwaHkiLCJSZWFjdCIsIk11aU1lc3NhZ2UiLCJpZCIsIm1lc3NhZ2UiLCJzaG93RGF0ZSIsInNob3dUaW1lIiwiZGVsZXRlZEF0IiwiZGlzcERhdGUiLCJ1cGRhdGVkQXQiLCJjcmVhdGVkQXQiLCJDaGF0QXZhdG9yIiwic2VsZiIsInVzZXJuYW1lIiwiYXZhdGFyIiwiQ2hhdFVzZXJuYW1lIiwiQ2hhdERhdGUiLCJ0b0xvY2FsZVRpbWVTdHJpbmciLCJob3VyIiwibWludXRlIiwidG9Mb2NhbGVEYXRlU3RyaW5nIiwib3ZlcmZsb3dXcmFwIiwidHlwZSIsIndoaXRlU3BhY2UiLCJjb250ZW50Il0sIm1hcHBpbmdzIjoiQUFBQSxTQUFTQSxNQUFULEVBQWlCQyxHQUFqQixFQUFzQkMsSUFBdEIsRUFBNEJDLFVBQTVCLFFBQThDLGVBQTlDO0FBQ0EsT0FBT0MsS0FBUCxNQUFrQixPQUFsQjtBQUlBLE9BQU8sU0FBU0MsVUFBVCxDQUFvQjtBQUN6QkMsRUFBQUEsRUFEeUI7QUFFekJDLEVBQUFBLE9BRnlCO0FBR3pCQyxFQUFBQSxRQUh5QjtBQUl6QkMsRUFBQUE7QUFKeUIsQ0FBcEIsRUFVZ0I7QUFDckIsTUFBSUYsT0FBTyxDQUFDRyxTQUFaLEVBQXVCO0FBQ3JCLHdCQUFPO0FBQUssTUFBQSxFQUFFLEVBQUVKO0FBQVQsTUFBUDtBQUNEOztBQUVELFFBQU1LLFFBQVEsR0FBR0osT0FBTyxDQUFDSyxTQUFSLEdBQW9CTCxPQUFPLENBQUNLLFNBQTVCLEdBQXdDTCxPQUFPLENBQUNNLFNBQWpFO0FBRUEsUUFBTUMsVUFBVSxnQkFDZCxvQkFBQyxHQUFEO0FBQ0UsSUFBQSxRQUFRLEVBQUUsQ0FEWjtBQUVFLElBQUEsVUFBVSxFQUFFLENBRmQ7QUFHRSxJQUFBLEVBQUUsRUFBRVAsT0FBTyxDQUFDUSxJQUFSLEdBQWUsQ0FBZixH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YixLQVNHUixPQUFPLENBQUNrQixJQUFSLEtBQWlCLE1BQWpCLGlCQUNDLG9CQUFDLFVBQUQ7QUFBWSxJQUFBLE9BQU8sRUFBQyxPQUFwQjtBQUE0QixJQUFBLEtBQUssRUFBRTtBQUFFQyxNQUFBQSxVQUFVLEVBQUU7QUFBZDtBQUFuQyxLQUNHbkIsT0FBTyxDQUFDb0IsT0FEWCxDQVZKLEVBY0dwQixPQUFPLENBQUNrQixJQUFSLEtBQWlCLEtBQWpCLGlCQUEwQixpQ0FBTWxCLE9BQU8sQ0FBQ29CLE9BQWQsQ0FkN0IsQ0FGRixFQWtCR2xCLFFBQVEsSUFBSVUsUUFsQmYsQ0FYRixFQStCR1osT0FBTyxDQUFDVSxNQUFSLElBQWtCVixPQUFPLENBQUNRLElBQTFCLElBQWtDRCxVQS9CckMsQ0FORixDQURGLENBREY7QUE0Q0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdmF0YXIsIEJveCwgR3JvdywgVHlwb2dyYXBoeSB9IGZyb20gJ0BtdWkvbWF0ZXJpYWwnO1xuaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcblxuaW1wb3J0IHsgTWVzc2FnZSwgTWVzc2FnZUNvbnRlbnQgfSBmcm9tICcuLi9jaGF0LXR5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIE11aU1lc3NhZ2Uoe1xuICBpZCxcbiAgbWVzc2FnZSxcbiAgc2hvd0RhdGUsXG4gIHNob3dUaW1lLFxufToge1xuICBpZDogc3RyaW5nO1xuICBtZXNzYWdlOiBNZXNzYWdlPE1lc3NhZ2VDb250ZW50PjtcbiAgc2hvd0RhdGU6IGJvb2xlYW47XG4gIHNob3dUaW1lOiBib29sZWFuO1xufSk6IFJlYWN0LlJlYWN0RWxlbWVudCB7XG4gIGlmIChtZXNzYWdlLmRlbGV0ZWRBdCkge1xuICAgIHJldHVybiA8ZGl2IGlkPXtpZH0gLz47XG4gIH1cblxuICBjb25zdCBkaXNwRGF0ZSA9IG1lc3NhZ2UudXBkYXRlZEF0ID8gbWVzc2FnZS51cGRhdGVkQXQgOiBtZXNzYWdlLmNyZWF0ZWRBdDtcblxuICBjb25zdCBDaGF0QXZhdG9yID0gKFxuICAgIDxCb3hcbiAgICAgIG1pbldpZHRoPXswfVxuICAgICAgZmxleFNocmluaz17MH1cbiAgICAgIG1sPXttZXNzYWdlLnNlbGYgPyAxIDogMH1cbiAgICAgIG1yPXttZXNzYWdlLnNlbGYgPyAwIDogMX1cbiAgICA+XG4gICAgICA8QXZhdGFyIGFsdD17bWVzc2FnZS51c2VybmFtZX0gc3JjPXttZXNzYWdlLmF2YXRhcn0gLz5cbiAgICA8L0JveD5cbiAgKTtcblxuICBjb25zdCBDaGF0VXNlcm5hbWUgPSAoXG4gICAgPEJveCBtYXhXaWR0aD1cIjEwMCVcIiBteD17MX0+XG4gICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTJcIiBhbGlnbj17bWVzc2FnZS5zZWxmID8gJ3JpZ2h0JyA6ICdsZWZ0J30+XG4gICAgICAgIHttZXNzYWdlLnVzZXJuYW1lfVxuICAgICAgPC9UeXBvZ3JhcGh5PlxuICAgIDwvQm94PlxuICApO1xuXG4gIGNvbnN0IENoYXREYXRlID0gKFxuICAgIDxCb3ggbWF4V2lkdGg9XCIxMDAlXCIgbXg9ezF9PlxuICAgICAgPFR5cG9ncmFwaHlcbiAgICAgICAgdmFyaWFudD1cImJvZHkyXCJcbiAgICAgICAgYWxpZ249e21lc3NhZ2Uuc2VsZiA/ICdyaWdodCcgOiAnbGVmdCd9XG4gICAgICAgIGNvbG9yPVwidGV4dFNlY29uZGFyeVwiXG4gICAgICA+XG4gICAgICAgIHtkaXNwRGF0ZT8udG9Mb2NhbGVUaW1lU3RyaW5nKFtdLCB7XG4gICAgICAgICAgaG91cjogJzItZGlnaXQnLFxuICAgICAgICAgIG1pbnV0ZTogJzItZGlnaXQnLFxuICAgICAgICB9KX1cbiAgICAgIDwvVHlwb2dyYXBoeT5cbiAgICA8L0JveD5cbiAgKTtcblxuICByZXR1cm4gKFxuICAgIDxHcm93IGluPlxuICAgICAgPEJveCBtYXhXaWR0aD1cIjEwMCVcIiBkaXNwbGF5PVwiZmxleFwiIGZsZXhEaXJlY3Rpb249XCJjb2x1bW5cIj5cbiAgICAgICAge3Nob3dEYXRlICYmIChcbiAgICAgICAgICA8VHlwb2dyYXBoeSBhbGlnbj1cImNlbnRlclwiPlxuICAgICAgICAgICAge2Rpc3BEYXRlPy50b0xvY2FsZURhdGVTdHJpbmcoKX1cbiAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICl9XG4gICAgICAgIDxCb3hcbiAgICAgICAgICBpZD17aWR9XG4gICAgICAgICAgbWF4V2lkdGg9XCIxMDAlXCJcbiAgICAgICAgICBteT17MX1cbiAgICAgICAgICBwbD17bWVzc2FnZS5zZWxmID8gJzIwJScgOiAwfVxuICAgICAgICAgIHByPXttZXNzYWdlLnNlbGYgPyAwIDogJzIwJSd9XG4gICAgICAgICAgZGlzcGxheT1cImZsZXhcIlxuICAgICAgICAgIGp1c3RpZnlDb250ZW50PXttZXNzYWdlLnNlbGYgPyAnZmxleC1lbmQnIDogJ2ZsZXgtc3RhcnQnfVxuICAgICAgICAgIHN0eWxlPXt7IG92ZXJmbG93V3JhcDogJ2JyZWFrLXdvcmQnIH19XG4gICAgICAgID5cbiAgICAgICAgICB7bWVzc2FnZS5hdmF0YXIgJiYgIW1lc3NhZ2Uuc2VsZiAmJiBDaGF0QXZhdG9yfVxuICAgICAgICAgIDxCb3ggbWluV2lkdGg9ezB9IGRpc3BsYXk9XCJmbGV4XCIgZmxleERpcmVjdGlvbj1cImNvbHVtblwiPlxuICAgICAgICAgICAge21lc3NhZ2UudXNlcm5hbWUgJiYgQ2hhdFVzZXJuYW1lfVxuICAgICAgICAgICAgPEJveFxuICAgICAgICAgICAgICBtYXhXaWR0aD1cIjEwMCVcIlxuICAgICAgICAgICAgICBweT17MX1cbiAgICAgICAgICAgICAgcHg9ezJ9XG4gICAgICAgICAgICAgIGJnY29sb3I9e21lc3NhZ2Uuc2VsZiA/ICdwcmltYXJ5Lm1haW4nIDogJ2JhY2tncm91bmQucGFwZXInfVxuICAgICAgICAgICAgICBjb2xvcj17bWVzc2FnZS5zZWxmID8gJ3ByaW1hcnkuY29udHJhc3RUZXh0JyA6ICd0ZXh0LnByaW1hcnknfVxuICAgICAgICAgICAgICBib3JkZXJSYWRpdXM9ezR9XG4gICAgICAgICAgICAgIGJveFNoYWRvdz17Mn1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAge21lc3NhZ2UudHlwZSA9PT0gJ3RleHQnICYmIChcbiAgICAgICAgICAgICAgICA8VHlwb2dyYXBoeSB2YXJpYW50PVwiYm9keTFcIiBzdHlsZT17eyB3aGl0ZVNwYWNlOiAncHJlLXdyYXAnIH19PlxuICAgICAgICAgICAgICAgICAge21lc3NhZ2UuY29udGVudH1cbiAgICAgICAgICAgICAgICA8L1R5cG9ncmFwaHk+XG4gICAgICAgICAgICAgICl9XG4gICAgICAgICAgICAgIHttZXNzYWdlLnR5cGUgPT09ICdqc3gnICYmIDxkaXY+e21lc3NhZ2UuY29udGVudH08L2Rpdj59XG4gICAgICAgICAgICA8L0JveD5cbiAgICAgICAgICAgIHtzaG93VGltZSAmJiBDaGF0RGF0ZX1cbiAgICAgICAgICA8L0JveD5cbiAgICAgICAgICB7bWVzc2FnZS5hdmF0YXIgJiYgbWVzc2FnZS5zZWxmICYmIENoYXRBdmF0b3J9XG4gICAgICAgIDwvQm94PlxuICAgICAgPC9Cb3g+XG4gICAgPC9Hcm93PlxuICApO1xufVxuIl19
