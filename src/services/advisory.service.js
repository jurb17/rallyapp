import axiosInstance from "./api";

class AdvisoryService {
  getProspectList(object) {
    return axiosInstance.get("/advisory/prospect/list/", {
      params: { ...object },
    });
  }

  getProspect(object) {
    return axiosInstance.get("/advisory/prospect/", { params: { ...object } });
  }

  postNewClientInvite(object) {
    return axiosInstance.post("/advisory/prospect/", { ...object });
  }

  deleteProspect(object) {
    return axiosInstance.delete("/advisory/prospect/", {
      data: { ...object },
    });
  }

  getClientList(object) {
    return axiosInstance.get("/advisory/client/list/", {
      params: { ...object },
    });
  }

  getClient(object) {
    return axiosInstance.get("/advisory/client/", { params: { ...object } });
  }

  putClient(object) {
    return axiosInstance.put("/advisory/client/", { ...object });
  }

  deleteClient(object) {
    return axiosInstance.delete("/advisory/client/", { data: { ...object } });
  }

  postCustomField(object) {
    return axiosInstance.post("/advisory/custom_field/", { ...object });
  }

  getServiceList(object) {
    return axiosInstance.get("/advisory/service/list/", {
      params: { ...object },
    });
  }

  getService(object) {
    return axiosInstance.get("/advisory/service/", { params: { ...object } });
  }

  postService(object) {
    return axiosInstance.post("/advisory/service/", { ...object });
  }

  deleteService(object) {
    return axiosInstance.delete("/advisory/service/", { data: { ...object } });
  }

  getServiceNiche(object) {
    return axiosInstance.get("/advisory/service/niche/", {
      params: { ...object },
    });
  }

  postServiceNiche(object) {
    return axiosInstance.post("/advisory/service/niche/", { ...object });
  }

  deleteServiceNiche(object) {
    return axiosInstance.delete("/advisory/service/niche/", {
      data: { ...object },
    });
  }

  getArticleList(object) {
    return axiosInstance.get("/advisory/article/list/", {
      params: { ...object },
    });
  }

  postArticle(object) {
    return axiosInstance.post("/advisory/article/", { ...object });
  }

  getArticle(object) {
    return axiosInstance.get("/advisory/article/", { params: { ...object } });
  }

  putArticle(object) {
    return axiosInstance.put("/advisory/article/", { ...object });
  }

  deleteArticle(object) {
    return axiosInstance.delete("/advisory/article/", { data: { ...object } });
  }

  getConfigs(object) {
    return axiosInstance.get("/advisory/configs/", { params: { ...object } });
  }

  getProfileAdvisor(object) {
    return axiosInstance.get("/advisory/profile/advisor/", {
      params: { ...object },
    });
  }

  postAdvisorProfile(object) {
    return axiosInstance.post("/advisory/profile/advisor/", { ...object });
  }

  putAdvisorProfileImage(object) {
    return axiosInstance.put("/advisory/profile/advisor/image/", { ...object });
  }

  getFirmProfile(object) {
    return axiosInstance.get("/advisory/profile/firm/", {
      params: { ...object },
    });
  }

  postFirmProfile(object) {
    return axiosInstance.post("/advisory/profile/firm/", { ...object });
  }

  putFirmProfileImage(object) {
    return axiosInstance.put("/advisory/profile/firm/image/", { ...object });
  }

  postCloudFlareImage(link, object) {
    // NOT USING THIS REQUEST. DON'T EDIT.
    return axiosInstance.post(link, object, {
      headers: { imageUpload: true, "content-type": "multipart/form-data" },
    });
  }

  getPaymentList(object) {
    return axiosInstance.get("/advisory/payment/list/", {
      params: { ...object },
    });
  }

  getPayment(object) {
    return axiosInstance.get("/advisory/payment/", { params: { ...object } });
  }

  postPayment(object) {
    return axiosInstance.post("/advisory/payment/", { ...object });
  }

  postPaymentRefund(object) {
    return axiosInstance.post("/advisory/payment/refund/", { ...object });
  }

  deletePayment(object) {
    return axiosInstance.delete("/advisory/payment/", { data: { ...object } });
  }

  getDashboard(object) {
    return axiosInstance.get("/advisory/dashboard/", { ...object });
  }

  // messages
  getChatList(object) {
    return axiosInstance.get("/advisory/chat/list/", { params: { ...object } });
  }

  getChat(object) {
    return axiosInstance.get("/advisory/chat/", { params: { ...object } });
  }

  postChat(object) {
    return axiosInstance.post("/advisory/chat/", { ...object });
  }

  deleteChat(object) {
    return axiosInstance.delete("/advisory/chat/", { data: { ...object } });
  }

  getChatSince(object) {
    return axiosInstance.get("/advisory/chat/since/", {
      params: { ...object },
    });
  }

  getChatBefore(object) {
    return axiosInstance.get("/advisory/chat/before/", {
      params: { ...object },
    });
  }

  getClientProfile(object) {
    return axiosInstance.get("/advisory/client/profile/", {
      params: { ...object },
    });
  }

  postReport(object) {
    return axiosInstance.post("/advisory/report/", { ...object });
  }
}

export default new AdvisoryService();
