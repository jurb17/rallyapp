import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Typography, Button, Chip, Paper } from "@material-ui/core";
import { useTheme } from "@emotion/react";
import { IconWallet } from "@tabler/icons";

const useStyles = makeStyles((theme) => ({
  catCard: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardButton: {
    height: "144px",
    width: "144px",
    padding: "24px 24px",
    border: `1px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

// =====================================================
/* PROPS MAP
text = string for category name
icon = icon for visual representation of category
selected = boolean to determine if category is selected
*/

const CategoryCard = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Paper
      key={props.id}
      id={props.id}
      label={props.label}
      icon={props.icon}
      onClick={props.onClick}
      sx={{
        mr: 1,
        ml: 1,
        mt: 1,
        mb: 1,
        width: "144px",
        fontSize: "1rem",
        fontWeight: "bold",
        padding: "0.75rem",
        backgroundColor: !!props.selected
          ? theme.palette.primary.dark
          : theme.palette.primary.main,
        "&:hover": {
          backgroundColor: theme.palette.primary.dark,
          cursor: "pointer",
        },
      }}
    >
      {" "}
      <Box
        display="flex"
        direction="row"
        alignItems="center"
        justifyContent={"center"}
        marginBottom={1}
      >
        {props.icon}
      </Box>
      <Typography
        variant="h4"
        sx={{
          color: theme.palette.text.hint,
          textAlign: "center",
        }}
      >
        {props.label}
      </Typography>
    </Paper>
    // <Box sx={{ margin: 1.5, marginTop: 1 }}>
    //   <Button
    //     id={props.id}
    //     className={classes.cardButton}
    //     onClick={props.onClick}
    //     value={props.text}
    //     style={
    //       !!props.selected
    //         ? {
    //             backgroundColor: theme.palette.primary.dark,
    //             border: "2px solid white",
    //           }
    //         : {}
    //     }
    //   >
    //     <Box className={classes.catCard}>
    //       <Box
    //         sx={{
    //           display: "flex",
    //           flexGrow: 1,
    //           justifyContent: "center",
    //           mb: 1.5,
    //         }}
    //       >
    //         {/* for icon component */}
    //         {props.children}
    //       </Box>
    //       <Box sx={{ display: "flex", flexGrow: 1, justifyContent: "center" }}>
    //         {/* for text component */}
    //         <Typography
    //           id={props.id}
    //           variant="h4"
    //           color={theme.palette.text.hint}
    //           fontStyle="normal"
    //           textAlign="center"
    //           {...props.textStyle}
    //         >
    //           {props.text}
    //         </Typography>
    //       </Box>
    //     </Box>
    //   </Button>
    // </Box>
  );
};

export default CategoryCard;
