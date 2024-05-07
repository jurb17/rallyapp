import React, { useEffect } from "react";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Box,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  Typography,
  useMediaQuery,
  Modal,
} from "@material-ui/core";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// MUI
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from "@material-ui/icons";

// project imports
import { strengthColor, strengthIndicator } from "utils/password-strength";
import CancelButton from "ui-component/buttons/CancelButton";
import PrimaryActionButton from "ui-component/buttons/PrimaryActionButton";
import MyTextInput from "ui-component/forms/inputs/MyTextInput";
import { gridSpacing } from "store/constant";
import accountService from "services/account.service";
import { showSnackbar } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({}));

//= ======================================================
// PROPS MAP
// open = boolean to open modal
// handleCancel = function to handle cancel button
// handleConfirm = function to handle confirm button

const ChangePassword = (props, { ...others }) => {
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [strength, setStrength] = React.useState(0);
  const [level, setLevel] = React.useState("");

  // show/hide password
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // password match
  const [passwordMatch, setPasswordMatch] = React.useState(false);
  const checkPasswordMatch = (password) => {
    if (password === formValues.newpassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };
  const checkPasswordMatchAgain = (password) => {
    if (password === formValues.confirmpassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  // check if password is new
  const [isNewPassword, setIsNewPassword] = React.useState(false);
  const checkNewPassword = (newpassword) => {
    if (newpassword !== formValues.password) {
      setIsNewPassword(true);
    } else {
      setIsNewPassword(false);
    }
  };

  // some sort of event listener
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // password strength indicator
  const [strongEnough, setStrongEnough] = React.useState(false);
  const changePassword = (value) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
    setStrength(temp);
  };
  useEffect(() => {
    if (strength >= 40) {
      setStrongEnough(true);
    } else {
      setStrongEnough(false);
    }
  }, [strength]);

  // form values as state
  const [formValues, setFormValues] = React.useState({
    password: "",
    newpassword: "",
    confirmpassword: "",
  });

  // handle change in form input
  const inputChangeHandler = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormValues((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  // when cancel button is selected.
  const handleCancel = () => {
    props.handleCancel();
    setFormValues({
      password: "",
      newpassword: "",
      confirmpassword: "",
    });
  };
  // when cancel button is selected.
  const handleConfirm = async () => {
    // send email to the user with a link to reset their password
    await accountService
      .postChangePassword({
        password: formValues.password,
        newpassword: formValues.newpassword,
      })
      .then((response) => {
        props.handleConfirm();
        dispatch(
          showSnackbar("Password updated successfully", true, "success")
        );
        setFormValues({
          password: "",
          newpassword: "",
          confirmpassword: "",
        });
      })
      .catch((error) => {
        console.log("error", error);
        alert(
          "Error changing password. Please try again or contact support if the issue persists."
        );
      });
  };

  return (
    <Modal open={props.open}>
      <Box className="modalStyle">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <h2>Change Password</h2>
          </Grid>
          <Grid item xs={12}>
            <Formik
              initialValues={formValues}
              validationSchema={Yup.object().shape({
                password: Yup.string().required("Password is required"),
                newpassword: Yup.string()
                  .max(255, "Password be 255 characters or less")
                  .required("Password is required"),
              })}
              onSubmit={(values, { setSubmitting }) => {
                setSubmitting(true);
                handleConfirm().then(() => {
                  setSubmitting(false);
                });
              }}
            >
              {(formik) => (
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={formik.handleSubmit}
                  {...others}
                >
                  <Grid
                    container
                    flex="true"
                    spacing={gridSpacing}
                    justifyContent="center"
                  >
                    <MyTextInput
                      formik={formik}
                      id="password"
                      name="password"
                      label="Current Password"
                      type="password"
                      value={formValues.password}
                      onChange={(e) => {
                        formik.handleChange(e);
                        inputChangeHandler(e);
                      }}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                    />

                    {/* new password field */}
                    <MyTextInput
                      formik={formik}
                      id="newpassword"
                      name="newpassword"
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      value={formValues.newpassword}
                      onChange={(e) => {
                        formik.handleChange(e);
                        inputChangeHandler(e);
                        changePassword(e.target.value);
                        checkNewPassword(e.target.value);
                        checkPasswordMatchAgain(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                          </IconButton>
                        </InputAdornment>
                      }
                    >
                      {formik.touched.newpassword && !isNewPassword && (
                        <FormHelperText error>
                          Must be a new password.
                        </FormHelperText>
                      )}
                      {formik.touched.newpassword && !strongEnough && (
                        <>
                          <FormHelperText
                            error
                            id="requirements-password-helper-text"
                          >
                            {" "}
                            Password must contain:{" "}
                          </FormHelperText>
                          <FormHelperText
                            error
                            id="requirements-password-helper-text"
                          >
                            {" "}
                            - at least 8 characters <br />- one lower-case
                            letter
                            <br />- one upper-case letter
                            <br />- one number
                            <br />- one special character.{" "}
                          </FormHelperText>
                        </>
                      )}
                      {/* password strength */}
                      {formValues.newpassword.length > 0 && (
                        <Grid item xs={12}>
                          <FormControl fullWidth>
                            <Box sx={{ mt: 1, flex: "true" }}>
                              <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                  <Box
                                    backgroundColor={level.color}
                                    sx={{
                                      width: 85,
                                      height: 8,
                                      borderRadius: "7px",
                                    }}
                                  />
                                </Grid>
                                <Grid item>
                                  <Typography
                                    variant="subtitle1"
                                    fontSize="0.75rem"
                                    // color={theme.palette.text.hint}
                                  >
                                    {level.label}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </Box>
                          </FormControl>
                        </Grid>
                      )}
                    </MyTextInput>

                    {/* confirm password field */}
                    <MyTextInput
                      formik={formik}
                      id="confirmpassword"
                      name="confirmpassword"
                      label="Confirm Password"
                      type="password"
                      value={formik.values.confirmpassword}
                      onChange={(e) => {
                        formik.handleChange(e);
                        inputChangeHandler(e);
                        checkPasswordMatch(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      autoComplete="off"
                      endAdornment={
                        passwordMatch && (
                          <InputAdornment position="end">
                            <IconButton edge="end">
                              <CheckCircleOutline />
                            </IconButton>
                          </InputAdornment>
                        )
                      }
                    >
                      {formik.touched.confirmpassword && !passwordMatch && (
                        <FormHelperText error>
                          New passwords do not match.
                        </FormHelperText>
                      )}
                    </MyTextInput>
                  </Grid>

                  {/* Button Area */}
                  <Grid
                    container
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      pt: 3,
                    }}
                  >
                    <Grid item xs={12} sm={6}>
                      <CancelButton onClick={handleCancel} name="Cancel" />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PrimaryActionButton
                        onClick={(e) => {
                          e.preventDefault();
                          formik.handleSubmit();
                        }}
                        name={!!formik.isSubmitting ? "Loading..." : "Submit"}
                        disabled={
                          formik.isSubmitting ||
                          !passwordMatch ||
                          !isNewPassword ||
                          level.label in ["Poor", "Weak"]
                        }
                      />
                    </Grid>
                  </Grid>
                </form>
              )}
            </Formik>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

export default ChangePassword;
