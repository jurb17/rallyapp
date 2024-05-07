import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// project imports
import advisoryService from "services/advisory.service";
import { showSnackbar } from "actions/main";

// ==========================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the side menu

export default ApiWrapper = () => {
  // function with get request to get list of articles
  const getArticleListData = async () => {
    await advisoryService
      .getArticleList({})
      .then((response) => {
        if (!!response.data.payload.success) {
          if (!!response.data.payload.posts) {
            let articlelist = response.data.payload.posts;
            for (const article of articlelist) {
              if (!!article.id) {
                article.selectionroute = `/adv/articles/${article.id}`;
              }
            }
            setArticles([...articlelist]);
          } else {
            dispatch(showSnackbar("No articles found.", true, "warning"));
          }
        } else {
          dispatch(showSnackbar(response.data.details.text, true, "error"));
        }
        setIsLoading(false);
      })
      .catch((error) => {
        dispatch(
          showSnackbar(
            "There seems to be an issue. Please contact support if this issue persists.",
            true,
            "error"
          )
        );
        console.log("uncaught error", error);
        setIsLoading(false);
      });
  };

  // get the cats list and subcatMap object together
  const getAllCats = async () => {
    return new Promise(async (resolve, reject) => {
      await advisoryService
        .getConfigs({})
        .then((response) => {
          if (!!response.data.payload.success) {
            const catmap = response.data.payload["CATEGORY_MAP"];
            setCategoryOptions(catmap.categories);
            setCategoryMap(catmap.subcategories);
            resolve(catmap.subcategories);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            reject(response.data.details.text);
          }
        })
        .catch((error) => {
          dispatch(
            showSnackbar(
              "There seems to be an issue. Please contact support if this issue persists.",
              true,
              "error"
            )
          );
          console.log("uncaught error", error);
          reject(error.message);
        });
    });
  };

  // when the user publishes the article
  const handlePublish = async () => {
    if (
      !!newArticle.category &&
      !!newArticle.subcategory &&
      !!newArticle.description
    ) {
      await advisoryService
        .postArticle({
          title: newArticle.title,
          description: newArticle.description,
          category: newArticle.category,
          subcategory: newArticle.subcategory,
          deltas: newArticle.deltas.ops,
          tags: [],
        })
        .then((response) => {
          if (!!response.data.payload.success) {
            let postid = response.data.payload.post.id;
            // navigate to the article page
            navigate(`/adv/articles/${postid}`);
          } else {
            dispatch(showSnackbar("Error publishing article", true, "error"));
          }
        })
        .catch((error) => {
          // $$$ change all "error.message" references to user-friendly text
          dispatch(
            showSnackbar(
              "There seems to be an issue. Please contact support if this issue persists.",
              true,
              "error"
            )
          );
          console.log("uncaught error", error);
        });
    } else {
      dispatch(
        showSnackbar(
          "Please select a category and subcategory, and add a description before publishing",
          true,
          "warning"
        )
      );
    }
  };

  return (
    <>
      <Outlet />
    </>
  );
};
