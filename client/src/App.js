import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importa Routes y Route para definir las rutas
import Login from './components/Login/Login'; // Importa el componente Login
import Paneladministrador from './components/PanelAdmin/Paneladministrador'; // Importa el componente Paneladministrador
import Users from './components/Usuarios/Users';
import Roles from './components/Usuarios/roles';
import Paciente from './components/Paciente/Paciente';
const App = () => (
  <Routes> {/* Configuración de rutas */}
    <Route path="/admin" element={<Paneladministrador />} /> {/* Ruta para el panel administrativo */}
    <Route path="/users" element={<Users />} />
    <Route path="/paciente" element={<Paciente />} />
    <Route path="/roles" element={<Roles />} /> 
    <Route path="/" element={<Login />} /> {/* Ruta para el login */}
  </Routes>
);

export default App; // Exporta el componente App
