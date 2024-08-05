import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Input } from 'antd';
import Uri from '../../environment/environment';

const PermissionModal = ({ isOpen, onClose, onSave }) => {
  const [permissions, setPermissions] = useState([]);
  const [form] = Form.useForm();
  const [formData, setFormData] = useState({
    nombre_permiso: '',
    categoria: '',
    descripcion: ''
  });

  const fetchPermissions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en sessionStorage');
        return;
      }
      const response = await fetch(Uri + 'permisos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permisos); // Assuming the response contains a list of permissions
      } else {
        console.error('Error fetching permissions:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields(); // Validate fields before submitting
      const token = sessionStorage.getItem('token');
      const response = await fetch(Uri + 'permisos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });
      if (response.ok) {
        const newPermission = await response.json();
        onSave(newPermission);
        onClose(); // Close the modal after saving
      } else {
        console.error('Error creating permission:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating permission:', error);
    }
  };

  return (
    <Modal
      title="Crear Nuevo Permiso"
      visible={isOpen}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Guardar
        </Button>
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={formData}
      >
        <Form.Item
          label="Nombre del Permiso"
          name="nombre_permiso"
          rules={[{ required: true, message: 'Por favor ingrese el nombre del permiso' }]}
        >
          <Input
            name="nombre_permiso"
            value={formData.nombre_permiso}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Categoría"
          name="categoria"
          rules={[{ required: true, message: 'Por favor ingrese la categoría' }]}
        >
          <Input
            name="categoria"
            value={formData.categoria}
            onChange={handleChange}
          />
        </Form.Item>
        <Form.Item
          label="Descripción"
          name="descripcion"
          rules={[{ required: true, message: 'Por favor ingrese la descripción' }]}
        >
          <Input.TextArea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PermissionModal;
