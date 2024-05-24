import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { attributesNavigation } from "utils/navigation";
import { useLocation } from "react-router-dom";

// material-ui
import { useTheme } from "@material-ui/core/styles";
import {
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

// components
import AuthWrapper1 from "ui-component/wrappers/AuthWrapper1";
import AuthCardWrapper from "ui-component/wrappers/AuthCardWrapper";
import FirebaseLogin from "../firebase-forms/FirebaseLogin";
import Logo from "ui-component/Logo";
import AuthFooter from "ui-component/cards/AuthFooter";
import SecondaryTextButton from "ui-component/buttons/SecondaryTextButton";

// ===============================|| AUTH3 - LOGIN ||================================//

const Login = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AuthWrapper1>
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: "50vh" }}
      >
        <Grid item xs={12}>
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: "calc(100vh - 140px)" }}
          >
            <Grid item sx={{ m: { xs: 0, sm: 2 }, mb: 0 }}>
              <AuthCardWrapper>
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item sx={{ mb: 3 }}>
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
                            Welcome to the demo!
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={"center"}
                            sx={{ pl: 1, pr: 1 }}
                          >
                            Please enter your credentials and select a user role
                            to continue. User credentials are currently not
                            being collected or stored.
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <FirebaseLogin login={3} />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item xs={12}>
                    <Grid
                      container
                      direction="column"
                      alignItems="center"
                      sx={{ mb: -3 }}
                    >
                      <SecondaryTextButton
                        name="Client Sign Up"
                        onClick={() =>
                          attributesNavigation(navigate, location, null, 4)
                        }
                      />
                      <SecondaryTextButton
                        name="Become an advisor"
                        onClick={() =>
                          attributesNavigation(navigate, location, null, 3)
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </AuthCardWrapper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid>
      </Grid>
    </AuthWrapper1>
  );
};

export default Login;
