import React, { useState } from "react";
import "./DeleteResults.css";
import { Button, Modal } from "antd";
import SpecialtyService from "../../../services/SpecialtyService";
import ResultService from "../../../services/ResultService";

const DeleteSpecialty = ({ isDeleteModalOpen, handleDelete, handleDeleteCancel, initialValues }) => {
  const [error, setError] = useState(null);
  let response;

  const onFinish = async () => {
    try {
      for(let exam of initialValues.examen){
        if(exam.id_resultado !== null){
          response = await ResultService.deleteResult(exam.id_resultado)
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
      title="Eliminar Análisis"
      open={isDeleteModalOpen}
      onCancel={handleDeleteCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <p>¿Estás seguro de que deseas eliminar este análisis?</p>
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

export default DeleteSpecialty;
