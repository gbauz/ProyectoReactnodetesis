import React from "react";
import Navigation from "../components/Navigation/Navigation";
import Error from "../views/Error/Error";
import Home from "../views/Home/Home";
import AdminPage from "../views/PanelAdmin/Paneladministrador";
import Patient from "../views/Patient/Patient";
import Resultados from "../views/Results/Results";
import { Route, Routes } from "react-router-dom";
import User from "../views/Users/User";
import Rol from "../views/Rol/Rol";
import Specialty from "../views/Specialty/Specialty";
import Audit from "../views/Audit/Audit";
import Medic from "../views/Medic/Medic";
import Exam from "../views/Exam/Exam";
import ExaminationOrder from "../views/ExaminationOrder/ExaminationOrder";

const RouterApp = () => {
  return (
    <>
      {/* <Navigation /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/usuario" element={<User />} />
        <Route path="/paciente" element={<Patient />} />
        <Route path="/rol" element={<Rol />} />
        <Route path="/resultado" element={<Resultados />} />
        <Route path="/especialidad" element={<Specialty />} />
        <Route path="/auditoria" element={<Audit />} />
        <Route path="/medico" element={<Medic />} />
        <Route path="/examen" element={<Exam />} />
        <Route path="/orden" element={<ExaminationOrder />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
};

export default RouterApp;
