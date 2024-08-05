import apiClient from "./AxiosAPI";

const getResults = async () => {
  try {
    const response = await apiClient.get("resultado");
    return response;
  } catch (error) {
    return error;
  }
};

const createResult = async (resultData) => {
  try {
    console.log(resultData);
    const response = await apiClient.post("resultado", resultData);
    return response;
  } catch (error) {
    return error;
  }
};

const editResult = async (id, resultData) => {
  try {
    const response = await apiClient.put(`resultado/${id}`, resultData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteResult = async (id) => {
  try {
    const response = await apiClient.delete(`resultado/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

const getResultPacientMedic = async (id_paciente, id_medico) => {
  try {
    const response = await apiClient.get('resultado/obtener/pacmedic', {
      params: {
        id_paciente: id_paciente,
        id_medico: id_medico
      }
    });
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getResults,
  createResult,
  editResult,
  deleteResult,
  getResultPacientMedic
};