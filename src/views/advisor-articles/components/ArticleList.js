import React from "react";
import { useNavigate } from "react-router-dom";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// third party imports
import Masonry from "react-masonry-css";

// project imports
import "styles/article_styles.css";
import ArticleCatsCard from "./ArticleCatsCard";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ========================================================
/* PROPS MAP
articles = array of articles
*/

const ArticleList = (props) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Navigate the user to the profile page.
  const handleCardClick = (data) => {
    navigate(`/adv/articles/${data.id}`);
  };

  // generate list of articles
  const children = [];
  if (!!props.articles && Object.entries(props.articles).length > 0) {
    props.articles.map((article, index) => {
      children.push(
        <ArticleCatsCard
          key={index}
          article={article}
          onClick={handleCardClick}
          deleted={article.deletedAt ? true : false}
        />
      );
    });
  } else children.push(<p></p>);

  const breakpointColumnsObj = {
    default: 3,
    1450: 2,
    1050: 1,
    960: 2,
    700: 1,
  };

  // display button to create new user and table of articles.
  return (
    <>
      <Box flex={true} flexGrow={1}>
        <Masonry
          breakpointCols={breakpointColumnsObj}
          className="my-masonry-grid"
          columnClassName="my-masonry-grid_column"
        >
          {children}
        </Masonry>
      </Box>
    </>
  );
};

export default ArticleList;
