import React from "react";
import "./DeletePacient.css";
import PacientService from "../../../services/PacientService";
import { Button, Modal } from "antd";

const DeletePacient = ({ isDeleteModalOpen, handleDelete, handleDeleteCancel, initialValues }) => {
  const onFinish = () => {
    const response = PacientService.deletePatient(initialValues.id);
    if (response) {
      handleDelete(response);
    }
  };

  return (
    <Modal
      title="Eliminar Paciente"
      open={isDeleteModalOpen}
      centered
      maskClosable={false}
      footer={null}
    >
      <p>¿Estás seguro de que deseas eliminar este paciente?</p>
      <div className="footer">
        <Button key="back" onClick={handleDeleteCancel} style={{ marginRight: "15px" }}>
          Cancelar
        </Button>
        <Button style={{ background: "#4096FF", color: "white" }} onClick={onFinish}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};

export default DeletePacient;
