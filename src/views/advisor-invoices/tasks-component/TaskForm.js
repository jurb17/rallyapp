import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Grid, InputAdornment } from "@material-ui/core";

// third party
import { Formik } from "formik";
import { gridSpacing } from "store/constant";

// project imports
import MainCard from "ui-component/cards/MainCard";
import MySelectInput from "ui-component/forms/inputs/MySelectInput";
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import MyNumberInput from "ui-component/forms/inputs/MyNumberInput";

// style constant
const useStyles = makeStyles((theme) => ({
  card: {
    display: "grid",
    backgroundColor: theme.palette.secondary.light,
    border: "1px solid",
    borderColor: theme.palette.secondary.dark,
    color: theme.palette.grey["900"],
    overflow: "hidden",
    position: "relative",
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: 1,
  },
  content: {
    padding: theme.spacing(3),
    marginTop: theme.spacing(-2),
  },
}));

//============================|| CUSTOM FIELD FORM ||============================//

const TaskForm = (props, { ...others }) => {
  const classes = useStyles();

  // input data states
  const [description, setDescription] = React.useState("");
  const [attribute, setAttribute] = React.useState("");
  const [canSubmit, setCanSubmit] = React.useState(false);

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
    if (event.target.value > 0 && event.target.value > 0) setCanSubmit(true);
  };
  const handleAttributeChange = (event) => {
    setAttribute(event.target.value);
    if (event.target.value > 0 && event.target.value > 0) setCanSubmit(true);
  };

  const onSubmitHandler = (event) => {
    // event.preventDefault();
    props.forwardedTaskFormRef.current.validateForm();
    if (props.forwardedTaskFormRef.current.isValid) {
      props.handleAddTaskSave(description, attribute);
      props.forwardedTaskFormRef.current.resetForm();
      setCanSubmit(false);
    } else console.log("error: task form is invalid.");
  };

  return (
    <MainCard
      className={classes.card}
      contentClass={classes.content}
      height="100%"
    >
      <Box>
        <Box sx={{ mb: 2 }}>
          <h3 className={classes.title}>
            <em>Add New Line Item</em>
          </h3>
        </Box>
        <Formik
          innerRef={props.forwardedTaskFormRef}
          initialValues={{
            description: "",
            attribute: "",
          }}
          validationSchema={props.validationSchema}
        >
          {(formik) => (
            <form noValidate>
              <Grid
                container
                fullWidth
                flex="true"
                justifyItems="center"
                spacing={gridSpacing}
              >
                <Grid item flex="true" flexGrow={1}>
                  <Grid container direction="row" spacing={gridSpacing}>
                    <MyTextInput
                      xs={12}
                      sm={
                        props.attributeType === undefined ||
                        props.attributeType === null
                          ? 12
                          : 9
                      }
                      formik={formik}
                      id="description"
                      label={props.descriptionLabel}
                      value={formik.values.description}
                      onChange={(e) => {
                        formik.handleChange(e);
                        handleDescriptionChange(e);
                      }}
                    />
                    {props.attributeType === "select" ? (
                      <MySelectInput
                        xs={12}
                        sm={3}
                        formik={formik}
                        id="attribute"
                        label={props.attributeLabel}
                        value={formik.values.attribute}
                        options={props.attributeOptions}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleAttributeChange(e);
                        }}
                      />
                    ) : props.attributeType === "text" ? (
                      <MyTextInput
                        xs={12}
                        sm={3}
                        formik={formik}
                        id="attribute"
                        label={props.attributeLabel}
                        value={formik.values.attribute}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleAttributeChange(e);
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            {props.startAdornment}
                          </InputAdornment>
                        }
                      />
                    ) : props.attributeType === "number" ? (
                      <MyNumberInput
                        xs={12}
                        sm={3}
                        formik={formik}
                        id="attribute"
                        label={props.attributeLabel}
                        value={formik.values.attribute}
                        onChange={(e) => {
                          formik.handleChange(e);
                          handleAttributeChange(e);
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            {props.startAdornment}
                          </InputAdornment>
                        }
                      />
                    ) : (
                      <p></p>
                    )}
                  </Grid>
                </Grid>
                <Grid item>
                  <SecondaryActionButton
                    name="Add"
                    disabled={!canSubmit}
                    onClick={() => {
                      formik.handleSubmit();
                      onSubmitHandler();
                    }}
                    mt={0.5}
                  />
                </Grid>
              </Grid>{" "}
            </form>
          )}
        </Formik>
      </Box>
    </MainCard>
  );
};

export default TaskForm;
