import apiClient from "./AxiosAPI";

const getAnalysis = async () => {
  try {
    const response = await apiClient.get("analisis");
    return response;
  } catch (error) {
    return error;
  }
};

const getAnalysisMedic = async (name) => {
  try {
    const response = await apiClient.get(`analisis?especialidad=${name}`);
    return response;
  } catch (error) {
    return error;
  }
};

const createAnalysis = async (analysisData) => {
  try {
    const response = await apiClient.post("analisis", analysisData);
    return response;
  } catch (error) {
    return error;
  }
};

const editAnalysis = async (id, analysisData) => {
  try {
    const response = await apiClient.put(`analisis/${id}`, analysisData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteAnalysis = async (id) => {
  try {
    const response = await apiClient.delete(`analisis/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getAnalysis,
  getAnalysisMedic,
  createAnalysis,
  editAnalysis,
  deleteAnalysis,
};