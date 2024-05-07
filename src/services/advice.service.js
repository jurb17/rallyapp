import axiosInstance from "./api";

class AdviceService {
  getUpdates(object) {
    return axiosInstance.get("/advice/updates/", {
      params: { ...object },
    });
  }

  getChat(object) {
    return axiosInstance.get("/advice/chat/", {
      params: { ...object },
    });
  }

  postChat(object) {
    return axiosInstance.post("/advice/chat/", { ...object });
  }

  deleteChat(object) {
    return axiosInstance.delete("/advice/chat/", {
      data: { ...object },
    });
  }

  getChatList(object) {
    return axiosInstance.get("/advice/chat/list/", {
      params: { ...object },
    });
  }

  getChatSince(object) {
    return axiosInstance.get("/advice/chat/since/", {
      params: { ...object },
    });
  }

  getChatBefore(object) {
    return axiosInstance.get("/advice/chat/before/", {
      params: { ...object },
    });
  }

  getAdvisorList(object) {
    return axiosInstance.get("/advice/advisors/", {
      params: { ...object },
    });
  }

  postAdvisorRequest(object) {
    return axiosInstance.post("/advice/request/", { ...object });
  }

  getPaymentList(object) {
    return axiosInstance.get("/advice/payment/list/", {
      params: { ...object },
    });
  }

  postPayment(object) {
    return axiosInstance.post("/advice/payment/", { ...object });
  }

  getPayment(object) {
    return axiosInstance.get("/advice/payment/", {
      params: { ...object },
    });
  }

  deletePayment(object) {
    return axiosInstance.delete("/advice/payment/", {
      data: { ...object },
    });
  }

  postDispute(object) {
    return axiosInstance.post("/advice/dispute/", { ...object });
  }

  getAdvisor(slugs, object) {
    return axiosInstance.get(`/advice/profile/${slugs.firmslug}/`, {
      params: { ...object },
    });
  }

  postSignup(object) {
    return axiosInstance.post("/advice/signup/", { ...object });
  }

  disconnect(object) {
    return axiosInstance.delete("/advice/", { ...object });
  }

  reconnect(object) {
    return axiosInstance.post("/advice/", { ...object });
  }

  postReport(object) {
    return axiosInstance.post("/advice/report/", { ...object });
  }
}

export default new AdviceService();
