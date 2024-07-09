import apiClient from "./AxiosAPI";

const getSpecialty = async () => {
  try {
    const response = await apiClient.get("especialidades");
    return response;
  } catch (error) {
    return error;
  }
};

const createSpecialty = async (specialtyData) => {
  try {
    const response = await apiClient.post("especialidades", specialtyData);
    return response;
  } catch (error) {
    return error;
  }
};

const editSpecialty = async (id, specialtyData) => {
  try {
    const response = await apiClient.put(`especialidades/${id}`, specialtyData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteSpecialty = async (id) => {
  try {
    const response = await apiClient.delete(`especialidades/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getSpecialty,
  createSpecialty,
  editSpecialty,
  deleteSpecialty,
};