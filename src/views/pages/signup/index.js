import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Link as RouterLink, useLocation } from "react-router-dom";

// material-ui
import { useTheme } from "@material-ui/core/styles";
import {
  Divider,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
} from "@material-ui/core";

// local imports
import AuthWrapper1 from "ui-component/wrappers/AuthWrapper1";
import AuthCardWrapper from "ui-component/wrappers/AuthCardWrapper";
import Logo from "ui-component/Logo";
import AuthFooter from "ui-component/cards/AuthFooter";
import SecondaryTextButton from "ui-component/buttons/SecondaryTextButton";
import SignupForm from "./SignupForm";

// ===============================|| USER - SIGNUP ||===============================//

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const queryParams = new URLSearchParams(location.search);
  const firmParam = queryParams.get("firmslug");
  const dispatch = useDispatch();

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
                            Let's Get Started
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={matchDownSM ? "center" : ""}
                          >
                            Enter your email to continue.
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <SignupForm firmslug={firmParam} />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item alignItems="center" xs={12}>
                    <SecondaryTextButton
                      name="I already have an account"
                      onClick={() => navigate("/login")}
                      mb={0}
                    />
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

export default Signup;
