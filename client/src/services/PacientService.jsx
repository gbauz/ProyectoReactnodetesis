import axios from 'axios';
import Uri from '../environment/environment'

const token = localStorage.getItem('token');
if (!token) console.error('Token no encontrado en localStorage');

// Configuración base de axios
const apiClient = axios.create({
  baseURL: Uri,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
});

const getPatients = async () => {
  try {
    const response = await apiClient.get('users');
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pacientes:', error);
    throw error;
  }
};

const createPatient = async (patientData) => {
  try {
    console.log(patientData);
    // const response = await apiClient.post('paciente', patientData);
    // return response;
    return await 'Exito';
  }catch (error){
    return error;
  }
}

const editPatient = async (id, patientData) => {
  try {
    console.log(patientData);
    console.log(id);
    // const response = await apiClient.put(`paciente/${id}`, patientData);
    // return response.data;
    return await 'Exito';
  } catch (error) {
    return error;
  }
};

const deletePatient = async (id) => {
  try {
    console.log(id);
    // const response = await apiClient.delete(`paciente/${id}`);
    // return response.data;
    return 'Exito';
  } catch (error) {
    console.error('Error al eliminar el paciente:', error);
    throw error;
  }
};

export default {
  getPatients,
  createPatient,
  editPatient,
  deletePatient,
};