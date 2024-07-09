import React from "react";
import Navigation from "../components/Navigation/Navigation";
import Error from "../views/Error/Error";
import Home from "../views/Home/Home";
import AdminPage from "../views/PanelAdmin/Paneladministrador";
import Users from "../views/Usuarios/Users";
import Patient from "../views/Patient/Patient";
import Roles from "../views/Usuarios/roles";
import Resultados from "../views/Results/Results";
import { Route, Routes } from "react-router-dom";

const RouterApp = () => {
  return (
    <>
      {/* <Navigation /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/users" element={<Users />} />
        <Route path="/paciente" element={<Patient />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/resultado" element={<Resultados />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default RouterApp;
