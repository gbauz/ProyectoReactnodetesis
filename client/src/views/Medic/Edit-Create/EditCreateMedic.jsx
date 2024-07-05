import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select } from "antd";
import './EditCreateMedic.css'
import MedicService from "../../../services/MedicService";

const EditCreateMedic = ({ isModalOpen, handleSubmit, handleCancel, initialValues, action }) => {
  const [form]                    = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError]         = useState(null);
  const [loading, setLoading]     = useState(false);
  let response;

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
      if (action=='Edit') response = await MedicService.editMedic(values.cedula, values);
      if (action=='Create') response = await MedicService.createMedic(values);
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
      title={isEditing ? "Editar Médico" : "Crear Médico"}
      open={isModalOpen}
      onCancel={handleCancel}
      centered
      maskClosable={false}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        {/* <Form.Item name="id_medico" hidden>
          <Input />
        </Form.Item> */}
        <Form.Item name="nombre_apellido" label="Nombre" rules={[{ required: true, message: 'Por favor ingrese el nombre!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="cedula" label="Cedula" rules={[{ required: true, message: 'Por favor ingrese la cédula!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="especialidad" label="Especialidad" rules={[{ required: true, message: 'Por favor ingrese la especialidad!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="celular" label="Teléfono" rules={[{ required: true, message: 'Por favor ingrese el teléfono!' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="direccion" label="Dirección" rules={[{ required: true, message: 'Por favor ingrese la dirección!' }]}>
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

export default EditCreateMedic;
