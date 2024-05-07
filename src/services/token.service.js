import axios from "axios";
import config from "../config";

class TokenService {
  getLocalSurvey() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.survey;
  }

  getSessionSurvey() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.survey;
  }

  getLocalRefreshToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.refreshtoken;
  }

  getSessionRefreshToken() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.refreshtoken;
  }

  getLocalAccessToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.accesstoken;
  }

  getSessionAccessToken() {
    const user = JSON.parse(sessionStorage.getItem("user"));
    return user?.accesstoken;
  }

  updateLocalAccessToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.accesstoken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  updateLocalRefreshToken(token) {
    let user = JSON.parse(localStorage.getItem("user"));
    user.refreshtoken = token;
    localStorage.setItem("user", JSON.stringify(user));
  }

  updateSessionAccessToken(token) {
    let user = {};
    if (sessionStorage.getItem("user")) {
      user = JSON.parse(sessionStorage.getItem("user"));
      user.accesstoken = token;
      sessionStorage.setItem("user", JSON.stringify(user));
    } else if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"));
      user.accesstoken = token;
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      return;
    }
  }

  updateSessionRefreshToken(token) {
    let user = {};
    if (sessionStorage.getItem("user")) {
      user = JSON.parse(sessionStorage.getItem("user"));
      user.refreshtoken = token;
      sessionStorage.setItem("user", JSON.stringify(user));
    } else if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"));
      user.refreshtoken = token;
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      return;
    }
  }

  removeSessionAccessToken() {
    let user = {};
    if (sessionStorage.getItem("user")) {
      user = JSON.parse(sessionStorage.getItem("user"));
      delete user.accesstoken;
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }

  removeSessionRefreshToken() {
    let user = {};
    if (sessionStorage.getItem("user")) {
      user = JSON.parse(sessionStorage.getItem("user"));
      delete user.refreshtoken;
      sessionStorage.setItem("user", JSON.stringify(user));
    }
  }

  removeLocalAccessToken() {
    let user = {};
    if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"));
      delete user.accesstoken;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  removeLocalRefreshToken() {
    let user = {};
    if (localStorage.getItem("user")) {
      user = JSON.parse(localStorage.getItem("user"));
      delete user.refreshtoken;
      localStorage.setItem("user", JSON.stringify(user));
    }
  }

  getLocalUser() {
    return JSON.parse(localStorage.getItem("user"));
  }

  getSessionUser() {
    return JSON.parse(sessionStorage.getItem("user"));
  }

  setLocalUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  setSessionUser(user) {
    sessionStorage.setItem("user", JSON.stringify(user));
  }

  removeUser() {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
  }

  getLocalRememberMe() {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.rememberMe;
  }

  refreshTokenRequest = (refreshtoken) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          `${config.apibasename}/account/refresh/`,
          {},
          {
            headers: {
              Authorization: "Bearer " + refreshtoken,
            },
          }
        )
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
}

export default new TokenService();
