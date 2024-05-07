import { showSnackbar } from "actions/main";
import api from "./api";
import tokenService from "./token.service";

class AuthService {
  async register(firstname, lastname, email, password, token) {
    return api
      .post(
        "/account/register/",
        {
          firstname: firstname,
          lastname: lastname,
          password: password,
          token: token,
        },
        { headers: { Authorization: "Bearer " + token } }
      )
      .then((response) => {
        if (!!response.data.payload) {
          // tokenService.setLocalUser();
          tokenService.setSessionUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
          });
        }

        return response;
      })
      .catch((error) => {
        console.log("error with AS.register", error);
        return error;
      });
  }

  async registerprospect(firstname, lastname, email, password) {
    return api
      .post("/account/registerprospect/", {
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      }) // change endpoint when avaiable.
      .then((response) => {
        if (!!response.data.payload.success) {
          // should send an email to the prospect.
          // console.log("$$$did an email get sent?");
          return response;
        }
      })
      .catch((error) => {
        console.log("uncaught error with AS.registerprospect", error);
        return error;
      });
  }

  async login(email, password, rememberMe) {
    return api
      .post("/account/login/", {
        email: email,
        password: password,
      })
      .then((response) => {
        if (rememberMe) {
          tokenService.setLocalUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
            rememberMe: rememberMe,
          });
          tokenService.setSessionUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
          });
        } else {
          tokenService.setLocalUser({ rememberMe: false });
          tokenService.setSessionUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
          });
        }
        return response;
      })
      .catch((error) => {
        dispatchEvent(showSnackbar("Something went wrong", true, "error"));
        console.log("error with AS.login", error);
        return error;
      });
  }

  async logout() {
    return api
      .post("/account/logout/", {
        headers: { Authorization: tokenService.getSessionRefreshToken() },
      })
      .then(() => {
        tokenService.removeUser();
        window.location.href = "/";
        window.location.reload();
        return true;
      })
      .catch((error) => {
        tokenService.removeUser();
        window.location.href = "/";
        window.location.reload();
        console.log("error with AS.logout", error);
        return error;
      });
  }

  async onboard(link, surveyObj) {
    return api
      .post(link, { ...surveyObj })
      .then((response) => {
        if (!!tokenService.getLocalRememberMe()) {
          tokenService.setLocalUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
            rememberMe: tokenService.getLocalRememberMe(),
          });
          tokenService.setSessionUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
          });
        } else {
          tokenService.setLocalUser({ rememberMe: false });
          tokenService.setSessionUser({
            ...response.data.payload.tokens,
            survey: response.data.payload.survey,
          });
        }
        return response;
      })
      .catch((error) => {
        console.log("error with AS.onboard", error);
        return error;
      });
  }
}

export default new AuthService();
