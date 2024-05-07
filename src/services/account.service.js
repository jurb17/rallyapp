import axiosInstance from "./api";

class AccountService {
  getAccount(object) {
    return axiosInstance.get("/account/", { params: { ...object } });
  }

  getStripeLinkIdentity(object) {
    return axiosInstance.get("/account/register/identity/", {
      params: { ...object },
    });
  }

  getStripeLinkMerchant(object) {
    return axiosInstance.get("/account/register/merchant/", {
      params: { ...object },
    });
  }

  getStripeLinkCustomer(object) {
    return axiosInstance.get("/account/register/customer/", {
      params: { ...object },
    });
  }

  postChangePassword(object) {
    return axiosInstance.post("/account/changepassword/", { ...object });
  }

  postSupport(object) {
    return axiosInstance.post("/account/support/", { ...object });
  }
}

export default new AccountService();
