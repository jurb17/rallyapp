import React from "react";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink, useLocation } from "react-router-dom";
import jwt_decode from "jwt-decode";

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
import Logo from "ui-component/Logo";
import FirebaseRegister from "../firebase-forms/FirebaseRegister";
import AuthFooter from "ui-component/cards/AuthFooter";
import SecondaryTextButton from "ui-component/buttons/SecondaryTextButton";

// ==============================|| AUTH3 - REGISTER ||===============================//

const Register = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down("sm"));
  const queryParams = new URLSearchParams(location.search);
  const tokenParam = queryParams.get("token");
  const firmParam = queryParams.get("firm_slug");
  const tokenPayload = !!tokenParam
    ? jwt_decode(queryParams.get("token"))
    : null;

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
            <Grid item sx={{ m: { xs: 1, sm: 2 } }}>
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
                            Create your account
                          </Typography>
                          <Typography
                            variant="caption"
                            fontSize="16px"
                            textAlign={matchDownSM ? "center" : ""}
                          >
                            Enter new credentials to continue.
                          </Typography>
                        </Stack>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12}>
                    <FirebaseRegister
                      email={!!tokenPayload ? tokenPayload.email : ""}
                      token={!!tokenParam ? tokenParam : ""}
                      firmslug={!!firmParam ? firmParam : ""}
                      tokenPayload={!!tokenPayload ? tokenPayload : ""}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Divider />
                  </Grid>
                  <Grid item alignItems="center" xs={12}>
                    <Grid container direction={"column"}>
                      <SecondaryTextButton
                        name="I already have an account"
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

export default Register;
