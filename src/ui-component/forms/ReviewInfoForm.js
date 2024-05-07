import React, { useEffect, useState } from "react";

// material-ui
import { makeStyles } from "@material-ui/styles";
import {
  Grid,
  TextField,
  FormControl,
  Stack,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";

// third party
import { Formik } from "formik";

// local imports
import { gridSpacing } from "store/constant";
import CancelButton from "ui-component/buttons/CancelButton";
import PrimaryActionButton from "ui-component/buttons/PrimaryActionButton";
import MyInputBase from "./inputs/MyInputBase";

// style constant
const useStyles = makeStyles((theme) => ({
  labelText: {
    color: theme.palette.grey["800"],
  },
  valueText: {
    marginTop: "12px",
  },
  form: {
    marginTop: "24px",
  },
}));

//= ==============================|| TICKETDATA ||===============================//

const TicketData = (props) => {
  const classes = useStyles();

  // state for validating if user has reviewed and confirmed the information provided.
  const [checked, setChecked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [inputObj, setInputObj] = useState({});
  const [formObjList, setFormObjList] = useState([]);

  useEffect(() => {
    Object.entries(props.userInput).map(([key, value]) => {
      Object.entries(value).map(([key2, value2]) => {
        setInputObj((prevState) => ({
          ...prevState,
          [key2]: value2,
        }));
      });
    });
    if (props.multisection) {
      let temp = [];
      props.form.map((section) => {
        section.questions.map((question) => {
          temp.push(question);
        });
      });
      setFormObjList(temp);
    } else {
      setFormObjList(props.form);
    }
    setIsLoading(false);
  }, [props.form]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Formik>
          {(formik) => (
            <form noValidate onSubmit={formik.handleSubmit}>
              <Grid container spacing={gridSpacing}>
                {formObjList.map((input) => {
                  return (
                    <Grid item xs={6} key={input.id}>
                      {!!props.inputbase ? (
                        <MyInputBase
                          fullWidth
                          formik={formik}
                          id={input.id}
                          name={input.id}
                          key={input.id}
                          label={input.title}
                          value={inputObj[input.id]}
                          readOnly={true}
                        />
                      ) : (
                        <TextField
                          fullWidth
                          formik={formik}
                          id={input.id}
                          name={input.id}
                          key={input.id}
                          label={input.title}
                          value={inputObj[input.id]}
                          readOnly={true}
                        />
                      )}
                    </Grid>
                  );
                })}
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    spacing={1}
                    mb={2}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={checked}
                          onChange={(event) => setChecked(event.target.checked)}
                          name="checked"
                          color="primary"
                        />
                      }
                      sx={{ color: "primary" }}
                      label="I have reviewed the information and confirm that it is correct."
                    />
                  </Stack>

                  <FormControl>
                    {" "}
                    <CancelButton
                      onClick={() => props.handleBack()}
                      name="Back"
                    />
                  </FormControl>
                  {props.canGoNext && (
                    <FormControl>
                      <PrimaryActionButton
                        name="Next"
                        disabled={!checked}
                        onClick={() => props.handleNext()}
                      />
                    </FormControl>
                  )}
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      )}
    </>
  );
};

export default TicketData;
