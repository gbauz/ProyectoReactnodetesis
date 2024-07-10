import React, { useState } from "react";
import "./DeleteUser.css";
import { Button, Modal } from "antd";
import UserService from "../../../services/UserService";

const DeleteUser = ({ isDeleteModalOpen, handleDelete, handleDeleteCancel, initialValues }) => {
  const [error, setError] = useState(null);
  let response;

  const onFinish = async () => {
    try {
      response = await UserService.deleteUser(initialValues.cedula);
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
      title="Eliminar Usuario"
      open={isDeleteModalOpen}
      onCancel={handleDeleteCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <p>¿Estás seguro de que deseas eliminar este usuario?</p>
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

export default DeleteUser;
