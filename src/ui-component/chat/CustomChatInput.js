import React from "react";
import { useDispatch } from "react-redux";

// third party libraries
import { Box, Button, OutlinedInput, FormControl } from "@material-ui/core";
import * as chatui from "chat-ui-react";

import { showSnackbar } from "actions/main";

// ==========================================================

const CustomChatInput = ({ chatController, actionRequest }) => {
  const dispatch = useDispatch();
  const chatCtl = chatController;
  const actRequest = actionRequest;

  // states
  const [value, setValue] = React.useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const setResponse = () => {
    if (!value.trim()) {
      dispatch(showSnackbar("Cannot send an empty message.", true, "warning"));

      return;
    } else if (value.trim().length > 500) {
      dispatch(
        showSnackbar(
          "Message must be less than 500 characters.",
          true,
          "warning"
        )
      );

      return;
    } else {
      const res = { type: "custom", value: value };
      actRequest.onSubmit(value);
      setValue("");
      return;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setResponse();
    }
  };

  return (
    <>
      <Box sx={{ width: "100%", mr: 2 }}>
        <FormControl fullWidth variant="outlined">
          <OutlinedInput
            placeholder={actRequest.placeholder}
            value={value}
            onChange={handleChange}
            autoFocus={true}
            multiline={true}
            inputProps={{ onKeyDown: handleKeyDown }}
            variant="outlined"
            maxRows={6}
          />
        </FormControl>
      </Box>
      <Button
        sx={{ mr: 2 }}
        type="button"
        onClick={setResponse}
        variant="contained"
        color="primary"
        disabled={!value}
      >
        Send
      </Button>
    </>
  );
};

export default CustomChatInput;
