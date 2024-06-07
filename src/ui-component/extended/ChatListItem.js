import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Divider,
  ListItemText,
  ListItemAvatar,
  Avatar,
  ListItemButton,
  IconButton,
  ListItem,
} from "@material-ui/core";
import { IconPoint, IconMessageOff } from "@tabler/icons";
import { stringAvatar } from "utils/chat-avatar";

// style constant
const useStyles = makeStyles((theme) => ({
  chatItem: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.hint,
    "&.Mui-selected": {
      // style of text in the side menu on select.
      color: theme.menuSelected,
      backgroundColor: theme.palette.primary.light,
      "&:hover": {
        backgroundColor: theme.palette.primary.light,
        color: theme.menuSelected,
      },
      // style of icons in side menu on select.
      "& .MuiListItemIcon-root": {
        color: theme.menuSelected,
      },
    },
    "&:hover": {
      // style of text in side menu on hover.
      backgroundColor: theme.palette.primary.light,
      color: theme.menuSelected,
      // style of icons in side menu on hover.
      "& .MuiListItemIcon-root": {
        color: theme.menuSelected,
      },
    },
  },
}));

// =======================================================================
/* PROPS MAP
adviceid = string of the client id
selectedIndex = selected index of the chat list
clientname = string presenting the name of the client
lastmessage = string of the last message
handleSelectChat = function to be called when chat list item is selected.
newMessage = boolean used to determine whether a notification icon should be dispayed or not
*/

const ChatListItem = (props) => {
  const classes = useStyles();

  // handle the selection of a chat from the list
  const handleSelectChat = () => {
    props.handleSelectChat(props.adviceid, props.token, props.advisorslug);
  };

  return (
    <>
      <ListItem
        alignItems="flex-start"
        className={classes.chatItem}
        secondaryAction={
          !!props.disconnected ? (
            <IconButton edge="end" disabled="true">
              <IconMessageOff color="red" />{" "}
            </IconButton>
          ) : !!props.newMessage ? (
            <IconButton edge="end" disabled="true">
              <IconPoint color="red" fill="red" />{" "}
            </IconButton>
          ) : null
        }
        disablePadding={true}
      >
        <ListItemButton
          className={classes.chatItem}
          onClick={handleSelectChat}
          selected={props.adviceid === props.selectedIndex}
        >
          <ListItemAvatar>
            <Avatar
              {...stringAvatar(props.clientname ? props.clientname : "")}
            />
          </ListItemAvatar>
          {/* remember to shorten the latest message to a certain number of characters that doesn't require crazy wrapping  */}
          <ListItemText
            primary={props.clientname}
            secondary={props.lastmessage}
          />{" "}
        </ListItemButton>
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

export default ChatListItem;
