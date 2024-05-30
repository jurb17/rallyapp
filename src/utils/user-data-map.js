// what are the variables that are passed to the front end upon login?
export const authReducerObject = {
  accesstoken: "",
  refreshtoken: "",
  survey: {},
  attributes: {},
  rememberMe: false,
};

// what are the attributes derives from a jwt token?
export const attributes = {
  ACCOUNT: 1,
  CUSTOMER: 1,
  ADVISOR: 1,
  RIA: 1,
  MERCHANT: 1,
  IDENTITY: 1,
  advisorId: "wed",
};

// what are the user roles available in the demo version?
export const userRoles = {
  1: "Financial Advisor",
  2: "Client",
  3: "New Financial Advisor",
  4: "New Client",
};

// what attributes are assigned to each user role?
export const userRoleAttributes = {
  "Financial Advisor": {
    accesstoken: "",
    refreshtoken: "",
    survey: {},
    attributes: {},
    rememberMe: false,
  },
  Client: {
    accesstoken: "",
    refreshtoken: "",
    survey: {},
    attributes: {},
    rememberMe: false,
  },
  "New Financial Advisor": {
    accesstoken: "",
    refreshtoken: "",
    survey: {},
    attributes: {},
    rememberMe: false,
  },
  "New Client": {
    accesstoken: "",
    refreshtoken: "",
    survey: {},
    attributes: {},
    rememberMe: false,
  },
};
