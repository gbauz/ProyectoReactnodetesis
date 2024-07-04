import apiClient from "./AxiosAPI";

const getMedics = async () => {
  try {
    const response = await apiClient.get("medico");
    return response;
  } catch (error) {
    return error;
  }
};

const createMedic = async (medicData) => {
  try {
    // console.log(medicData);
    const response = await apiClient.post("medico", medicData);
    return response;
  } catch (error) {
    return error;
  }
};

const editMedic = async (id, medicData) => {
  try {
    // console.log(medicData);
    // console.log(id);
    const response = await apiClient.put(`medico/${id}`, medicData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteMedic = async (id) => {
  try {
    // console.log(id);
    const response = await apiClient.delete(`medico/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getMedics,
  createMedic,
  editMedic,
  deleteMedic,
};
