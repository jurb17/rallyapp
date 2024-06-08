import React, { useRef } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography, List } from "@material-ui/core";

// project imports
import Searchbar from "ui-component/forms/Searchbar";
import BackButton from "ui-component/buttons/BackButton";

// style constant
const useStyles = makeStyles((theme) => ({
  chatList: {
    height: "68vh",
    width: "280px",
    minWidth: "240px",
    marginRight: theme.spacing(2),
    "@media (max-width: 600px)": {
      marginRight: 0,
      width: "100%",
    },
  },
  noChatBox: {
    height: "100%",
    marginTop: theme.spacing(1),
    display: "flex",
    justifyContent: "center",
    border: `1px solid ${theme.palette.grey[300]}`,
    borderRadius: "4px",
    overflow: "auto",
  },
  list: {
    width: "100%",
    bgcolor: theme.palette.background.paper,
  },
}));

// ============================================================
/* PROPS MAP
handleSearch = function to handle search
handleCancelSearch = function to handle cancel search
noMessages = boolean to indicate if there are no messages
displaychatlist = array of chat list items
*/

const ChatList = (props) => {
  const classes = useStyles();
  const chatRef = useRef(null);

  return (
    <Box className={classes.chatList} ref={chatRef}>
      <Box display="flex" alignItems={"center"} mb={1}>
        <BackButton size="medium" />
        <Typography fontSize={"1.75rem"}>Chat List</Typography>
      </Box>
      <Searchbar
        handleSearch={props.handleSearch}
        handleCancel={props.handleCancelSearch}
      />
      <Box className={classes.noChatBox}>
        {!!props.noMessages ? (
          <Typography variant="h5" margin={2}>
            <em>There are no chats to list.</em>
          </Typography>
        ) : (
          <List className={classes.list}>{props.displaychatlist}</List>
        )}
      </Box>
    </Box>
  );
};

export default ChatList;
