import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

// material-ui
import { makeStyles } from "@material-ui/styles";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {
  Box,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@material-ui/core";

// third party
import * as Yup from "yup";
import { Formik } from "formik";
import useScriptRef from "hooks/useScriptRef";
// import Google from 'assets/images/icons/social-google.svg';
// import { CameraEnhanceSharp } from '@material-ui/icons';

// components
import SecondaryActionButton from "ui-component/buttons/SecondaryActionButton";
import SecondaryTextButton from "ui-component/buttons/SecondaryTextButton";

// functions and data
import { login } from "actions/auth";
import { useNavigate } from "react-router";
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
}));

// ===========================|| FIREBASE - LOGIN ||============================//

const FirebaseLogin = (props, { ...others }) => {
  const classes = useStyles();
  const scriptedRef = useScriptRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // get attributes for detrmining the nvaigation path
  const auth = useSelector((state) => state.auth);

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  // handle google authentication
  const googleHandler = async () => {
    console.error("Login");
  };
  // handle show password toggle
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  // handle show password button clicke event
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <>
      {
        //#region
      }
      {/* <Grid container direction="column" justifyContent="center" spacing={2}>
        <Grid item xs={12}>
          <AnimateButton>
            s
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
                className={classes.loginIcon}
              />{" "}
              Sign in with Google
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
              Sign in with Email address: {accesstoken}
            </Typography>
          </Box>
        </Grid>
      </Grid> */}
      {
        //#endregion
      }
      <Formik
        initialValues={{
          email: "",
          password: "",
          submit: null,
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string() // OWASP
            .matches(
              /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/,
              "Must be a valid email address"
            )
            .max(255)
            .required("Email is required"),
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={async (
          values,
          { setErrors, setStatus, setSubmitting, reactDomServer }
        ) => {
          if (scriptedRef.current) {
            setSubmitting(true);
            await dispatch(login(values.email, values.password, rememberMe))
              .then((response) => {
                // if (response.data.details.status === 2) {
                if (!!response.data.payload.success) {
                  setStatus({ success: true });
                  setSubmitting(false);
                  // redirect user based on attributes.
                  attributesNavigation(navigate, location);
                } else if (response.isAxiosError) {
                  dispatch(
                    showSnackbar(
                      response.response.data.details.text,
                      true,
                      "error"
                    )
                  );
                  setErrors({
                    submit:
                      "Problem signing you in. Please check your credentials.",
                  });
                  setStatus({ success: false });
                  setSubmitting(false);
                } else {
                  dispatch(
                    showSnackbar("Invalid email or password", true, "error")
                  );
                  setErrors({ submit: "Invalid email or password" });
                  setStatus({ success: false });
                  setSubmitting(false);
                }
              })
              .catch((error) => {
                console.log("error", error);
                setStatus({ success: false });
                setErrors({
                  submit:
                    "Problem signing you in. Please check your credentials.",
                });
                setSubmitting(false);
              });
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
            <FormControl
              fullWidth
              error={Boolean(touched.email && errors.email)}
              className={classes.loginInput}
            >
              <InputLabel htmlFor="outlined-adornment-email-login">
                Email Address
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-email-login"
                type="email"
                value={values.email}
                name="email"
                onBlur={handleBlur}
                onChange={handleChange}
                label="Email Address"
              />
              {touched.email && errors.email && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-email-login"
                >
                  {" "}
                  {errors.email}{" "}
                </FormHelperText>
              )}
            </FormControl>

            <FormControl
              fullWidth
              error={Boolean(touched.password && errors.password)}
              className={classes.loginInput}
            >
              <InputLabel htmlFor="outlined-adornment-password-login">
                Password
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password-login"
                type={showPassword ? "text" : "password"}
                value={values.password}
                name="password"
                onBlur={handleBlur}
                onChange={handleChange}
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
                label="Password"
              />
              {touched.password && errors.password && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-password-login"
                >
                  {" "}
                  {errors.password}{" "}
                </FormHelperText>
              )}
            </FormControl>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              spacing={1}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    name="checked"
                    color="secondary"
                  />
                }
                sx={{ color: "white" }}
                label="Remember me"
              />
              {/* <Typography
                variant="subtitle1"
                component={Link}
                target="_blank"
                color="secondary"
                sx={{ textDecoration: "none" }}
              >
                Forgot Password?
              </Typography> */}
              <SecondaryTextButton
                name="Forgot Password?"
                size="small"
                onClick={() =>
                  window.open(
                    "https://www.rally.markets/forgot-password/",
                    "_blank"
                  )
                }
              />
            </Stack>
            {errors.submit && (
              <Box sx={{ mt: 3 }}>
                <FormHelperText error>{errors.submit}</FormHelperText>
              </Box>
            )}
            <SecondaryActionButton
              type="submit"
              disabled={isSubmitting}
              name="Sign In"
              mt={1}
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
