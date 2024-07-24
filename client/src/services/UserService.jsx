import apiClient from "./AxiosAPI";

const getUsers = async () => {
  try {
    const response = await apiClient.get("users");
    console.log(response)
    return response;
  } catch (error) {
    return error;
  }

};

const createUser = async (userData) => {
  try {
    const response = await apiClient.post("users", userData);
    return response;
  } catch (error) {
    return error;
  }
};

const editUser = async (id, userData) => {
  try {
    const response = await apiClient.put(`users/${id}`, userData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteUser = async (id) => {
  try {
    const response = await apiClient.delete(`users/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

const changePassword = async (id, userData) => {
  try {
    const response = await apiClient.put(`users/${id}/password`, userData);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getUsers,
  createUser,
  editUser,
  deleteUser,
  changePassword
};