import React, { useState, useEffect } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { FormControl, Grid } from "@material-ui/core";

// third party
import { Formik } from "formik";
import { buildValidationSchema } from "utils/ValidationSchemaBuilder";

// project imports
import { gridSpacing } from "store/constant";
import CancelButton from "ui-component/buttons/CancelButton";
import PrimaryActionButton from "ui-component/buttons/PrimaryActionButton";
import FormInputErrorModal from "ui-component/modals/FormInputErrorModal";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import MyNumberInput from "ui-component/forms/inputs/MyNumberInput";
import MySelectInput from "ui-component/forms/inputs/MySelectInput";
import MyDateInput from "ui-component/forms/inputs/MyDateInput";
import MyMultiSelectInput from "ui-component/forms/inputs/MyMultiSelectInput";

// style constant
const useStyles = makeStyles((theme) => ({
  subtitle: {
    fontWeight: "normal",
    marginTop: "8px",
    marginBottom: "32px",
  },
}));

//= ==============================|| SURVEY - SURVEYSECTION ||===============================//

const VariableInputForm = (props, { ...others }) => {
  const classes = useStyles();

  // creating states
  const validationSchema = buildValidationSchema(props.formObj.questions);
  const [blockNext, setBlockNext] = useState(true);
  const [isInvalid, setIsInvalid] = useState(false);
  const [errorInfo, setErrorInfo] = useState({});
  const [defaultMessage, setDefaultMessage] = useState(null);

  // #region --- when the required fields are not empty, allow the user to go to the next section. Otherwise, disable the next button.
  let initialValues = {};
  let emptyRequiredFields = [];
  props.formObj.questions.map((question, index) => {
    initialValues[question.id] = props.userResponses[question.id];
    if (props.userResponses[question.id] === "") {
      emptyRequiredFields.push(question);
    }
  });

  useEffect(() => {
    if (emptyRequiredFields.length === 0) {
      setBlockNext(false);
    } else {
      setBlockNext(true);
    }
  }, [emptyRequiredFields]);

  // #endregion

  // handle change in section data. Restores previous and next states.
  useEffect(() => {
    setIsInvalid(false);
    setErrorInfo({});
    setDefaultMessage(null);
    props.forwardedFormRef.current.setErrors({});
    props.formObj.questions.forEach((question, index) => {
      if (question.dtype >= 401 && question.dtype < 403) {
        question.answers.forEach((pair) => {
          if (pair[1] === props.userResponses[question.id]) {
            props.forwardedFormRef.current.setFieldValue(question.id, pair[0]);
          }
        });
      } else if (question.dtype >= 403 && question.dtype < 500) {
        let displayList = [];
        props.userResponses[question.id].forEach((response) => {
          question.answers.forEach((pair) => {
            if (pair[1] === response) {
              displayList.push(pair[0]);
            }
          });
        });
        props.forwardedFormRef.current.setFieldValue(question.id, displayList);
      } else {
        props.forwardedFormRef.current.setFieldValue(
          question.id,
          props.userResponses[question.id]
        );
      }
    });
  }, [props.formObj.questions]);

  // handle errors
  const handleErrors = (errors) => {
    setErrorInfo(errors);
    setIsInvalid(true);
  };
  // handle going to next section
  const onNext = () => {
    props.handleNext();
    props.forwardedFormRef.current.resetForm();
  };

  // pass back changes to parent
  const inputChangeHandler = (e) => {
    const { name, value } = e.target;
    props.handleInputChange(name, value);
  };
  // pass back changes to parent (for 200 type questions)
  const numberInputChangeHandler = (e, dtype) => {
    const { name, value } = e.target;
    let newValue = value;
    if ([201, 202, 203].includes(dtype)) {
      newValue = parseInt(value);
    } else if ([204, 205].includes(dtype)) {
      newValue = parseFloat(value);
    }
    props.handleInputChange(name, newValue);
  };
  // pass back changes to parent (for 401 and 402 types)
  const listInputChangeHandler = (e, list) => {
    const { name, value } = e.target;
    list.forEach((pair) => {
      if (pair[0] === value) {
        const optionId = pair[1];
        props.handleInputChange(name, optionId);
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
    props.handleInputChange(name, idlist);
  };
  // when user confirms that they have seen the error modal.
  const handleErrorConfirmation = () => {
    setIsInvalid(false);
  };

  return (
    <>
      <FormInputErrorModal
        open={isInvalid}
        defaultMessage={defaultMessage}
        errorInfo={errorInfo}
        handleErrorConfirmation={handleErrorConfirmation}
      />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        innerRef={props.forwardedFormRef}
      >
        {(formik) => (
          <form noValidate onSubmit={formik.handleSubmit} {...others}>
            <Grid container spacing={gridSpacing}>
              {props.formObj.questions.map((question, index) => {
                // Render Text Type question
                if (question.dtype >= 100 && question.dtype < 200) {
                  return (
                    <MyTextInput
                      formik={formik}
                      key={index}
                      id={question.id}
                      label={question.title}
                      value={props.userResponses[question.id]}
                      onChange={(e) => {
                        formik.handleChange(e);
                        inputChangeHandler(e);
                      }}
                    />
                  );
                }
                // Render Number Type Question
                if (question.dtype >= 200 && question.dtype < 300) {
                  return (
                    <MyNumberInput
                      formik={formik}
                      key={index}
                      id={question.id}
                      label={question.title}
                      value={props.userResponses[question.id]}
                      onChange={(e) => {
                        formik.handleChange(e);
                        numberInputChangeHandler(e, parseInt(question.dtype));
                      }}
                    />
                  );
                }
                // Render Boolean Type Question
                if (question.dtype >= 300 && question.dtype < 400) {
                  return (
                    <MySelectInput
                      formik={formik}
                      key={index}
                      id={question.id}
                      label={question.title}
                      value={props.userResponses[question.id]}
                      options={["yes", "no"]}
                      onChange={(e) => {
                        formik.handleChange(e);
                        inputChangeHandler(e);
                      }}
                    />
                  );
                }
                // Render Select Type Question
                if (question.answers.length > 0) {
                  switch (question.dtype) {
                    case 401:
                    case 402:
                      return (
                        // single select
                        <MySelectInput
                          formik={formik}
                          key={index}
                          id={question.id}
                          label={question.title}
                          // value={props.userResponses[question.id]}
                          options={question.answers.map((answer) => answer[0])}
                          onChange={(e) => {
                            formik.handleChange(e);
                            listInputChangeHandler(e, question.answers);
                          }}
                        />
                      );
                    case 403:
                    case 404:
                      return (
                        // multi select
                        <MyMultiSelectInput
                          formik={formik}
                          key={index}
                          id={question.id}
                          label={question.title}
                          idlist={props.userResponses[question.id]}
                          // value={props.userResponses[question.id]}
                          options={question.answers}
                          onChange={(e) => {
                            formik.handleChange(e);
                            multiListInputChangeHandler(e, question.answers);
                          }}
                        />
                      );
                    default:
                      return null;
                  }
                }
                // Render Date Type Question
                if (question.dtype >= 600 && question.dtype < 700) {
                  return (
                    <MyDateInput
                      formik={formik}
                      key={index}
                      id={question.id}
                      label={question.title}
                      value={props.userResponses[question.id]}
                      calendarString={true}
                      onChange={(date) => {
                        formik.setFieldValue(question.id, date);
                        inputChangeHandler({
                          target: {
                            name: question.id,
                            value: date,
                          },
                        });
                      }}
                    />
                  );
                }
                // If the question type does not fall within one of the ranges above, then it is a text input.
                return (
                  <MyTextInput
                    formik={formik}
                    key={index}
                    id={question.id}
                    label={question.title}
                    value={props.userResponses[question.id]}
                    onChange={(e) => {
                      formik.handleChange(e);
                      inputChangeHandler(e);
                    }}
                  />
                );
              })}
              {props.multiPage && (
                <Grid item xs={12}>
                  {props.canGoBack && (
                    <FormControl>
                      <CancelButton
                        onClick={() => props.handleBack()}
                        name="Back"
                      />
                    </FormControl>
                  )}
                  {props.canGoNext && (
                    <FormControl>
                      <PrimaryActionButton
                        name="Next"
                        disabled={blockNext}
                        onClick={() =>
                          formik
                            .validateForm()
                            .then(() => {
                              if (formik.isValid) {
                                onNext();
                              } else {
                                handleErrors(formik.errors);
                              }
                            })
                            .catch(() => {
                              handleErrors(formik.errors);
                            })
                        }
                      />
                    </FormControl>
                  )}
                </Grid>
              )}
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default VariableInputForm;
