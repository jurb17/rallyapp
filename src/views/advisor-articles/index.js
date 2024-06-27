import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { Box } from "@material-ui/core";
import { IconWriting } from "@tabler/icons";

// project imports
import ArticleList from "./components/ArticleList";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import NoteBanner from "ui-component/banners/NoteBanner";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar } from "actions/main";

// data and functions
import { myArticleList } from "utils/advisor-dummy-data";

// ==========================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

const ManageArticles = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // set states
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // function with get request to get list of articles
  const getArticlesData = async (articles) => {
    for (const article of articles) {
      // add selection route for each article card.
      if (article.id) article.selectionroute = `/adv/articles/${article.id}`;
    }
    setArticles([...articles]);
    setIsLoading(false);
  };

  useEffect(() => {
    if (myArticleList.length) getArticlesData(myArticleList);
    else {
      setIsLoading(false);
      dispatch(showSnackbar("No articles found.", true, "warning"));
    }
  }, []);

  // display the ArticleList component.
  return (
    <>
      <GenericPage
        pageHeader="Your Articles"
        noHrule={true}
        buttonlist={[
          {
            name: "Compose New Article",
            color: "primary",
            variant: "contained",
            startIcon: <IconWriting stroke={1.25} />,
            onClick: () => {
              navigate("/adv/articles/new", {
                state: { goBack: false, preview: false },
              });
            },
          },
        ]}
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading Article List..." />
          </Box>
        ) : !!articles && articles.length > 0 ? (
          <Box className="horizontal-center">
            <ArticleList articles={articles} />
          </Box>
        ) : (
          // end up here if no data. (Even when the request fails.)
          <>
            <Box className="horizontal-center">
              <PagePlaceholderText text="You have not written any articles yet!" />
            </Box>
            <Box className="horizontal-center">
              <NoteBanner maxwidth="80%">
                Articles will be publically displayed on your firm's Rally
                webpage. The public can search for articles by category and
                subcategory.
              </NoteBanner>
            </Box>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default ManageArticles;
