import React from "react";
import "./App.css";
import { Routes, Route, BrowserRouter } from "react-router-dom"; // Importa Routes y Route para definir las rutas
import Login from "./views/Login/Login"; // Importa el componente Login
import RouterApp from "./routes/RouterApp";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import { Modal } from "antd";
import useTokenExpiration from "./hooks/UseTokenExpiration";
import { Button } from "bootstrap/dist/js/bootstrap.bundle.min";

function App() {
  const { isModalVisible, handleOk } = useTokenExpiration();

  return (
    <div>
      <Routes>
        <Route path="/*" element={
          <ProtectedRoutes>
            <RouterApp />
          </ProtectedRoutes>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Modal centered
        title="Su sesión expiró"
        open={isModalVisible}
        onCancel={handleOk}
        onOk={handleOk}
        maskClosable={false}
        
      >
        {/* <Button style={{background: '#4096FF', color:'white'}} onClick={handleOk}>
          Aceptar
        </Button> */}
      </Modal>
    </div>
  );
}

export default App; // Exporta el componente App
