import apiClient from "./AxiosAPI";

const getSession = async () => {
  try {
    const response = await apiClient.get("session");
    return response;
  } catch (error) {
    return error;
  }
};

// const createUser = async (userData) => {
//   try {
//     const response = await apiClient.post("session", userData);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

// const editUser = async (id, userData) => {
//   try {
//     const response = await apiClient.put(`session/${id}`, userData);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

// const deleteUser = async (id) => {
//   try {
//     const response = await apiClient.delete(`session/${id}`);
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

export default {
  getSession,
//   createUser,
//   editUser,
//   deleteUser,
};