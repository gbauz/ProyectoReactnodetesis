import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom"; // Importa Routes y Route para definir las rutas
import Login from "./views/Login/Login"; // Importa el componente Login
import RouterApp from "./routes/RouterApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";

function App() {
  return (
    <BrowserRouter>
      <Routes>{/* Configuración de rutas */}
        <Route path="/*" element={
          <ProtectedRoutes>
            <RouterApp />
          </ProtectedRoutes>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Exporta el componente App
