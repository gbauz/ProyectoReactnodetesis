import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Table, Modal, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PermissionModal from './PermissionModal'; // Asegúrate de crear este componente
import './usuario.css';

const { Title } = Typography;

const RoleForm = ({ role, permissionsList, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: role ? role.nombre : '',
    permisos: role ? role.permisos.map(p => p.id_permiso) : []
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePermissionsChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevFormData) => {
      let updatedPermisos = [...prevFormData.permisos];
      if (checked) {
        updatedPermisos.push(parseInt(value));
      } else {
        updatedPermisos = updatedPermisos.filter((permiso) => permiso !== parseInt(value));
      }
      return {
        ...prevFormData,
        permisos: updatedPermisos
      };
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  const groupPermissions = () => {
    const grouped = permissionsList.reduce((acc, permiso) => {
      const category = permiso.categoria || 'Módulos';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(permiso);
      return acc;
    }, {});

    return grouped;
  };

  const groupedPermissions = groupPermissions();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSavePermission = (newPermission) => {
    permissionsList.push(newPermission);
    handleCloseModal();
  };

  const columns = [
    {
      title: 'Categoría',
      dataIndex: 'categoria',
      key: 'categoria',
    },
    {
      title: 'Permisos',
      dataIndex: 'permisos',
      key: 'permisos',
      render: (permisos) => (
        <>
          {permisos.map((permiso) => (
            <Checkbox
              key={permiso.id_permiso}
              value={permiso.id_permiso}
              checked={formData.permisos.includes(permiso.id_permiso)}
              onChange={handlePermissionsChange}
            >
              {permiso.nombre_permiso}
            </Checkbox>
          ))}
        </>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'permisos',
      key: 'descripcion',
      render: (permisos) => (
        <>
          {permisos.map((permiso) => (
            <div key={permiso.id_permiso}>{permiso.descripcion}</div>
          ))}
        </>
      ),
    },
  ];

  const data = Object.entries(groupedPermissions).map(([category, permisos]) => ({
    key: category,
    categoria: category,
    permisos,
  }));

  return (
    <div className="roles">
      <div className="header-content">
      <Title level={4}>{role ? 'Editar Rol' : 'Crear Nuevo Rol'}</Title>
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Nombre del Rol" required>
          <Input
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese el nombre del rol"
          />
        </Form.Item>
        <Form.Item label="Asignar Permisos al Rol">
          <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
            Crear Permiso
          </Button>
          <Table
            columns={columns}
            dataSource={data}
            pagination={false}
            bordered
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {role ? 'Guardar' : 'Crear'}
          </Button>
          <Button type="default" onClick={onCancel} style={{ marginLeft: '8px' }}>
            Cancelar
          </Button>
        </Form.Item>
      </Form>
      <PermissionModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSavePermission}
      />
      </div>
    </div>
  );
};

export default RoleForm;
