import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import { Box, Grid } from "@material-ui/core";

// local imports
import advisoryService from "services/advisory.service";
import ArticleDescriptionForm from "./forms/ArticleDescriptionForm";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import CategoriesForm from "ui-component/forms/CategoriesForm";
import GenericPage from "ui-component/pages/GenericPage";
import { showSnackbar, showEditBanner } from "actions/main";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import CustomButtonGroup from "ui-component/buttons/CustomButtonGroup";
import QuillPaper from "ui-component/templates/QuillPaper";

// style constant
const useStyles = makeStyles((theme) => ({
  chip: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

// ===============================================================
// NO PROPS, ONLY LOCATION.STATE
// this page can be accessed from the new article page

const PreviewArticle = () => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const categoriesFormRef = useRef();
  const articleCatsCardFormRef = useRef();
  const quillEditor = useRef(null);

  // data states (just pulling in from NewArticle)
  const [newArticle, setNewArticle] = useState({});

  // form data states
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [errorInfo, setErrorInfo] = useState({});
  const [canContinue, setCanContinue] = useState(false);

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
            reject(response.data.details.text);
          }
        })
        .catch((error) => {
          reject(error.message);
        });
    });
  };

  useEffect(async () => {
    // if there is no location state data, route the user back to NewArticle
    if (!location.state.draft) {
      navigate("/advisor/articles/new");
    } else {
      dispatch(showEditBanner(true, "Creating new article..."));
      // get the form data
      await getAllCats()
        .then((catmap) => {
          setNewArticle({ ...location.state.draft });
          if (!!location.state.draft.category) {
            setSubcategoryOptions(catmap[location.state.draft.category]);
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
    }
  }, []);
  // handle canContinue mode
  useEffect(() => {
    if (
      !!newArticle.category &&
      !!newArticle.subcategory &&
      !!newArticle.description
    ) {
      setCanContinue(true);
    } else {
      setCanContinue(false);
    }
  }, [newArticle.category, newArticle.subcategory, newArticle.description]);

  // #region - The states and functions for tags
  // handle "go back" button
  const handleBack = () => {
    navigate("/adv/articles/new", {
      state: { draft: { ...newArticle } },
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
            dispatch(
              showSnackbar("Article created successfully", true, "success")
            );
          } else {
            dispatch(
              showSnackbar(
                "There seems to be an issue. Please contact support if this issue persists.",
                true,
                "error"
              )
            );
            console.log("uncaught error", error);
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
  // handle description change
  const handleDescriptionInputChange = (value) => {
    setNewArticle((prevState) => ({ ...prevState, description: value }));
  };

  // HANDLING CATEGORIES FORM DATA =============================================
  // handle category selection
  const handleCategoryChange = (value) => {
    categoryOptions.forEach((pair) => {
      // find the matching category id
      if (pair[0] === value) {
        const optionId = pair[1];
        setSubcategoryOptions(categoryMap[optionId]); // should be a list of list pairs
        setNewArticle((prevState) => ({
          ...prevState,
          displayCategory: value,
          category: optionId,
          displaySubcategory: "",
          subcategory: "",
        }));
      }
    });
  };
  // handle subcategory selection
  const handleSubcategoryChange = (value) => {
    subcategoryOptions.forEach((pair) => {
      // find the matching subcategory id
      if (pair[0] === value) {
        const optionId = pair[1];
        setNewArticle((prevState) => ({
          ...prevState,
          displaySubcategory: value,
          subcategory: optionId,
        }));
      }
    });
  };

  return (
    <>
      <FormInputErrorModal
        open={Object.entries(errorInfo).length > 0}
        errorInfo={errorInfo}
        handleErrorConfirmation={() => setErrorInfo({})}
      />
      <GenericPage
        pageHeader="New Article Preview"
        handleBack={handleBack}
        buttonlist={[
          {
            name: "Back To Writing Content",
            color: "primary",
            variant: "text",
            onClick: handleBack,
          },
          {
            name: "Publish Article",
            color: "secondary",
            variant: "contained",
            onClick: handlePublish,
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
            {" "}
            <SubsectionWrapper
              border={false}
              title="Article Categories and Description"
              tipBody="Select the category and subcategory as appropriate for your article. These will be used to help the public find your article. The description will be displyed as a preview of your article."
            >
              <Box sx={{ width: 1, flexGrow: 1, mb: 2, mt: 1.5 }}>
                <CategoriesForm
                  forwardedCategoriesFormRef={categoriesFormRef}
                  categoryid={newArticle.category}
                  subcategoryid={newArticle.subcategory}
                  category={newArticle.displayCategory}
                  subcategory={newArticle.displaySubcategory}
                  categoryOptions={categoryOptions}
                  subcategoryOptions={subcategoryOptions}
                  handleCategoryChange={handleCategoryChange}
                  handleSubcategoryChange={handleSubcategoryChange}
                />
              </Box>
              <Box sx={{ width: 1, flexGrow: 1, mb: 1 }}>
                <ArticleDescriptionForm
                  description={
                    !!newArticle.description ? newArticle.description : ""
                  }
                  category={newArticle.category}
                  handleDescriptionInputChange={handleDescriptionInputChange}
                  forwardedArticleDescriptionFormRef={articleCatsCardFormRef}
                />
              </Box>
            </SubsectionWrapper>
            <SubsectionWrapper
              mb={1}
              title="Article Preview"
              border={false}
              tipBody="This is a just a preview of the article. Select the publish button to publish the article or select the back arrow to continue writing."
            >
              <QuillPaper
                forwardedQuillEditor={quillEditor}
                title={newArticle.title}
                content={newArticle.deltas}
                border={false}
              />
            </SubsectionWrapper>
            <Grid
              container
              direction="row"
              display="flex"
              justifyContent={"right"}
              mt={1}
            >
              <CustomButtonGroup
                buttonlist={[
                  {
                    name: "Back To Writing Content",
                    color: "primary",
                    variant: "text",
                    onClick: handleBack,
                  },
                  {
                    name: "Publish Article",
                    color: "secondary",
                    variant: "contained",
                    onClick: handlePublish,
                    disabled: !canContinue,
                  },
                ]}
              />
            </Grid>
          </>
        )}
      </GenericPage>
    </>
  );
};

export default PreviewArticle;

// FOR THE TAGGING SYSTEM
/* <Box sx={{ display: "flex", pb: 3, marginTop: "-12px", flexWrap: "wrap" }}>
  {tags.map((tag) => (
    <Stack direction="row">
      <Chip
        key={tag}
        label={tag}
        className={classes.chip}
        variant="outlined"
        onDelete={handleDelete(tag)}
      />
    </Stack>
  ))}
</Box>; */

// // handle deleting a tag from the list of tags
// const handleDelete = (tag) => () => {
//   if (tags.length === 1) {
//     setTags([]);
//   } else if (tags.length > 1) {
//     setTags((tags) => {
//       return tags.filter((t) => t !== tag);
//     });
//   }
// };
// // #endregion

// const [tags, setTags] = useState([]);
// // adding a tag
// const handleAddTag = (tag) => {
//   if (tags.length < 5) {
//     setTags([...tags, tag]);
//   } else {
//     alert("You can only add 5 tags");
//   }
// };
