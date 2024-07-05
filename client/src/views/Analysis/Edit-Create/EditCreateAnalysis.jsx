import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import './EditCreateAnalysis.css';
import AnalysisService from "../../../services/AnalysisService";

const EditCreateAnalysis = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                    = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  let response = '';

  useEffect(() => {
    if (action=='Edit') {
      form.setFieldsValue(initialValues);
      setIsEditing(true);
    } 
    if (action=='Create'){
      form.resetFields();
      setIsEditing(false);
    }
  }, [isModalOpen, initialValues, form, action]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      if (action=='Edit') response = await AnalysisService.editAnalysis(values.id_analisis, values);
      if (action=='Create') response = await AnalysisService.createAnalysis(values);
    } catch (error) {
      setError(error);
    }finally {
      setLoading(false);
      if (response) {
        handleSubmit(response);
        form.resetFields();
      }
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Análisis" : "Crear Análisis"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id_analisis" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="analisis" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre!' }]}>
          <Input />
        </Form.Item>
        <Form.Item className="footer">
          <Button key="back" onClick={handleCancel} style={{marginRight:'15px'}}>
            Cancelar
          </Button>
          <Button htmlType="submit" style={{background: '#4096FF', color:'white'}} loading={loading}>
            {isEditing ? "Editar" : "Crear"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCreateAnalysis;
