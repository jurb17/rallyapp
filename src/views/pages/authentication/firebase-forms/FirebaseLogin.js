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
  Select,
  Stack,
  MenuItem,
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
  const navigate = useNavigate();
  const location = useLocation();

  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const userRoles = ["Financial Advisor", "Client"];
  const items = userRoles.map((name, index) => {
    return (
      <MenuItem key={index} value={index + 1}>
        {" "}
        {name}{" "}
      </MenuItem>
    );
  });

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
      <Formik
        initialValues={{
          email: "",
          password: "",
          userRole: "",
          submit: null,
        }}
        // check user email and password are valid entries.
        validationSchema={Yup.object().shape({
          email: Yup.string() // OWASP
            .matches(
              /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/,
              "Must be a valid email address"
            )
            .max(255)
            .required("Email is required."),
          password: Yup.string().max(255).required("Password is required."),
          userRole: Yup.string().required("Please select a user role."),
        })}
        onSubmit={(values, { setStatus, setSubmitting }) => {
          console.log(values);
          setStatus({ success: true });
          setSubmitting(false);
          attributesNavigation(navigate, location, null, values.userRole);
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
            <FormControl
              fullWidth
              error={Boolean(touched.userRole && errors.userRole)}
              className={classes.loginInput}
              sx={{ pt: "2px" }}
            >
              <InputLabel
                htmlFor="outlined-adornment-user-role-login"
                sx={{ pt: "2px" }}
              >
                User Role
              </InputLabel>
              <Select
                sx={{ pt: "12px", pb: "0px" }}
                id="outlined-adornment-user-role-login"
                type="text"
                value={values.userRole}
                name="userRole"
                onBlur={handleBlur}
                onChange={(event) => {
                  console.log(event);
                  handleChange(event);
                }}
                label="User Role"
              >
                {items}
              </Select>
              {touched.userRole && errors.userRole && (
                <FormHelperText
                  error
                  id="standard-weight-helper-text-user-role-login"
                >
                  {" "}
                  {errors.userRole}{" "}
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
                  // @@@ add a "forgot password page or something similar so user doesn't hit a dead end."
                  // window.open(
                  //   "https://www.rally.markets/forgot-password/",
                  //   "_blank"
                  // )
                  alert("No passwords to reset, this is just a demo :)")
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
              name="Continue"
              mt={1}
            />
          </form>
        )}
      </Formik>
    </>
  );
};

export default FirebaseLogin;
