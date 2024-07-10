import apiClient from "./AxiosAPI";

const getRol = async () => {
  try {
    const response = await apiClient.get("roles");
    return response;
  } catch (error) {
    return error;
  }
};

// const createUser = async (userData) => {
//   try {
//     const response = await apiClient.post("users", userData);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

// const editUser = async (id, userData) => {
//   try {
//     const response = await apiClient.put(`users/${id}`, userData);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

// const deleteUser = async (id) => {
//   try {
//     const response = await apiClient.delete(`users/${id}`);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

export default {
  getRol,
//   createUser,
//   editUser,
//   deleteUser,
};