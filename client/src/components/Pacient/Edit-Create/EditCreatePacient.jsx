import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import './EditCreatePacient.css'
import PacientService from "../../../services/PacientService";

const EditCreatePacient = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (action=='Edit') {
      form.setFieldsValue(initialValues);
      setIsEditing(true);
    } 
    if (action=='Create'){
      form.resetFields();
      setIsEditing(false);
    }
    console.log(form);
    console.log(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    let response = '';
    if (action=='Edit') response = PacientService.editPatient(values.id, values);
    if (action=='Create') response = PacientService.createPatient(values);
    if (response) {
      handleSubmit(response, 'Exito', 'Se ha editado correctamente');
      form.resetFields();
    }
  };

  return (
    <Modal
      title={isEditing ? "Editar Paciente" : "Crear Paciente"}
      open={isModalOpen}
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
          <Button key="back" onClick={handleCancel} style={{marginRight:'15px'}}>
            Cancelar
          </Button>
          <Button htmlType="submit" style={{background: '#4096FF', color:'white'}}>
            {isEditing ? "Editar" : "Crear"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditCreatePacient;
