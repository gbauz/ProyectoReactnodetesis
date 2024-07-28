import React, { useState } from "react";
import "./DeleteExaminationOrder.css";
import ExaminationOrderService from "../../../services/ExaminationOrderService";
import { Button, Modal } from "antd";

const DeleteExaminationOrder = ({ isDeleteModalOpen, handleDelete, handleDeleteCancel, initialValues }) => {
  const [error, setError] = useState(null);
  let response;

  const onFinish = async () => {
    try {
      for (const analysis of initialValues.analisis) {
        for (const examen of analysis.examen) {
          response = await ExaminationOrderService.deleteExaminationOrder(examen.id_realizar);
        }
      }
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
      title="Eliminar Paciente"
      open={isDeleteModalOpen}
      onCancel={handleDeleteCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <p>¿Estás seguro de que deseas eliminar este paciente?</p>
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

export default DeleteExaminationOrder;
