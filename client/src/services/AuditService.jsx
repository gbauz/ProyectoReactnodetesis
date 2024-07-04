import apiClient from "./AxiosAPI";

const getAudit = async () => {
  try {
    const response = await apiClient.get("auditoria");
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getAudit,
};
