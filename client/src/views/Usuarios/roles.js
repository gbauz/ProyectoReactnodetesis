import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button, Input, Space, Tooltip, Tag } from 'antd';
import { SearchOutlined, EditFilled, DeleteFilled, PlusCircleOutlined } from '@ant-design/icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import RoleForm from './roleForm';
import Uri from '../../environment/environment';
import './usuario.css';


const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [rolesPermissions, setRolesPermissions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editRole, setEditRole] = useState(null);
  const [search, setSearch] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchRoles = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en sessionStorage');
        return;
      }

      const rolesResponse = await fetch(Uri+'roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData.roles);
        setFilteredRoles(rolesData.roles);

        const sessionResponse = await fetch(Uri+'session', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setRolesPermissions(sessionData.user.permissions);
        } else {
          console.error('Error fetching session:', sessionResponse.statusText);
        }
      } else {
        console.error('Error fetching roles:', rolesResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en sessionStorage');
        return;
      }

      const permissionsResponse = await fetch(Uri+'permisos', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (permissionsResponse.ok) {
        const permissionsData = await permissionsResponse.json();
        setPermissionsList(permissionsData.permisos);
      } else {
        console.error('Error fetching permissions:', permissionsResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching permissions:', error);
    }
  };

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  useEffect(() => {
    const result = roles.filter(role => {
      return role.nombre.toLowerCase().includes(search.toLowerCase());
    });
    setFilteredRoles(result);
  }, [search, roles]);

  const handleCreateRole = () => {
    setShowForm(true);
    setEditRole(null);
    setErrorMessage(null);
  };

  const handleEditRole = (role) => {
    setEditRole(role);
    setShowForm(true);
    setErrorMessage(null);
  };

  const handleDeleteRole = async (roleId) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este rol?');
    if (!confirmDelete) {
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      const response = await fetch(Uri+`roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const responseData = await response.json();
      if (response.ok) {
        setRoles(roles.filter(role => role.id_rol !== roleId));
        setFilteredRoles(filteredRoles.filter(role => role.id_rol !== roleId));
        setErrorMessage('');
      } else {
        setErrorMessage(responseData.error);
      }
    } catch (error) {
      console.error('Error al eliminar rol:', error);
    }
  };

  const handleSaveRole = async (formData) => {
    const { nombre } = formData;
    if (!nombre) {
      alert('Todos los campos son obligatorios.');
      return;
    }
    try {
      const token = sessionStorage.getItem('token');
      let endpoint = Uri+'roles';
      let method = 'POST';

      if (editRole) {
        endpoint = Uri+`roles/${editRole.id_rol}`;
        method = 'PUT';
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchRoles();
        setShowForm(false);
        setErrorMessage('');
      } else {
        console.error('Error en la operación:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la operación:', error);
    }
  };

  const handleShowReport = () => {
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(20, 20, 'Reporte de Roles');

    const rolesData = roles.map(role => [
      role.id_rol,
      role.nombre,
      role.permisos.map(p => p.permiso_nombre).join(', ')
    ]);

    doc.autoTable({
      head: [['ID', 'Rol', 'Permisos']],
      body: rolesData,
    });

    doc.save('reporte_roles.pdf');
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id_rol',
      sorter: (a, b) => a.id_rol - b.id_rol,
    },
    {
      title: 'Rol',
      dataIndex: 'nombre',
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: 'Permisos',
      dataIndex: 'permisos',
      align: "center",
      render: permisos => (
        <>
          {permisos.map(permiso => (
            <Tag key={permiso.id_permiso}>{permiso.permiso_nombre}</Tag>
          ))}
        </>
      ),
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {rolesPermissions.includes(5) && (
            <Tooltip title="Editar">
              <Button
                type="primary"
                icon={<EditFilled />}
                onClick={() => handleEditRole(record)}
              />
            </Tooltip>
          )}
          {rolesPermissions.includes(6) && (
            <Tooltip title="Eliminar">
              <Button
                type="danger"
                icon={<DeleteFilled />}
                onClick={() => handleDeleteRole(record.id_rol)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="roles" >
      {!showForm ? (
        <>
        <div className="header-content">
        <h3>Roles</h3>
          <div className="d-flex justify-content-end mb-3">
            <Input
              placeholder="Buscar por rol.."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              prefix={<SearchOutlined />}
              style={{ width: 300, marginRight: 10 }}
            />
            {rolesPermissions.includes(4) && (
              <Button
                type="primary"
                icon={<PlusCircleOutlined />}
                onClick={handleCreateRole}
              >
                Crear Rol
              </Button>
            )}
          </div>
          {errorMessage && (
            <div className="alert alert-danger mt-3" role="alert">
              {errorMessage}
            </div>
          )}
          </div>
          <Table
            columns={columns}
            dataSource={filteredRoles}
            pagination={{ pageSize: 5 }}
            rowKey="id_rol"
            className="table-responsive" />
          
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={handleShowReport}
            style={{ marginTop: 16 }}
          >
            Mostrar Reporte
          </Button>
        </>
      ) : (
        <RoleForm
          role={editRole}
          permissionsList={permissionsList}
          onSave={handleSaveRole}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default Roles;
