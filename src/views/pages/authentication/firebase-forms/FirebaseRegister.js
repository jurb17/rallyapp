import React, { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";

// material-ui
import { makeStyles, useTheme } from "@material-ui/styles";
import {
  Visibility,
  VisibilityOff,
  CheckCircleOutline,
} from "@material-ui/icons";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import Google from "assets/images/icons/social-google.svg";
import AnimateButton from "ui-component/extended/AnimateButton";

// local imports
import useScriptRef from "hooks/useScriptRef";
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";

// data and functions
import { strengthColor, strengthIndicator } from "utils/password-strength";
import { register } from "actions/auth";
import { attributesNavigation } from "utils/navigation";
import { showSnackbar } from "actions/main";

// style constant
const useStyles = makeStyles((theme) => ({
  redButton: {
    fontSize: "1rem",
    fontWeight: 500,
    backgroundColor: theme.palette.grey[50],
    border: "1px solid",
    borderColor: theme.palette.grey[100],
    color: theme.palette.text.primary,
    textTransform: "none",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "0.875rem",
    },
  },
  signDivider: {
    flexGrow: 1,
  },
  signText: {
    cursor: "unset",
    margin: theme.spacing(2),
    padding: "5px 56px",
    borderColor: `${theme.palette.grey[100]} !important`,
    color: `${theme.palette.grey[900]}!important`,
    fontWeight: 500,
  },
  loginIcon: {
    marginRight: "16px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "8px",
    },
  },
  loginInput: {
    ...theme.typography.customInput,
  },
  helperText: {
    color: theme.palette.error.main,
    marginTop: "-12px",
  },
}));

//= ==========================|| FIREBASE - REGISTER ||===========================//

const FirebaseRegister = (props, { ...others }) => {
  const classes = useStyles();
  const theme = useTheme();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const registerRef = useRef();

  // data and states
  const matchDownSM = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [agree, setAgree] = React.useState(false);
  const [strength, setStrength] = React.useState(0);
  const [level, setLevel] = React.useState("");

  // data states
  const [firstname, setFirstname] = React.useState("");
  const [lastname, setLastname] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  // validation states
  const [passwordMatch, setPasswordMatch] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [strongEnough, setStrongEnough] = React.useState(false);

  // handle show password
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  // handle firstname changes
  const handleFirstnameChange = (e) => {
    const { name, value } = e.target;
    setFirstname(value.trim());
  };

  // handle lastname changes
  const handleLastnameChange = (e) => {
    const { name, value } = e.target;
    setLastname(value.trim());
  };

  // handle password changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(value);
    // check password strength
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
    setStrength(temp);
    if (temp >= 40) {
      setStrongEnough(true);
    } else {
      setStrongEnough(false);
    }
    // check passwords match
    if (value === confirmPassword) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  // handle confirm password changes
  const handleConfirmPasswordChange = (e) => {
    const { name, value } = e.target;
    setConfirmPassword(value);
    // check passwords match
    if (value === password) {
      setPasswordMatch(true);
    } else {
      setPasswordMatch(false);
    }
  };

  // some sort of event listener
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // handle google sign in
  const googleHandler = async () => {
    console.error("Register");
  };

  // check if user was sent here without token and email props
  useEffect(() => {
    if (!props.token || !props.email) {
      navigate("/login");
    }
  }, []);

  return (
    <>
      {
        //#region "google sign in" (commented out)
      }
      {/* <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              className={classes.redButton}
              onClick={googleHandler}
              size="large"
              variant="contained"
            >
              <img
                src={Google}
                alt="google"
                width="20px"
                sx={{ mr: { xs: 1, sm: 2 } }}
                className={classes.loginIcon}
              />{" "}
              Sign up with Google
            </Button>
          </AnimateButton>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
            }}
          >
            <Divider className={classes.signDivider} orientation="horizontal" />
            <AnimateButton>
              <Button
                variant="outlined"
                className={classes.signText}
                sx={{ borderRadius: `${customization.borderRadius}px` }}
                disableRipple
                disabled
              >
                OR
              </Button>
            </AnimateButton>
            <Divider className={classes.signDivider} orientation="horizontal" />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          container
          alignItems="center"
          justifyContent="center"
        >
          <Box
            sx={{
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">
              Sign up with Email address
            </Typography>
          </Box>
        </Grid>
      </Grid> */}
      {
        //#endregion
      }
      <Formik
        innerRef={registerRef}
        initialValues={{
          firstname: "",
          lastname: "",
          email: props.email,
          password: "",
          confirmPassword: "",
        }}
        validationSchema={Yup.object().shape({
          firstname: Yup.string()
            .trim("First name cannot be empty")
            .max(255, "Must be less than 255 characters")
            .required("First name is required"),
          lastname: Yup.string()
            .trim("Last name cannot be empty")
            .max(255, "Must be less than 255 characters")
            .required("Last name is required"),
          password: Yup.string()
            .max(255, "Must be less than 255 characters")
            .required("Password is required"),
          confirmPassword: Yup.string()
            .max(255, "Must be less than 255 characters")
            .required("Must confirm password"),
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, validateForm, reactDomServer }
        ) => {
          if (scriptedRef.current) {
            setSubmitting(true);
            // check if form is valid
            const valid = await validateForm();
            if (!!valid) {
              if (!!strongEnough && !!passwordMatch && !!agree) {
                dispatch(
                  register(
                    firstname,
                    lastname,
                    props.email,
                    password,
                    props.token
                  )
                )
                  .then((response) => {
                    // there is no success message in the response
                    if (!!response.data.payload) {
                      setStatus({ success: true });
                      setSubmitting(false);
                      // if the user registers using a token without attributes, then they are a client
                      if (
                        !props.tokenPayload.attributes ||
                        Object.entries(props.tokenPayload.attributes).length ===
                          0
                      ) {
                        // if they do not have a firmslug param, navigate them to the advisor finder
                        if (!props.firmslug) {
                          navigate("/prospect/new");
                        }
                        // if they do have a firmslug param, navigatet them to the next spot (probably firm request)
                        else {
                          attributesNavigation(navigate, location, {
                            firmslug: props.firmslug,
                          });
                        }
                      }
                      // the user is an advisor
                      else {
                        attributesNavigation(navigate, location);
                      }
                      dispatch(
                        showSnackbar("Registration successful", true, "success")
                      );
                    } else {
                      dispatch(showSnackbar(response.data.details.text));
                      setErrors({ submit: response.data.details.text });
                      setStatus({ success: false });
                      setSubmitting(false);
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
                    setStatus({ success: false });
                    setErrors({ submit: error.message });
                    setSubmitting(false);
                  });
              } else {
                console.log(
                  "error: password is not strong enough, the passwords don't match, or you did not agree to the terms and conditions"
                );
              }
            } else {
              console.log("error: form is invalid");
            }
          }
        }}

        //#endregion
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
            <Grid container spacing={matchDownSM ? 0 : 2}>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(
                    touched.firstname && errors.firstname && !props.firstname
                  )}
                  className={classes.loginInput}
                >
                  <InputLabel htmlFor="firstname">First Name</InputLabel>
                  <OutlinedInput
                    id="firstname"
                    type="text"
                    value={values.firstname}
                    name="firstname"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      handleFirstnameChange(e);
                    }}
                  />
                  {touched.firstname && errors.firstname && !props.firstname && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text--register"
                    >
                      {" "}
                      {errors.firstname}{" "}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl
                  fullWidth
                  error={Boolean(
                    touched.lastname && errors.lastname && !props.lastname
                  )}
                  className={classes.loginInput}
                >
                  <InputLabel htmlFor="lastname">Last Name</InputLabel>
                  <OutlinedInput
                    id="lastname"
                    type="text"
                    value={values.lastname}
                    name="lastname"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                      handleLastnameChange(e);
                    }}
                  />
                  {touched.lastname && errors.lastname && !props.lastname && (
                    <FormHelperText
                      error
                      id="standard-weight-helper-text--register"
                    >
                      {" "}
                      {errors.lastname}{" "}
                    </FormHelperText>
                  )}
                </FormControl>
              </Grid>
            </Grid>
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email && !props.email)}
              className={classes.loginInput}
            >
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <OutlinedInput
                id="email"
                type="email"
                value={props.email}
                name="email"
                onBlur={handleBlur}
              />
              {touched.email && errors.email && !props.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text--register"
                >
                  {" "}
                  {errors.email}{" "}
                </FormHelperText>
              )}
            </FormControl>
            {/* password field */}
            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              className={classes.loginInput}
            >
              <InputLabel htmlFor="password">Password</InputLabel>
              <OutlinedInput
                id="password"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                label="Password"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handlePasswordChange(e);
                }}
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
              />
              {touched.password && errors.password && (
                <>
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-register"
                  >
                    {" "}
                    {errors.password}{" "}
                  </FormHelperText>
                  <FormHelperText
                    error
                    id="standard-weight-helper-text-password-strength"
                    size="small"
                    className={classes.helperText}
                  >
                    {" "}
                    _____{" "}
                  </FormHelperText>
                </>
              )}
              {touched.password && !strongEnough && (
                <>
                  <FormHelperText error id="requirements-password-helper-text">
                    {" "}
                    Password must contain:{" "}
                  </FormHelperText>
                  <FormHelperText error id="requirements-password-helper-text">
                    {" "}
                    - at least 8 characters <br />- one lower-case letter
                    <br />- one upper-case letter
                    <br />- one number
                    <br />- one special character.{" "}
                  </FormHelperText>
                </>
              )}
            </FormControl>
            {/* password strength */}
            {values.password.length > 0 && (
              <FormControl fullWidth>
                <Box
                  sx={{
                    mb: 2,
                  }}
                >
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
                        color={theme.palette.text.hint}
                      >
                        {level.label}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </FormControl>
            )}
            {/* confirm password field */}
            <FormControl
              fullWidth
              error={Boolean(touched.confirmPassword && errors.confirmPassword)}
              className={classes.loginInput}
            >
              <InputLabel htmlFor="confirmPassword">
                Confirm Password
              </InputLabel>
              <OutlinedInput
                id="confirmPassword"
                type={"password"}
                value={values.confirmPassword}
                name="confirmPassword"
                label="confirmPassword"
                onBlur={handleBlur}
                onChange={(e) => {
                  handleChange(e);
                  handleConfirmPasswordChange(e);
                }}
                endAdornment={
                  passwordMatch && (
                    <InputAdornment position="end">
                      <IconButton edge="end">
                        <CheckCircleOutline />
                      </IconButton>
                    </InputAdornment>
                  )
                }
              />
              {touched.confirmPassword && !passwordMatch && (
                <FormHelperText error>Passwords do not match.</FormHelperText>
              )}
            </FormControl>
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={agree}
                      onChange={(event) => setAgree(event.target.checked)}
                      name="checked"
                      color="secondary"
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle1"
                      color={theme.palette.text.hint}
                    >
                      Agree with &nbsp;
                      <a
                        style={{
                          fontSize: "0.875rem",
                          color: theme.palette.text.hint,
                        }}
                        href="https://www.rally.markets/policy/terms-of-service/"
                      >
                        Terms & Conditions&nbsp;
                      </a>
                      {" and "}
                      <a
                        style={{
                          fontSize: "0.875rem",
                          color: theme.palette.text.hint,
                        }}
                        href="https://www.rally.markets/policy/privacy-policy/"
                      >
                        Privacy Policy.
                      </a>
                    </Typography>
                  }
                />
              </Grid>
            </Grid>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
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

export default FirebaseRegister;
