import React, { useEffect, useMemo, useState } from "react";

// material-ui
import { Grid, Box } from "@material-ui/core";

// third party
import { categoriesFormSchema } from "utils/Validation";
import { Formik } from "formik";

// assets
import { gridSpacing } from "store/constant";
import MySelectInput from "ui-component/forms/inputs/MySelectInput";
import PagePlaceholderText from "ui-component/extended/PagePlaceholderText";

// ==============================================================
/* PROPS MAP
forwardedCategoriesFormRef = ref to CategoriesForm
categoryid = string of category id
subcategoryid = string
category = string of display value for category
subcategory = string of display value for subcategory
handleCategoryChange = function to handle category input change
handleSubcategoryChange = function to handle subcategory input change
*/

const CategoriesForm = (props) => {
  const [categorySelected, setCategorySelected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!!props.categoryid) {
      setCategorySelected(true);
    }
    setIsLoading(false);
  }, []);

  // handle input change
  const handleCategory = (e) => {
    const { value } = e.target;
    setCategorySelected(true);
    props.forwardedCategoriesFormRef.current.setFieldValue("subcategory", "");
    props.handleCategoryChange(value);
  };
  const handleSubcategory = (e) => {
    const { value } = e.target;
    props.handleSubcategoryChange(value);
  };

  return (
    <>
      <Grid item xs={12}>
        {isLoading ? (
          <Box className="horizontal-center">
            <PagePlaceholderText text="Loading..." />
          </Box>
        ) : (
          <Formik
            innerRef={props.forwardedCategoriesFormRef}
            initialValues={{
              category: props.category,
              subcategory: props.subcategory,
            }}
            validationSchema={categoriesFormSchema}
          >
            {(formik) => (
              <form noValidate onSubmit={formik.handleSubmit}>
                <Grid container spacing={gridSpacing}>
                  <MySelectInput
                    xs={12}
                    sm={6}
                    formik={formik}
                    key="category"
                    id="category"
                    label="Select Category"
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleCategory(e);
                    }}
                    onBlur={formik.handleBlur}
                    options={props.categoryOptions.map((cat) => cat[0])}
                  />
                  <MySelectInput
                    xs={12}
                    sm={6}
                    formik={formik}
                    key="subcategory"
                    id="subcategory"
                    label="Select Subcategory"
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleSubcategory(e);
                    }}
                    disabled={!categorySelected}
                    onBlur={formik.handleBlur}
                    options={props.subcategoryOptions.map(
                      (subCat) => subCat[0]
                    )}
                    helpertext={
                      !categorySelected ? "Please select a category first" : ""
                    }
                  />
                </Grid>
              </form>
            )}
          </Formik>
        )}
      </Grid>
    </>
  );
};

export default CategoriesForm;
