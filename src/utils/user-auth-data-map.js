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
    accesstoken: 1,
    refreshtoken: 1,
    survey: {},
    attributes: {
      ACCOUNT: 1,
      CUSTOMER: 0,
      ADVISOR: 1,
      RIA: 1,
      MERCHANT: 1, // not sure yet
      IDENTITY: 1, // not sure yet
      advisorId: 1234, // not sure yet
    },
    rememberMe: false,
  },
  Client: {
    accesstoken: 1,
    refreshtoken: 1,
    survey: {},
    attributes: {
      ACCOUNT: 1,
      CUSTOMER: 1,
      ADVISOR: 0,
      RIA: 0,
      MERCHANT: 0, // not sure yet
      IDENTITY: 1, // not sure yet
      advisorId: 5678, // not sure yet
    },
    rememberMe: false,
  },
  "New Financial Advisor": {
    accesstoken: 1,
    refreshtoken: 1,
    survey: {},
    attributes: {
      ACCOUNT: -1,
      CUSTOMER: 0,
      ADVISOR: 1,
      RIA: 1,
      MERCHANT: 0, // not sure yet
      IDENTITY: 1, // not sure yet
      advisorId: 4321, // not sure yet
    },
    rememberMe: false,
  },
  "New Client": {
    accesstoken: 1,
    refreshtoken: 1,
    survey: {},
    attributes: {
      ACCOUNT: -1,
      CUSTOMER: 1,
      ADVISOR: 0,
      RIA: 0,
      MERCHANT: 0, // not sure yet
      IDENTITY: 1, // not sure yet
      advisorId: 8765, // not sure yet
    },
    rememberMe: false,
  },
};
