import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Users from './Usuarios/Users'; // Importar UsersPage

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPermissions, setUserPermissions] = useState([]); // Agrega estado para los permisos del usuario

  const navigate = useNavigate();

  useEffect(() => {
    const handleProtectedRequest = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('Token no encontrado en localStorage');
          return;
        }

        const response = await fetch('/api/session', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const data = await response.json();
        setIsAdmin(data.isAdmin);

        if (data.isAdmin) {
          setUserName(data.user.name); // Establecer el nombre del usuario si es administrador
          setUserPermissions(data.user.permissions);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud protegida:', error);
      }
    };

    handleProtectedRequest();

  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage al cerrar sesión
    navigate('/'); // Redirige al usuario a la página de inicio de sesión
  };

  return (
    <div className="d-flex">
      {/* Barra lateral fija */}
      {isAdmin && (
        <div className="bg-dark text-white p-3" style={{ width: '200px', height: '100vh', position: 'fixed' }}>
          <h4 className="text-center">Panel Administrativo</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="/dashboard">
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/users">
                <i className="fas fa-users"></i> Usuarios
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/settings">
                <i className="fas fa-cogs"></i> Configuración
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/reports">
                <i className="fas fa-file-alt"></i> Reportes
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger mt-4" onClick={handleLogout}>Cerrar Sesión</button>
            </li>
          </ul>
        </div>
      )}

      {/* Área principal desplazada a la derecha */}
      <div className="p-4" style={{ marginLeft: isAdmin ? '200px' : '0', width: isAdmin ? 'calc(100% - 200px)' : '100%' }}>
        {isAdmin ? (
          <>
            <h2>{`Bienvenido al Panel Administrativo, ${userName}!`}</h2>
            <p>Área para realizar tareas administrativas.</p>

            {/* Ejemplo de tarjeta */}
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Estadísticas del Panel</h5>
                <p>Información clave para administración.</p>
              </div>
            </div>

            {/* Renderizar UsersPage con props */}
           {/*  <Users isAdmin={isAdmin} userPermissions={userPermissions} /> */}
          </>
        ) : (
          <h1>No tienes permiso para acceder a esta página.</h1>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
