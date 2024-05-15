import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Usuario.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [userPermissions, setUserPermissions] = useState([]);
  
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    correo_electronico: '',
    contraseña: '',
    rol_id: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);

  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en localStorage');
        return;
      }
  
      const usersResponse = await fetch('/api/users', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      if (usersResponse.ok) {
        const userData = await usersResponse.json();
        setUsers(userData.users);
  
        const sessionResponse = await fetch('/api/session', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  
        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          setUserPermissions(sessionData.user.permissions);
        } else {
          console.error('Error fetching session:', sessionResponse.statusText);
        }
      } else {
        console.error('Error fetching users:', usersResponse.statusText);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('Token no encontrado en localStorage');
        return;
      }
      const response = await fetch('/api/roles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setRoles(data.roles);
      } else {
        console.error('Error fetching roles:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);
  

  const handleCreateUser = () => {
    setShowModal(true);
    setEditUser(null);
    setFormData({
      cedula: '',
      nombre: '',
      correo_electronico: '',
      contraseña: '',
      rol_id: ''
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let endpoint = '/api/users';
      let method = 'POST';

      if (editUser) {
        endpoint = `/api/users/${editUser.cedula}`;
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
        const data = await response.json();
        fetchUsers();
        setShowModal(false);
      } else {
        console.error('Error en la operación:', response.statusText);
      }
    } catch (error) {
      console.error('Error en la operación:', error);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmDelete) {
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.ok) {
        setUsers(users.filter((user) => user.cedula !== userId));
      } else {
        console.error('Error al eliminar usuario:', response.statusText);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setFormData({
      ...user,
      contraseña: ''
    });
    setShowModal(true);
  };

  const handleReturnToAdminPage = () => {
    navigate('/admin');
  };

  const handleShowReport = () => {
    generatePDF();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(20, 20, 'Reporte de Usuarios');

    const usersData = users.map(user => [user.cedula, user.nombre, user.correo_electronico, user.rol]);

    doc.autoTable({
      head: [['Cedula', 'Nombre', 'Correo Electrónico', 'Rol']],
      body: usersData,
    });

    doc.save('reporte_usuarios.pdf');
  };

  return (
    <div className="container mt-4">      

      <button className="btn btn-secondary" onClick={handleReturnToAdminPage}>
        Volver
      </button>
      <h2>Usuarios</h2>
      <div className="mb-3">
        {userPermissions.includes(1) && (
          <button className="btn btn-success" onClick={handleCreateUser}>
            <i className="fas fa-plus"></i> Crear Usuario
          </button>
        )}
      </div>
      <div className="table-responsive">      
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Cedula</th>
              <th>Nombre</th>
              <th>Correo Electrónico</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.cedula}>
                <td>{user.cedula}</td>
                <td>{user.nombre}</td>
                <td>{user.correo_electronico}</td>
                <td>{user.rol}</td>
                <td>
                  <button className="btn btn-danger btn-sm mr-2 action-button" onClick={() => handleDeleteUser(user.cedula)}>
                    <i className="fas fa-trash"></i>
                  </button>
                  {userPermissions.includes(2) && (
                    <button className="btn btn-primary btn-sm mr-2 action-button" onClick={() => handleEditUser(user)}>
                      <i className="fas fa-edit"></i>
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="btn btn-primary mb-3" onClick={handleShowReport}>
        Mostrar Reporte
      </button>
      </div>

      {showModal && (
        <div className="modal show" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editUser ? 'Editar Usuario' : 'Crear Usuario'}</h5>
                <button type="button" className="close" onClick={handleCloseModal}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Cedula</label>
                    <input type="text" className="form-control" name="cedula" value={formData.cedula} onChange={handleChange} disabled={!!editUser} />
                  </div>
                  <div className="form-group">
                    <label>Nombre</label>
                    <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Correo Electrónico</label>
                    <input type="email" className="form-control" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Contraseña</label>
                    <input type="password" className="form-control" name="contraseña" value={formData.contraseña} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Rol</label>
                    <select className="form-control" name="rol_id" value={formData.rol_id} onChange={handleChange}>
                      <option value="">Seleccionar Rol</option>
                      {roles.map((role) => (
                        <option key={role.id_rol} value={role.id_rol}>{role.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary">{editUser ? 'Guardar' : 'Crear'}</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
