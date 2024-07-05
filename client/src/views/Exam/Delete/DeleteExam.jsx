import React, { useState } from "react";
import "./DeleteExam.css";
import { Button, Modal } from "antd";
import ExamService from "../../../services/ExamService";

const DeleteExam = ({ isDeleteModalOpen, handleDelete, handleDeleteCancel, initialValues }) => {
  const [error, setError] = useState(null);
  let response;

  const onFinish = async () => {
    try {
      response = await ExamService.deleteExam(initialValues.id_examen);
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
      title="Eliminar Examen"
      open={isDeleteModalOpen}
      onCancel={handleDeleteCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <p>¿Estás seguro de que deseas eliminar este examen?</p>
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

export default DeleteExam;
