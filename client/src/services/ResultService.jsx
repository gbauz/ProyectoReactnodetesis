import apiClient from "./AxiosAPI";

const getResults = async () => {
  try {
    const response = await apiClient.get("resultado");
    return response;
  } catch (error) {
    return error;
  }
};

const getResultID = async (id) => {
    try {
      const response = await apiClient.get(`resultado/obtener/${id}`);
      return response;
    } catch (error) {
      return error;
    }
};

const createResult = async (resultData) => {
  try {
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

const actualizarIDResult = async (id, nuevoIdResultado) => {
    try {
      const response = await apiClient.put(`resultado/actualizar/${id}`, nuevoIdResultado);
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

export default {
  getResults,
  getResultID,
  createResult,
  editResult,
  actualizarIDResult,
  deleteResult,
};