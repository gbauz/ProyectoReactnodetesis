import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import './EditCreatePacient.css'
import PacientService from "../../../services/PacientService";

const EditCreatePacient = ({ isModalOpen, handleSubmit, handleCancel, initialValues }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setIsEditing(true);
    } else {
      form.resetFields();
      setIsEditing(false);
    }
    console.log(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    if (isEditing) {
      PacientService.editPatient(values.id, values);
    } else {
      console.log(values);
      // PacientService.createPatient(values);
    }
    handleSubmit('Exito', 'Exito', 'Se ha editado correctamente');
    form.resetFields();
  };

  return (
    <Modal
      title={isEditing ? "Editar Paciente" : "Crear Paciente"}
      open={isModalOpen}
      onOk={handleSubmit}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="id" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please input the name!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="chinese" label="Chinese" rules={[{ required: true, message: 'Please input the number!' }]}>
          <Input />
        </Form.Item>
        <Form.Item className="footer">
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button htmlType="submit">
            {isEditing ? "Editar" : "Crear"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCreatePacient;
