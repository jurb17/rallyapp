import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@material-ui/core";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// local imports
import useScriptRef from "hooks/useScriptRef";
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";

// data and functions
import adviceService from "services/advice.service";
import { showSnackbar } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({
  loginInput: {
    ...theme.typography.customInput,
  },
  helperText: {
    color: theme.palette.error.main,
    marginTop: "-12px",
  },
}));

// =====================================================

const SignupForm = (props, { ...others }) => {
  const classes = useStyles();
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signupRef = useRef();

  // some sort of event listener
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // handle google sign in
  const googleHandler = async () => {
    console.error("Register");
  };

  return (
    <>
      <Formik
        innerRef={signupRef}
        initialValues={{
          email: "",
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, validateForm, reactDomServer }
        ) => {
          try {
            if (scriptedRef.current) {
              // check if form is valid
              const valid = await validateForm();
              if (valid) {
                adviceService
                  .postSignup({ email: values.email, firmslug: props.firmslug })
                  .then((response) => {
                    if (!!response.data.payload.success) {
                      setStatus({ success: true });
                      dispatch(
                        showSnackbar("Signup successful.", true, "success")
                      );
                      navigate("/signup/success");
                    } else {
                      dispatch(
                        showSnackbar(response.data.payload.text, true, "error")
                      );
                      setErrors({ submit: response.data.details.text });
                      setStatus({ success: false });
                    }
                    setSubmitting(false);
                  });
              } else {
                dispatch(
                  showSnackbar(
                    "Please enter a valid email address.",
                    true,
                    "warning"
                  )
                );
                console.log("error: form is invalid");
              }
            }
          } catch (err) {
            console.log("error: submission failed.");
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({
          errors,
          handleBlur,
          handleChange,
          handleSubmit,
          isSubmitting,
          touched,
          values,
        }) => (
          <form noValidate onSubmit={handleSubmit} {...others}>
            {/* email input */}
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              className={classes.loginInput}
            >
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {" "}
                  {errors.email}{" "}
                </FormHelperText>
              )}
            </FormControl>
            <SecondaryActionButton
              type="submit"
              disabled={isSubmitting}
              name="Sign up"
              mt={2}
              mb={-0.5}
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default SignupForm;
