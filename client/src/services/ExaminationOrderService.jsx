import apiClient from "./AxiosAPI";

const getExaminationOrder = async () => {
  try {
    const response = await apiClient.get("examenes");
    return response;
  } catch (error) {
    return error;
  }
};

const createExaminationOrder = async (orderData) => {
  try {
    // console.log(orderData);
    const response = await apiClient.post("examenes", orderData);
    return response;
  } catch (error) {
    return error;
  }
};

const editExaminationOrder = async (id, orderData) => {
  try {
    // console.log(orderData);
    // console.log(id);
    const response = await apiClient.put(`examenes/${id}`, orderData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteExaminationOrder = async (id) => {
  try {
    // console.log(id);
    const response = await apiClient.delete(`examenes/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getExaminationOrder,
  createExaminationOrder,
  editExaminationOrder,
  deleteExaminationOrder,
};
