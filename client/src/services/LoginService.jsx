import axios from 'axios';
import Uri from '../environment/environment';

const token = localStorage.getItem('token');

// Configuración base de axios
const apiClient = axios.create({
  baseURL: Uri,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
});

const logIn = async (loginData) => {
  try {
    const response = await apiClient.post('login', loginData);
    return response;
  }catch (error){
    return error;
  }
}

export default {
  logIn
};