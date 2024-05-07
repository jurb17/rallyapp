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
import advisoryService from "services/advisory.service";
import ConfirmPrimaryModal from "ui-component/modals/ConfirmPrimaryModal";
import GenericPage from "ui-component/pages/GenericPage";
import SubsectionWrapper from "ui-component/wrappers/SubsectionWrapper";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";
import { showSnackbar, showEditBanner } from "actions/main";
import CategoryCard from "ui-component/cards/CategoryCard";
import SubcategoryButton from "ui-component/buttons/SubcategoryButton";

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
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);

  // mode states
  const [isLoading, setIsLoading] = useState(true);
  const [categoryPairExists, setCategoryPairExists] = useState(false);
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
            setIsLoading(false);
            resolve(catmap.subcategories);
          } else {
            dispatch(showSnackbar(response.data.details.text, true, "error"));
            setIsLoading(false);
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
          setIsLoading(false);
          reject(error.message);
        });
    });
  };

  useEffect(async () => {
    dispatch(showEditBanner(true, "Creating new service..."));
    // get the form data
    await getAllCats();
  }, []);
  // handle canContinue mode
  useEffect(() => {
    if (!!newService.categoryid) {
      setCanContinue(true);
    } else {
      setCanContinue(false);
    }
  }, [newService.categoryid, newService.subcategoryid]);

  // get service data from the server
  const getServiceData = async () => {
    return new Promise(async (resolve, reject) => {
      if (!newService.subcategoryid) {
        await advisoryService
          .getService({ category: newService.categoryid })
          .then((response) => {
            if (!!response.data.payload.success) {
              resolve(response.data.payload.service);
            } else {
              reject(response.data.details.text);
            }
          })
          .catch((error) => {
            reject(error.message);
          });
      } else {
        await advisoryService
          .getServiceNiche({
            category: newService.categoryid,
            subcategory: newService.subcategoryid,
          })
          .then((response) => {
            if (!!response.data.payload.success) {
              resolve(response.data.payload.service);
            } else {
              reject(response.data.details.text);
            }
          })
          .catch((error) => {
            reject(error.message);
          });
      }
    });
  };

  // handle next: check if the category and subcategory pair already exists.
  const handleNext = async () => {
    await getServiceData()
      .then((response) => {
        // if the pair already exists, show a modal to confirm
        if (!!response) {
          setNewService({
            ...newService,
            displayCategory: response.category,
            displaySubcategory: response.subcategory,
            categoryid: response.id.split("/")[0],
            subcategoryid: response.id.split("/")[1],
            title: response.title,
            description: response.description,
            deltas: response.deltas,
          });
          setCategoryPairExists(true);
          setIsLoading(false);
        }
        // if pair does not exist, continue to the next page
        else {
          let serviceid;
          if (!!newService.subcategoryid) {
            serviceid = newService.categoryid + "." + newService.subcategoryid;
          } else {
            serviceid = newService.categoryid;
          }
          navigate(`/adv/services/${serviceid}`, {
            state: {
              serviceExists: false,
              category: newService.displayCategory,
              subcategory: newService.displaySubcategory,
            },
          });
          setIsLoading(false);
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
        setIsLoading(false);
      });
  };
  // handle change selection
  const handleChangeSelection = () => {
    setCategoryPairExists(false);
    setCanContinue(false);
    setNewService({ ...initialState });
    categoriesFormRef.current.resetForm();
  };
  // handle edit existing service
  const handleEditExistingService = () => {
    let serviceid;
    if (!!newService.subcategoryid) {
      serviceid = newService.categoryid + "." + newService.subcategoryid;
    } else {
      serviceid = newService.categoryid;
    }
    navigate(`/adv/services/${serviceid}`, { state: { serviceExists: true } });
  };

  // HANDLING CATEGORIES FORM DATA =============================================
  // handle category selection
  const handleCategoryChange = (value) => {
    categoryOptions.forEach((pair) => {
      // find the matching category id
      if (pair[0] === value.target.innerText || pair[1] === value.target.id) {
        setSubcategoryOptions(categoryMap[pair[1]]); // should be a list of list pairs
        setNewService((prevState) => ({
          ...prevState,
          displayCategory: pair[0],
          categoryid: pair[1],
          displaySubcategory: "",
          subcategoryid: "",
        }));
      }
    });
  };
  // handle subcategory selection
  const handleSubcategoryChange = (value) => {
    // console.log("subcategory change", value);
    subcategoryOptions.forEach((pair) => {
      // find the matching subcategory id
      if (pair[0] === value.target.innerText || pair[1] === value.target.id) {
        setNewService((prevState) => ({
          ...prevState,
          displaySubcategory: pair[0],
          subcategoryid: pair[1],
        }));
      }
    });
  };

  // display buttons to cancel and submit, and form with questions in list.
  return (
    <>
      <ConfirmPrimaryModal
        handleCancel={handleChangeSelection}
        handleConfirm={handleEditExistingService}
        open={categoryPairExists}
        heading="Category/Subcategory Pair Exists"
        body="
          You have already created a service with this category/subcategory pair. Would like
          to view the existing service or make a
          different category/subcategory selection?"
        action="View Existing"
        nonaction="Change Selection"
      />
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
              // maybe add another attribute to make the text of the display category bold?
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
                        id={pair[1]}
                        label={pair[0]}
                        onClick={handleSubcategoryChange}
                        selected={newService.subcategoryid === pair[1]}
                      />
                    );
                  })}
                </Stack>
              </SubsectionWrapper>
            ) : (
              <p></p>
            )}

            {/* <SubsectionWrapper
              title="Select Service Categories"
              tipBody="Select the appropriate category and subcategory. These will be used to find your service."
              mb={2}
            >
              <CategoriesForm
                forwardedCategoriesFormRef={categoriesFormRef}
                categoryid={newService.categoryid}
                subcategoryid={newService.subcategoryid}
                category={newService.displayCategory}
                subcategory={newService.displaySubcategory}
                categoryOptions={categoryOptions}
                subcategoryOptions={subcategoryOptions}
                handleCategoryChange={handleCategoryChange}
                handleSubcategoryChange={handleSubcategoryChange}
              />
              <Box sx={{ mt: 1.5 }}>
                <NoteBanner>
                  You can only create one service per category/subcategory pair.
                  These categories are used to filter public content on the
                  platform. Make sure you select a category and subcategory that
                  is relevant to your service so it can be discovered easily.
                </NoteBanner>
              </Box>
            </SubsectionWrapper> */}
          </>
        )}
      </GenericPage>
    </>
  );
};

export default NewService;
