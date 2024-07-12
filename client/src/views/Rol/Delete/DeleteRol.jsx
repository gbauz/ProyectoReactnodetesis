import React, { useState } from "react";
import "./DeleteRol.css";
import PatientService from "../../../services/PatientService";
import { Button, Modal } from "antd";
import RolService from "../../../services/RolService";

const DeleteRol = ({ isDeleteModalOpen, handleDelete, handleDeleteCancel, initialValues }) => {
  const [error, setError] = useState(null);
  let response;

  const onFinish = async () => {
    try {
      response = await RolService.deleteRol(initialValues.id_rol);
    } catch (error) {
      setError(error);
    } finally {
      if (response) {
        handleDelete(response);
      }
    }
  };

  return (
    <Modal
      title="Eliminar Rol"
      open={isDeleteModalOpen}
      onCancel={handleDeleteCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <p>¿Estás seguro de que deseas eliminar este rol?</p>
      <div className="footer">
        <Button key="back" onClick={handleDeleteCancel} style={{ marginRight: "15px" }}>
          Cancelar
        </Button>
        <Button style={{ background: "red", color: "white" }} onClick={onFinish}>
          Eliminar
        </Button>
      </div>
    </Modal>
  );
};

export default DeleteRol;
