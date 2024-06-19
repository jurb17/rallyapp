import React, { useState, useRef, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box } from "@material-ui/core";
import { IconPencil, IconDeviceFloppy, IconEyeOff } from "@tabler/icons";

// local imports
import QuillContainer from "ui-component/forms/QuillContainer";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import GenericPage from "ui-component/pages/GenericPage";
import ConfirmDeleteModal from "ui-component/modals/ConfirmDeleteModal";
import { showEditBanner, showSnackbar } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import InputBaseForm from "ui-component/forms/InputBaseForm";
import CatsHeader from "ui-component/extended/CatsHeader";
import ArticleDescription from "./forms/ArticleDescription";
import QuillPaper from "ui-component/templates/QuillPaper";

// data and functions
import { myArticleList } from "utils/advisor-dummy-data";

// style constant
const useStyles = makeStyles((theme) => ({}));

//==============================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the article list page, or from the article preview page

const ArticleProfile = () => {
  const classes = useStyles();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const quillEditor = useRef(null);

  const { id } = useParams();
  const idParam = id;

  // data states
  const [articlePayload, setArticlePayload] = useState({});
  const [unsavedContent, setUnsavedContent] = useState({});

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [hasNewContent, setHasNewContent] = useState(false);

  const getArticleData = async (articlelist, id) => {
    const article = articlelist[id];
    console.log(article.deltas);
    // const parsedDelta = JSON.parse(article.deltas);
    setUnsavedContent(article.deltas);
    setArticlePayload({
      ...article,
      deltas: article.deltas,
    });
    setIsLoading(false);
    return true;
  };

  // get current data from the server
  useEffect(() => {
    // if idParam and clientList exist, get current client data
    if (idParam)
      if (myArticleList && myArticleList.length)
        getArticleData(myArticleList, idParam);
      // otherwise, go back
      else {
        console.log("No article list found.");
        navigate(-1);
      }
    else navigate(-1);
  }, []);

  useEffect(() => {
    if (!!editMode) dispatch(showEditBanner(true, "Editing article..."));
    else dispatch(showEditBanner(false, ""));
  }, [editMode]);

  // handle edit cancel
  const handleEditCancel = () => {
    setEditMode(false);
    setUnsavedContent(articlePayload.deltas);
    dispatch(showSnackbar("No changes were made.", true, "info"));
    setHasNewContent(false);
  };

  // when the user is done adding tags and is looking to publish the article
  const handleEditSave = async () => {
    // compare new deltas with old deltas
    // if they are the same, do nothing
    if (!hasNewContent)
      dispatch(showSnackbar("No changes to save.", true, "warning"));
    // if there are differences, set the payload content to the new content
    else {
      setArticlePayload((prevState) => ({
        ...prevState,
        deltas: unsavedContent.ops,
      }));
      setEditMode(false);
      setHasNewContent(false);
      dispatch(showSnackbar("Article updated successfully", true, "success"));
      return response;
    }
  };

  // handle delete confirm
  const handleDeleteConfirm = async () => {
    // there is no form to validate here.
    dispatch(showSnackbar("Article delisted successfully.", true, "success"));
    navigate("/adv/articles");
    setDeleteMode(false);
  };

  // handle changes
  const handleTitleChange = (value) => {
    setArticlePayload((prevState) => ({
      ...prevState,
      title: value,
    }));
  };

  // handle content changes
  const handleContentChange = (content) => {
    setUnsavedContent(content);
    setHasNewContent(true);
  };

  return (
    <>
      <ConfirmDeleteModal
        open={deleteMode}
        handleConfirm={handleDeleteConfirm}
        handleCancel={() => setDeleteMode(false)}
        heading="Are you sure you want to delist this article?"
        body="This action cannot be undone."
        action="Delist Article"
        nonaction="Cancel"
      />
      {isLoading ? (
        <Box className="horizontal-center">
          <PagePlaceholderText text="Loading..." />
        </Box>
      ) : (
        <>
          <GenericPage
            pageHeader="Article Overview"
            backlink="/adv/articles"
            buttonlist={
              !!articlePayload.deletedAt
                ? [
                    {
                      name: "DELISTED",
                      color: "error",
                      variant: "text",
                      startIcon: <IconEyeOff stroke={1.25} />,
                      onClick: () => {},
                    },
                  ]
                : !editMode
                ? [
                    {
                      name: "Delist Article",
                      color: "error",
                      variant: "outlined",
                      startIcon: <IconEyeOff stroke={1.25} />,
                      onClick: () => setDeleteMode(true),
                    },
                    {
                      name: "Edit",
                      color: "primary",
                      variant: "contained",
                      startIcon: <IconPencil stroke={1.25} />,
                      onClick: () => setEditMode(true),
                    },
                  ]
                : [
                    {
                      name: "Cancel",
                      color: "primary",
                      variant: "text",
                      onClick: handleEditCancel,
                    },
                    {
                      name: "Save Changes",
                      color: "secondary",
                      variant: "contained",
                      startIcon: <IconDeviceFloppy stroke={1.25} />,
                      onClick: handleEditSave,
                    },
                  ]
            }
          >
            <SubsectionWrapper
              title={editMode ? "Update Article Body" : "Article Preview"}
              border={false}
              tipBody="This is a preview of your article. If your article is live, you can edit the body of the article by selecting the Edit button. The title and description cannot be edited currently. If your article is delisted, it will not be publically viewable and you cannot make any changes."
              mb={1}
            >
              <Box width={1} sx={{ mb: 3 }}>
                <CatsHeader
                  category={articlePayload.category}
                  subcategory={articlePayload.subcategory}
                />
              </Box>
              <Box width={1} sx={{ mt: 2 }}>
                <ArticleDescription description={articlePayload.description} />
              </Box>
              <InputBaseForm
                key={articlePayload.title}
                formObj={{ Title: articlePayload.title }}
                mb={1.5}
                mt={-2}
              />
              {!editMode ? ( // if NOT in edit mode
                <QuillPaper
                  title={articlePayload.title}
                  content={articlePayload.deltas}
                  forwardedQuillEditor={quillEditor}
                />
              ) : (
                // if in edit mode
                <>
                  <QuillContainer
                    forwardedQuillEditor={quillEditor}
                    content={unsavedContent}
                    height="450px"
                    handleContentChange={handleContentChange}
                  />
                </>
              )}
            </SubsectionWrapper>
          </GenericPage>
        </>
      )}
    </>
  );
};

export default ArticleProfile;
