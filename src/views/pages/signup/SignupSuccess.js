import React from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

// material-ui
import { useTheme } from "@material-ui/core/styles";
import {
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  Divider,
} from "@material-ui/core";

// local imports
import AuthWrapper1 from "ui-component/wrappers/AuthWrapper1";
import AuthCardWrapper from "ui-component/wrappers/AuthCardWrapper";
import Logo from "ui-component/Logo";
import AuthFooter from "ui-component/cards/AuthFooter";
import DynamicButton from "ui-component/buttons/DynamicButton";

// ===============================|| USER - SIGNUP ||===============================//

const SignupSuccess = () => {
  const location = useLocation();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "75vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 120px)" }}
          >
            <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sx={{ mb: 2 }}>
                    <RouterLink to="#">
                      <Logo />
                    </RouterLink>
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction={matchDownSM ? "column-reverse" : "row"}
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Grid item>
                        <Stack
                          alignItems="center"
                          justifyContent="center"
                          spacing={1}
                        >
                          <Typography
                            color="white"
                            gutterBottom
                            variant={matchDownSM ? "h3" : "h2"}
                          >
                            We sent you an email!
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={"center"}
                          >
                            Please check your inbox. We've sent you a link to
                            complete your registration. You can close this page.
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid container direction="column" alignItems="center">
                      <DynamicButton
                        name="Back to Login"
                        color="secondary"
                        variant="outlined"
                        onClick={() => navigate("/login")}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default SignupSuccess;
