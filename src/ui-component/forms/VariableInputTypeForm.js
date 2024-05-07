import React, { useEffect, useRef } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";

// project imports
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import MyNumberInput from "ui-component/forms/inputs/MyNumberInput";
import MySelectInput from "ui-component/forms/inputs/MySelectInput";
import MyMultiSelectInput from "ui-component/forms/inputs/MyMultiSelectInput";

// style constant
const useStyles = makeStyles((theme) => ({
  subtitle: {
    fontWeight: "normal",
    marginTop: "8px",
    marginBottom: "32px",
  },
}));

// =============================================================
/* PROPS MAP
key = key prop for avoiding that one error
sectionName = name displayed as header for the section
formObj = object with form keys and values
configObj = object with configuration details for each field by key
readOnly = boolean to determine if the form is readOnly
handleInputChange = function to handle input change
*/

const VariableInputTypeForm = (props, { ...others }) => {
  const classes = useStyles();
  const formRef = useRef({});

  let initialValues = {};
  // props: formObj, props.configObj;
  Object.entries(props.formObj).map(([key, value]) => {
    // check if there is a config for this field
    if (Object.keys(props.configObj).includes(key)) {
      // if there is a config, check if the field is a single or multi select
      if (typeof value === "object" && Array.isArray(value)) {
        // THIS IS A MULTI SELECT
        let displayList = [];
        props.formObj[key].forEach((response) => {
          props.configObj[key].forEach((pair) => {
            if (pair[1].toLowerCase() === response.toLowerCase()) {
              displayList.push(pair[0]);
            }
          });
        });
        initialValues[key] = displayList;
      } else {
        // THIS IS A SINGLE SELECT
        props.configObj[key].forEach((pair) => {
          if (pair[1].toLowerCase() === props.formObj[key].toLowerCase()) {
            initialValues[key] = pair[0];
          }
        });
      }
    } else {
      // if there is no config, enter the value as is
      initialValues[key] = value;
    }
  });

  // determine the type of input to use, props: formObj, props.configObj;
  const configureFormInput = () => {
    Object.entries(props.formObj).map(([key, value]) => {
      // check if there is a config for this field
      if (Object.keys(props.configObj).includes(key)) {
        // if there is a config, check if the field is a single or multi select
        if (typeof value === "object" && Array.isArray(value)) {
          // THIS IS A MULTI SELECT
          let displayList = [];
          props.formObj[key].forEach((response) => {
            props.configObj[key].forEach((pair) => {
              if (pair[1].toLowerCase() === response.toLowerCase()) {
                displayList.push(pair[0]);
              }
            });
          });
          formRef.current.setFieldValue(key, displayList);
        } else {
          // THIS IS A SINGLE SELECT
          props.configObj[key].forEach((pair) => {
            if (pair[1].toLowerCase() === props.formObj[key].toLowerCase()) {
              formRef.current.setFieldValue(key, pair[0]); // name is at index 0 and ID at index 1
            }
          });
        }
      }
    });
  };

  // handle change in section data. Restores previous and next states.
  useEffect(() => {
    formRef.current.setErrors({});
    configureFormInput();
  }, [props.formObj]);

  // pass back changes to parent
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    props.handleInputChange(props.sectionName, name, value);
  };
  // pass back changes to parent (for 401 and 402 types)
  const listInputChangeHandler = (e, list) => {
    const { name, value } = e.target;
    list.forEach((pair) => {
      if (pair[0] === value) {
        const optionId = pair[1];
        props.handleInputChange(props.sectionName, name, optionId);
      }
    });
  };
  // pass back changes to parent (for 403 and 404 types)
  const multiListInputChangeHandler = (e, list) => {
    const { name, value } = e.target;
    let idlist = [];
    value.forEach((val) => {
      list.forEach((pair) => {
        if (pair[0] === val) {
          idlist.push(pair[1]);
        }
      });
    });
    props.handleInputChange(props.sectionName, name, idlist);
  };

  return (
    <>
      <Formik initialValues={initialValues} innerRef={formRef}>
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <Grid container spacing={2}>
              {Object.entries(props.formObj).map(([key, value]) => {
                // check if there is a config for this field
                if (Object.keys(props.configObj).includes(key)) {
                  // if there is a config, check if the field is a single or multi select
                  if (typeof value === "object" && Array.isArray(value)) {
                    // THIS IS A MULTI SELECT
                    return (
                      <MyMultiSelectInput
                        xs={3}
                        formik={formik}
                        key={key}
                        id={key}
                        label={key}
                        idlist={props.formObj[key]}
                        // value={props.formObj[key]}
                        readOnly={props.readOnly}
                        options={props.configObj[key]}
                        onChange={(e) => {
                          formik.handleChange(e);
                          multiListInputChangeHandler(e, props.configObj[key]);
                        }}
                      />
                    );
                  } else {
                    // THIS IS A SINGLE SELECT
                    return (
                      <MySelectInput
                        xs={3}
                        formik={formik}
                        key={key}
                        id={key}
                        label={key}
                        // value={props.formObj[key]}
                        readOnly={props.readOnly}
                        options={props.configObj[key].map(
                          (answer) => answer[0]
                        )}
                        onChange={(e) => {
                          formik.handleChange(e);
                          listInputChangeHandler(e, props.configObj[key]);
                        }}
                      />
                    );
                  }
                } else {
                  // if there is no config, check the type of the input value to determine the field
                  // possible types: "string", "number", "boolean", "object", "function"
                  if (typeof value === "number") {
                    // THIS IS A NUMBER INPUT
                    return (
                      <MyNumberInput
                        xs={3}
                        formik={formik}
                        key={key}
                        id={key}
                        label={key}
                        value={props.formObj[key]}
                        readOnly={props.readOnly}
                        onChange={(e) => {
                          formik.handleChange(e);
                          inputChangeHandler(e);
                        }}
                      />
                    );
                  } else if (
                    typeof value === "string" ||
                    typeof value === "boolean" ||
                    typeof value === "object"
                  ) {
                    // THIS IS A TEXT INPUT
                    return (
                      <MyTextInput
                        xs={3}
                        formik={formik}
                        key={key}
                        id={key}
                        label={key}
                        value={props.formObj[key]}
                        readOnly={props.readOnly}
                        onChange={(e) => {
                          formik.handleChange(e);
                          inputChangeHandler(e);
                        }}
                      />
                    );
                  } else {
                    // CATCH ALL
                    return (
                      <MyTextInput
                        xs={3}
                        formik={formik}
                        key={key}
                        id={key}
                        label={key}
                        value={props.formObj[key]}
                        readOnly={props.readOnly}
                        onChange={(e) => {
                          formik.handleChange(e);
                          inputChangeHandler(e);
                        }}
                      />
                    );
                  }
                }
              })}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default VariableInputTypeForm;
