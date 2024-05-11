import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Usuario.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token no encontrado en localStorage');
          return;
        }

        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          console.error('Error fetching users:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleCreateUser = () => {
    navigate('/users/create');
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este usuario?');

    if (!confirmDelete) {
      return; // Cancelar la eliminación si el usuario cancela la confirmación
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
        setUsers(users.filter((user) => user.id_usuario !== userId));
      } else {
        console.error('Error deleting user:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEditUser = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  return (
    <div className="container mt-4">
      <h2>Usuarios</h2>
      <div className="mb-3">
        <button className="btn btn-success" onClick={handleCreateUser}>
          <i className="fas fa-plus"></i> Crear Usuario
        </button>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo Electrónico</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id_usuario}>
              <td>{user.nombre}</td>
              <td>{user.correo_electronico}</td>
              <td>{user.rol}</td>
              <td>
                <button className="btn btn-danger btn-sm mr-2" onClick={() => handleDeleteUser(user.id_usuario)}>
                  <i className="fas fa-trash"></i> 
                </button>
                <button className="btn btn-primary btn-sm mr-2" onClick={() => handleEditUser(user.id_usuario)}>
                  <i className="fas fa-edit"></i> 
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Users;
