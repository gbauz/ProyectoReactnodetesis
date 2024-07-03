import axios from 'axios';
import Uri from '../environment/environment'

const token = localStorage.getItem('token');

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
    const response = await apiClient.get('pacientes');
    return response;
  } catch (error) {
    return error;
  }
};

const createPatient = async (patientData) => {
  try {
    // console.log(patientData);
    const response = await apiClient.post('pacientes', patientData);
    return response;
  }catch (error){
    return error;
  }
}

const editPatient = async (id, patientData) => {
  try {
    // console.log(patientData);
    // console.log(id);
    const response = await apiClient.put(`pacientes/${id}`, patientData);
    return response;
  } catch (error) {
    return error;
  }
};

const deletePatient = async (id) => {
  try {
    // console.log(id);
    const response = await apiClient.delete(`pacientes/${id}`);
    return response;
  } catch (error) {
    return error;
  }
};

export default {
  getPatients,
  createPatient,
  editPatient,
  deletePatient,
};