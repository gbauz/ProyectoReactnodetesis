import React from 'react';
import './App.css';
import { Routes, Route, BrowserRouter } from 'react-router-dom'; // Importa Routes y Route para definir las rutas
import Login from './components/Login/Login'; // Importa el componente Login
import Paneladministrador from './components/PanelAdmin/Paneladministrador'; // Importa el componente Paneladministrador
import Users from './components/Usuarios/Users';
import Roles from './components/Usuarios/roles';
import Paciente from './components/Pacient/Pacient';
import Resultados from './components/Results/Results';
import Navigation from './components/Navigation/Navigation';

function App () {
  return (
    <BrowserRouter>
      <div>
        {/* <Navigation /> */}
        <Routes> {/* Configuración de rutas */}
          <Route path="/admin" element={<Paneladministrador />} />
          <Route path="/users" element={<Users />} />
          <Route path="/paciente" element={<Paciente />} />
          <Route path="/roles" element={<Roles />} /> 
          <Route path="/resultado" element={<Resultados />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
};

export default App; // Exporta el componente App
