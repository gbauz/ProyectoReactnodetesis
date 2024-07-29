import apiClient from "./AxiosAPI";

const getExaminationOrder = async () => {
  try {
    const response = await apiClient.get("mantenexamenes");
    return response;
  } catch (error) {
    return error;
  }
};

const createExaminationOrder = async (orderData) => {
  try {
    const response = await apiClient.post("mantenexamenes", orderData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteExaminationOrder = async (id) => {
  try {
    const response = await apiClient.delete(`mantenexamenes/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

const lastExaminationOrder = async () => {
  try {
    const response = await apiClient.get("mantenexamenes/last/exam");
    return response;
  } catch (error) {
    return error;
  }
};

const getExamID = async (id_paciente, id_examen, id_analisis) => {
  try {
    const response = await apiClient.get("mantenexamenes/obtener/examen", {
      params: {
        id_paciente: id_paciente,
        id_examen: id_examen,
        id_analisis: id_analisis,
      },
    });
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getExaminationOrder,
  createExaminationOrder,
  deleteExaminationOrder,
  lastExaminationOrder,
  getExamID
};
