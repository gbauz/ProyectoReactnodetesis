import apiClient from "./AxiosAPI";

const getResults = async () => {
  try {
    const response = await apiClient.get("resultado");
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

const getResultPacientMedic = async (id_paciente, id_medico, action) => {
  try {
    const response = await apiClient.get('resultado/obtener/pacmedic', {
      params: {
        id_paciente: id_paciente,
        id_medico: id_medico,
        action: action
      }
    });
    return response;
  } catch (error) {
    return error;
  }
};

const getResultOnly = async () => {
  try {
    const response = await apiClient.get("resultado/obtener/result");
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getResults,
  deleteResult,
  getResultPacientMedic,
  getResultOnly
};