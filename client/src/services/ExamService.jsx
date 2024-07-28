import apiClient from "./AxiosAPI";

const getExam = async () => {
  try {
    const response = await apiClient.get("examenes");
    return response;
  } catch (error) {
    return error;
  }
};

const getExamAnalysis = async (id_analisis) => {
  try {
    const response = await apiClient.get(`examenes/${id_analisis}/examenes`);
    return response;
  } catch (error) {
    return error;
  }
};

const createExam = async (examData) => {
  try {
    const response = await apiClient.post("examenes", examData);
    return response;
  } catch (error) {
    return error;
  }
};

const editExam = async (id, examData) => {
  try {
    const response = await apiClient.put(`examenes/${id}`, examData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteExam = async (id) => {
  try {
    const response = await apiClient.delete(`examenes/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getExam,
  getExamAnalysis,
  createExam,
  editExam,
  deleteExam,
};