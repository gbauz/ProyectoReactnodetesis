import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import './EditCreateSpecialty.css';
import AnalysisService from "../../../services/AnalysisService";
import SpecialtyService from "../../../services/SpecialtyService";

const EditCreateEspecialty = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
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
      if (action=='Edit') response = await SpecialtyService.editSpecialty(values.id_especialidad, values);
      if (action=='Create') response = await SpecialtyService.createSpecialty(values);
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
      title={isEditing ? "Editar Especialidad" : "Crear Especialidad"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id_especialidad" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="nombre" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre!' }]}>
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

export default EditCreateEspecialty;
