import PropTypes from "prop-types";
import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
} from "@material-ui/core";

// project imports
import TotalIncomeCard from "ui-component/cards/Skeleton/TotalIncomeCard";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    backgroundColor: "#fff",
    color: theme.palette.primary.dark,
    position: "relative",
    "&:hover": {
      cursor: "pointer",
      backgroundColor: theme.palette.secondary[200],
    },
    width: "auto",
    marginBottom: "1.25rem",
  },
  cardHeading: {
    fontSize: "1.500rem",
    fontWeight: 500,
    marginRight: "8px",
    marginTop: "4px",
    marginBottom: "6px",
  },
  subHeading: {
    fontSize: "1.000rem",
    fontWeight: 800,
    fontVariantCaps: "all-small-caps",
    color: theme.palette.primary.main,
  },
  removeMargin: {
    marginTop: "-24px",
  },
  tagContainer: {
    backgroundColor: theme.palette.primary.dark,
  },
  tag: {
    fontSize: "0.875rem",
    fontWeight: 500,
    color: "#fff",
  },
}));

//= ===========================|| PRODUCT CARD ||============================//

const ArticleCard = (props, { isLoading }) => {
  const classes = useStyles();

  const clickHandler = () => {
    props.onClick(articleData);
  };

  let articleData = { ...props };

  return (
    <>
      {isLoading ? (
        <TotalIncomeCard />
      ) : (
        <Card className={classes.card} onClick={clickHandler} height="100%">
          <CardMedia
            component="img"
            height="140"
            image={`https://source.unsplash.com/random-${articleData.id}`}
            alt={articleData.title}
          />
          <CardContent>
            <Typography className={classes.cardHeading}>
              {articleData.title}
            </Typography>
            <Typography className={classes.subHeading}>
              {articleData.datePublished}
            </Typography>
          </CardContent>
          <CardActions className={classes.removeMargin}>
            {articleData.tags.map((tag, index) => (
              <Button className={classes.tagContainer} key={index}>
                <Typography className={classes.tag}>{tag}</Typography>
              </Button>
            ))}
          </CardActions>
        </Card>
      )}
    </>
  );
};

ArticleCard.propTypes = {
  isLoading: PropTypes.bool,
};

export default ArticleCard;
