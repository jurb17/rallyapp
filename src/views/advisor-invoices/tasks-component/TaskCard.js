import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Avatar, Typography, Box, Grid } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";
import { IconGridDots } from "@tabler/icons";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: theme.palette.background.paper,
    // borderBottom: `1px solid ${theme.palette.secondary.dark}`,
    border: `1px solid ${theme.palette.secondary.dark}`,
    borderRadius: theme.spacing(1),
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.light,
    },
    width: "100%",
    padding: theme.spacing(2),
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing(2),
  },
  avatar: {
    ...theme.typography.commonAvatar,
    ...theme.typography.largeAvatar,
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.grey[50],
    padding: theme.spacing(1),
  },
  orderText: {
    flexShrink: 0,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(2),
    marginRight: "24px",
    fontSize: "0.875rem",
    fontWeight: 800,
    color: theme.palette.grey[900],
    textDecorationLine: "underline",
  },
  descriptionText: {
    flexShrink: 1,
    flexGrow: 1,
    alignSelf: "flex-start",
    fontSize: "1.125rem",
    fontWeight: 500,
    padding: theme.spacing(1),
    flexWrap: "wrap",
  },
  attributeText: {
    flexShrink: 0,
    fontSize: "1.125rem",
    fontWeight: 800,
    color: theme.palette.secondary.dark,
    padding: theme.spacing(1),
    flexWrap: "wrap",
  },
  onHover: {
    cursor: "pointer",
  },
  badgeWidth: {
    width: "100%",
    overflow: "visible",
    position: "relative",
    display: "flex",
    justifyContent: "start",
  },
}));

// ===========================|| DASHBOARD - TOTAL INCOME LIGHT CARD ||=========================== //

const TaskCard = (props) => {
  const classes = useStyles();

  const handleDelete = () => {
    props.deleteTaskWithId(props.id);
  };

  return (
    <>
      {props.editMode === "true" ? (
        <Badge
          className={classes.badgeWidth}
          badgeContent={
            <div onClick={handleDelete} className={classes.onHover}>
              <Cancel color="error" />
            </div>
          }
        >
          <Box className={classes.card}>
            <Box sx={{ flexShrink: 0 }}>
              <Grid
                container
                flex="true"
                flexDirection="row"
                alignItems="center"
              >
                <Avatar variant="rounded" className={classes.avatar}>
                  <IconGridDots fontSize="inherit" />
                </Avatar>
                <Typography className={classes.orderText}>
                  {props.task.order}
                </Typography>
              </Grid>
            </Box>
            <Box sx={{ flexGrow: 1, flexWrap: "wrap" }}>
              <Typography variant="h4" className={classes.descriptionText}>
                {props.task.description}
              </Typography>
            </Box>
            <Box sx={{ mb: 0, flexShrink: 0 }}>
              <Typography variant="h4" className={classes.attributeText}>
                {props.startAdornment ? props.startAdornment : ""}
                {props.task.attribute}
              </Typography>
            </Box>
          </Box>
        </Badge>
      ) : (
        <Box className={classes.card}>
          <Box sx={{ flexShrink: 0 }}>
            <Grid container flex="true" flexDirection="row" alignItems="center">
              <Typography className={classes.orderText}>
                {props.task.order}
              </Typography>
            </Grid>
          </Box>
          <Box sx={{ mb: 0, flexShrink: 0, flexGrow: 1 }}>
            <Typography variant="h4" className={classes.descriptionText}>
              {props.task.description}
            </Typography>
          </Box>
          <Box sx={{ mb: 0, flexShrink: 0 }}>
            <Typography variant="h4" className={classes.attributeText}>
              {props.startAdornment ? props.startAdornment : ""}
              {props.task.attribute}
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
};

export default TaskCard;
