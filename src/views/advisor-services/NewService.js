import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { useTheme } from "@emotion/react";
import { Box, Stack } from "@material-ui/core";
import {
  IconCalendarEvent,
  IconPlant,
  IconReceiptTax,
  IconWallet,
} from "@tabler/icons";

// assets
import GenericPage from "ui-component/pages/GenericPage";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import { showEditBanner } from "actions/main";
import CategoryCard from "ui-component/cards/CategoryCard";
import SubcategoryButton from "ui-component/buttons/SubcategoryButton";

// data and function imports
import { articleCategories, articleSubcategories } from "utils/categories";
import { demoMapCategoryDisplayNames } from "utils/DataMapFunctions";

// style constant
const useStyles = makeStyles((theme) => ({}));

// ==============================================================
// NO PROPS, LOCATION.STATE ONLY
// this page can be accessed from the service list page

const NewService = () => {
  const classes = useStyles();
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const categoriesFormRef = useRef({});

  // define initial state of the newService object
  const initialState = {
    title: "",
    description: "",
    deltas: {},
    categoryid: "",
    displayCategory: "",
    subcategoryid: "",
    displaySubcategory: "",
  };

  // define states from location
  const emptyList = location.state?.emptyList;

  // define state for user input to be submitted.
  const [newService, setNewService] = useState({ ...initialState });

  // form data states
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [canContinue, setCanContinue] = useState(false);

  // get the cats list and subcatMap object together
  const getAllCats = (categories, subcategories) => {
    setCategoryOptions(categories);
    setCategoryMap(subcategories);
    return true;
  };

  useEffect(() => {
    dispatch(showEditBanner(true, "Creating new service..."));
    // get the form data
    getAllCats(articleCategories, articleSubcategories);
    setIsLoading(false);
  }, []);

  // handle canContinue mode
  useEffect(() => {
    if (newService.categoryid) setCanContinue(true);
    else setCanContinue(false);
  }, [newService.categoryid, newService.subcategoryid]);

  // handle next: no longer checking if the category pair exists, just moving to the next page.
  const handleNext = () => {
    // navigate to the next page.
    navigate("/adv/services/preview", {
      state: {
        category: newService.categoryid,
        subcategory: newService.subcategoryid,
      },
    });
    setIsLoading(false);
  };

  // HANDLING CATEGORIES FORM DATA =============================================
  // handle category selection
  const handleCategoryChange = (value) => {
    setSubcategoryOptions(categoryMap[value.target.id]);
    setNewService((prevState) => ({
      ...prevState,
      displayCategory: demoMapCategoryDisplayNames(value.target.id, null)
        .categoryDisplayName,
      categoryid: value.target.id,
      displaySubcategory: "",
      subcategoryid: "",
    }));
  };
  // handle subcategory selection
  const handleSubcategoryChange = (value) => {
    subcategoryOptions.forEach((pair) => {
      // find the matching subcategory id
      if (pair[0] === value.target.id || value.target.innerText === pair[1]) {
        setNewService((prevState) => ({
          ...prevState,
          subcategoryid: pair[0],
          displaySubcategory: pair[1],
        }));
      }
    });
  };

  // display buttons to cancel and submit, and form with questions in list.
  return (
    <>
      <GenericPage
        pageHeader="Add New Service"
        buttonlist={[
          {
            name: "Continue",
            color: "primary",
            variant: "contained",
            onClick: handleNext,
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
            {/* CATEGORY SELECTION */}
            <SubsectionWrapper
              title={
                "I can offer a service related to... " +
                new String(newService.displayCategory)
              }
              key="categories"
              titleStyle={{ fontWeight: "normal", fontStyle: "italic" }}
              mb={2}
              mt={4}
            >
              <Stack
                direction="row"
                sx={{ justifyContent: "center", flexWrap: "wrap" }}
              >
                <CategoryCard
                  label="Personal Finance"
                  id="personal-finance"
                  icon={
                    <IconWallet
                      color={"white"}
                      stroke={1.25}
                      size={"28px"}
                      id="personal-finance"
                    />
                  }
                  onClick={handleCategoryChange}
                  selected={newService.categoryid === "personal-finance"}
                />
                <CategoryCard
                  label="Financial Planning"
                  id="financial-planning"
                  icon={
                    <IconCalendarEvent
                      color={"white"}
                      stroke={1.25}
                      size={"28px"}
                      id="financial-planning"
                    />
                  }
                  onClick={handleCategoryChange}
                  selected={newService.categoryid === "financial-planning"}
                />
                <CategoryCard
                  label="Investing"
                  id="investing"
                  icon={
                    <IconPlant
                      color={"white"}
                      stroke={1.25}
                      size={"28px"}
                      id="investing"
                    />
                  }
                  onClick={handleCategoryChange}
                  selected={newService.categoryid === "investing"}
                />
                <CategoryCard
                  label="Taxes"
                  id="taxes"
                  icon={
                    <IconReceiptTax
                      color={"white"}
                      stroke={1.25}
                      size={"28px"}
                      id="taxes"
                    />
                  }
                  onClick={handleCategoryChange}
                  selected={newService.categoryid === "taxes"}
                />
              </Stack>
            </SubsectionWrapper>
            {/* SUBCATEGORY SELECTION */}
            {!emptyList && !!newService.categoryid ? (
              <SubsectionWrapper
                title={
                  "That is tailored towards... " +
                  new String(newService.displaySubcategory)
                }
                titleStyle={{ fontWeight: "normal", fontStyle: "italic" }}
                mb={2}
                mt={4}
              >
                <Stack
                  direction="row"
                  sx={{ justifyContent: "center", flexWrap: "wrap" }}
                >
                  {subcategoryOptions.map((pair) => {
                    return (
                      <SubcategoryButton
                        id={pair[0]}
                        label={pair[1]}
                        key={pair[0]}
                        onClick={handleSubcategoryChange}
                        selected={newService.subcategoryid === pair[0]}
                      />
                    );
                  })}
                </Stack>
              </SubsectionWrapper>
            ) : (
              <p></p>
            )}
          </>
        )}
      </GenericPage>
    </>
  );
};

export default NewService;
