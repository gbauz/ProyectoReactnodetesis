import apiClient from "./AxiosAPI";

const getExamDetails = async () => {
  try {
    const response = await apiClient.get("examen_detalle");
    return response;
  } catch (error) {
    return error;
  }
};

const createExamDetail = async (examData) => {
  try {
    const response = await apiClient.post("examen_detalle", examData);
    return response;
  } catch (error) {
    return error;
  }
};

const editExamDetail = async (id, examData) => {
  try {
    const response = await apiClient.put(`examen_detalle/${id}`, examData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteExamDetail = async (id) => {
  try {
    const response = await apiClient.delete(`examen_detalle/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getExamDetails,
  createExamDetail,
  editExamDetail,
  deleteExamDetail,
};