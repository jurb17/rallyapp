import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@material-ui/core";

// project imports
import MainCard from "ui-component/cards/MainCard";

// assets
import { IconGridDots } from "@tabler/icons";
import { Cancel } from "@material-ui/icons";
import Badge from "@material-ui/core/Badge";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    width: "100%",
    overflow: "visible",
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary.light,
    },
    marginBottom: "16px",
    padding: "0",
    backgroundColor: theme.palette.grey[50],
    borderColor: theme.palette.secondary.dark,
    display: "flex",
    justifyContent: "start",
  },
  avatar: {
    ...theme.typography.commonAvatar,
    ...theme.typography.largeAvatar,
    color: theme.palette.secondary.dark,
    backgroundColor: theme.palette.grey[50],
  },
  cardHeading: {
    fontSize: "1.125rem",
    fontWeight: 500,
  },
  subHeading: {
    fontSize: "1.000em",
    fontWeight: 800,
    fontVariantCaps: "all-small-caps",
    color: theme.palette.secondary.dark,
  },
  orderText: {
    marginRight: "24px",
    fontSize: "0.875rem",
    fontWeight: 800,
    color: theme.palette.grey[900],
  },
  mainText: {
    paddingTop: 0,
    paddingBottom: 0,
    alignSelf: "start",
    flexGrow: 1,
    flexWrap: "wrap",
  },
  onHover: {
    cursor: "pointer",
  },
  noPadding: {
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 0,
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
          <MainCard sx={{ pt: 0, pb: 0 }} className={classes.card}>
            <List className={classes.noPadding}>
              <ListItem disableGutters className={classes.noPadding}>
                <ListItemAvatar className={classes.noPadding}>
                  <Avatar variant="rounded" className={classes.avatar}>
                    <IconGridDots fontSize="inherit" />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText className={classes.noPadding}>
                  <Typography className={classes.orderText}>
                    {props.task.order}
                  </Typography>
                </ListItemText>
                <ListItemText
                  className={classes.mainText}
                  secondary={
                    <Typography variant="h6" className={classes.subHeading}>
                      {props.task.deliverable}
                    </Typography>
                  }
                  primary={
                    <Typography variant="h4" className={classes.cardHeading}>
                      {props.task.title}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </MainCard>
        </Badge>
      ) : (
        <MainCard className={classes.card}>
          <List className={classes.noPadding}>
            <ListItem disableGutters className={classes.noPadding}>
              <ListItemText className={classes.noPadding}>
                <Typography className={classes.orderText}>
                  {props.task.order}
                </Typography>
              </ListItemText>
              <ListItemText
                className={classes.mainText}
                secondary={
                  <Typography variant="h6" className={classes.subHeading}>
                    {props.task.deliverable}
                  </Typography>
                }
                primary={
                  <Typography variant="h4" className={classes.cardHeading}>
                    {props.task.title}
                  </Typography>
                }
              />
            </ListItem>
          </List>
        </MainCard>
      )}
    </>
  );
};

export default TaskCard;
