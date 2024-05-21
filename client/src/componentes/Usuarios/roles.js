import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component';
import './Usuario.css'; // Asegúrate de tener el archivo de estilos adecuado
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    permisos: []
  });
  const [permissionsList, setPermissionsList] = useState([]);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editRole, setEditRole] = useState(null);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en localStorage');
        return;
      }

      const rolesResponse = await fetch('/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (rolesResponse.ok) {
        const rolesData = await rolesResponse.json();
        setRoles(rolesData.roles);
        setFilteredRoles(rolesData.roles);
      } else {
        console.error('Error fetching roles:', rolesResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const fetchPermissions = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en localStorage');
        return;
      }

      const permissionsResponse = await fetch('/api/permissions', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (permissionsResponse.ok) {
        const permissionsData = await permissionsResponse.json();
        setPermissionsList(permissionsData.permissions);
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
    setShowModal(true);
    setEditRole(null);
    setFormData({
      nombre: '',
      permisos: []
    });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePermissionsChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setFormData({
      ...formData,
      permisos: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let endpoint = '/api/roles';
      let method = 'POST';

      if (editRole) {
        endpoint = `/api/roles/${editRole.id_rol}`;
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
        setShowModal(false);
      } else {
        console.error('Error en la operación:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la operación:', error);
    }
  };

  const handleDeleteRole = async (roleId) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este rol?');
    if (!confirmDelete) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setRoles(roles.filter((role) => role.id_rol !== roleId));
      } else {
        console.error('Error al eliminar rol:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar rol:', error);
    }
  };

  const handleEditRole = (role) => {
    setEditRole(role);
    setFormData({
      nombre: role.nombre,
      permisos: role.permisos.map(p => p.id_permiso)
    });
    setShowModal(true);
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
      head: [['ID', 'Nombre', 'Permisos']],
      body: rolesData,
    });

    doc.save('reporte_roles.pdf');
  };

  const columns = [
    {
      name: 'ID',
      selector: row => row.id_rol,
      sortable: true,
    },
    {
      name: 'Nombre',
      selector: row => row.nombre,
      sortable: true,
    },
    {
      name: 'Permisos',
      selector: row => (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {row.permisos.map(permiso => (
            <li key={permiso.id_permiso}>{permiso.permiso_nombre}</li>
          ))}
        </ul>
      ),
      sortable: true,
    },
    {
      name: 'Acciones',
      cell: row => (
        <>
          <button className="btn btn-primary btn-sm mr-2 action-button" onClick={() => handleEditRole(row)}>
            <i className="fas fa-edit"></i>
          </button>
          <button className="btn btn-danger btn-sm mr-2 action-button" onClick={() => handleDeleteRole(row.id_rol)}>
            <i className="fas fa-trash"></i>
          </button>
        </>
      ),
    },
  ];

  return (
    <div className="container mt-4">      
      <h4>Roles</h4>
      <div className="d-flex justify-content-end mb-3">
        <input
          type="text"
          className="form-control w-25 mr-2"
          placeholder="Buscar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button className="btn btn-success mr-2" onClick={handleCreateRole}>
          <i className="fas fa-plus"></i> Crear Rol
        </button>
      </div>
      <DataTable
        columns={columns}
        data={filteredRoles}
        pagination
        highlightOnHover
        pointerOnHover
        responsive
        customStyles={{
          headCells: {
            style: {
              backgroundColor: '#0056b3',
              color: '#ffffff',
            },
          },
        }}
      />
      <button className="btn btn-primary mt-3" onClick={handleShowReport}>
        Mostrar Reporte
      </button>

      {showModal && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editRole ? 'Editar Rol' : 'Crear Rol'}</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Nombre del Rol</label>
                    <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
                  </div>
                   <div className="form-group">
                    <label>Permisos</label>
                    <select className="form-control" name="permisos" value={formData.permisos} onChange={handlePermissionsChange}>
                    <option value="">Seleccionar Permisos</option>
                      {permissionsList.map(permiso => (
                        <option key={permiso.id_permiso} value={permiso.id_permiso}>{permiso.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">{editRole ? 'Guardar' : 'Crear'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
