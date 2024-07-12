import apiClient from "./AxiosAPI";

const getRols = async () => {
  try {
    const response = await apiClient.get("roles");
    return response;
  } catch (error) {
    return error;
  }
};

const createRol = async (rolData) => {
  try {
    const response = await apiClient.post("roles", rolData);
    return response;
  } catch (error) {
    return error;
  }
};

const editRol = async (id, rolData) => {
  try {
    console.log(id);
    console.log(rolData);
    const response = await apiClient.put(`roles/${id}`, rolData);
    return response;
  } catch (error) {
    return error;
  }
};

const deleteRol = async (id) => {
  try {
    const response = await apiClient.delete(`roles/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getRols,
  createRol,
  editRol,
  deleteRol,
};