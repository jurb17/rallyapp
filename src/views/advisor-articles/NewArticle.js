import React, { useState, useRef, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";

// local imports
import ViewArticleForm from "./forms/ViewArticleForm";
import CatsHeader from "ui-component/extended/CatsHeader";
import QuillContainer from "ui-component/forms/QuillContainer";
import GenericPage from "ui-component/pages/GenericPage";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import { showEditBanner, showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import { articleBody } from "utils/quill-placeholder";

// style constant
const useStyles = makeStyles((theme) => ({}));

//==============================================================
// NO PROPS, ONLY LOCATION.STATE
// this page can be accessed from the article list page, or from the article preview page

const NewArticle = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quillEditor = useRef(null);

  // data states
  const [newArticle, setNewArticle] = useState({
    title: "",
    description: "",
    deltas: articleBody,
    displayCategory: "",
    category: "",
    displaySubcategory: "",
    subcategory: "",
  });

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    dispatch(showEditBanner(true, "Creating new article..."));
    // if returning back from PreviewArticle, pull in the data from the location.state
    if (!!location.state.draft) {
      setNewArticle({ ...location.state.draft });
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  // handle canContinue mode
  useEffect(() => {
    if (
      newArticle.title.length > 0 &&
      quillEditor.current.getEditor().getText().trim().length > 0
    ) {
      setCanContinue(true);
    } else {
      setCanContinue(false);
    }
  }, [newArticle.title, newArticle.deltas.ops]);

  // function to handle missing info and navigation
  const handlePreview = () => {
    if (newArticle.title.length === 0) {
      dispatch(showSnackbar("Article is missing a title.", true, "warning"));
    } else if (quillEditor.current.getEditor().getText().trim().length === 0) {
      dispatch(showSnackbar("Article is missing content.", true, "warning"));
    } else {
      navigate("/adv/articles/preview", {
        state: {
          draft: {
            ...newArticle,
          },
        },
      });
    }
  };

  // handle title changes
  const handleTitleChange = (value) => {
    setNewArticle((prevState) => ({
      ...prevState,
      title: value,
    }));
  };
  // handle content changes
  const handleContentChange = (content) => {
    setNewArticle((prevState) => ({
      ...prevState,
      deltas: content,
    }));
  };

  return (
    <>
      <GenericPage
        pageHeader="New Article"
        buttonlist={[
          {
            name: "Continue to Preview",
            color: "primary",
            variant: "contained",
            onClick: handlePreview,
            disabled: !canContinue,
          },
        ]}
      >
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading..." />
          </Box>
        ) : (
          <>
            <SubsectionWrapper
              title="Article Title and Body"
              tipBody="Compose an article to post publicly on your Rally profile.  You will have a chance to preview the article before publishing it."
            >
              <>
                {newArticle.displayCategory && newArticle.displaySubcategory && (
                  <Box width={1} mt={1.5}>
                    <CatsHeader
                      category={newArticle.displayCategory}
                      subcategory={newArticle.displaySubcategory}
                    />
                  </Box>
                )}
                <Box width={1} mt={1.5}>
                  <ViewArticleForm
                    title={newArticle.title}
                    handleTitleChange={handleTitleChange}
                  />
                </Box>
                <Box width={1} mt={1}>
                  <QuillContainer
                    forwardedQuillEditor={quillEditor}
                    content={newArticle.deltas}
                    height="450px"
                    handleContentChange={handleContentChange}
                    placeholder="Provide your insight about a common financial topic or comment about the latest financial news..."
                  />
                </Box>
              </>
            </SubsectionWrapper>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default NewArticle;
