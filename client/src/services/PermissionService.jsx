import apiClient from "./AxiosAPI";

const getPermissions = async () => {
  try {
    const response = await apiClient.get("permisos");
    return response;
  } catch (error) {
    return error;
  }
};

const createPermission = async (permissionData) => {
  try {
    const response = await apiClient.post("permisos", permissionData);
    return response;
  } catch (error) {
    return error;
  }
};

const editPermisssion = async (id, permissionData) => {
  try {
    const response = await apiClient.put(`permisos/${id}`, permissionData);
    return response;
  } catch (error) {
    return error;
  }
};

const deletePermission = async (id) => {
  try {
    const response = await apiClient.delete(`permisos/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getPermissions,
  createPermission,
  editPermisssion,
  deletePermission,
};
