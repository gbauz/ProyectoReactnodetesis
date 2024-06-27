import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import './EditPaciente.css'

const EditPaciente = ({ isModalOpen, handleSubmit, handleCancel, initialValues }) => {
  const [form] = Form.useForm();
  
  useEffect(() => {
    if (initialValues) form.setFieldsValue(initialValues) 
    // console.log(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    console.log(values);
    handleSubmit("Exito");
    form.resetFields();
  };

  return (
    <Modal
      title="Crear Paciente"
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
        <Form.Item>
          <Button key="back" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button htmlType="submit">
            Editar
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditPaciente;
