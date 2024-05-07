import React from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import { Box, Grid, FormControl } from "@material-ui/core";

// third party
import { taskFormSchema } from "utils/Validation";
import { Formik } from "formik";
import { gridSpacing } from "store/constant";

// project imports
import MainCard from "ui-component/cards/MainCard";
import MySelectInput from "ui-component/forms/inputs/MySelectInput";
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";

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
    marginBottom: "16px",
  },
  title: {
    marginBottom: 1,
  },
  content: {
    padding: "20px !important",
  },
  formButton: {
    justifySelf: "end",
  },
}));

//= ===========================|| CUSTOM FIELD FORM ||============================//

const TaskForm = (props, { ...others }) => {
  const classes = useStyles();

  const deliverableOptions = ["File", "Meeting"];

  // set the state to handle for input
  const initialValues = {
    title: "",
    deliverable: "",
  };

  const onSubmitHandler = (event) => {
    props.handleAddTaskSave();
    props.forwardedTaskFormRef.current.resetForm();
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
            <em>Add New Task</em>
          </h3>
        </Box>
        <Formik
          innerRef={props.forwardedTaskFormRef}
          initialValues={initialValues}
          validationSchema={taskFormSchema}
        >
          {(formik) => (
            <form noValidate>
              <Grid container flex="true" spacing={gridSpacing}>
                <MyTextInput
                  xs={6}
                  formik={formik}
                  id="title"
                  label="Task Name"
                  value={formik.values.title}
                />
                <MySelectInput
                  xs={6}
                  formik={formik}
                  id="deliverable"
                  label="Deliverable"
                  value={formik.values.deliverable}
                  options={deliverableOptions}
                  onChange={formik.handleChange}
                />
                <Grid
                  container
                  justifyContent="flex-start"
                  sx={{
                    display: "flex",
                    paddingTop: 2,
                    paddingLeft: 3,
                  }}
                >
                  <Grid item>
                    <SecondaryActionButton
                      name="Add Task"
                      onClick={() => {
                        formik.handleSubmit();
                        onSubmitHandler();
                      }}
                      disabled={formik.isSubmitting}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </Box>
    </MainCard>
  );
};

export default TaskForm;
