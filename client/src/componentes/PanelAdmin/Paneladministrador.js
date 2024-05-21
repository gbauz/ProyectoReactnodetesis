import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Users from '../Usuarios/Users';
import Roles from '../Usuarios/roles';
import './AdminPage.css';

const AdminPage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [userPermissions, setUserPermissions] = useState([]);
  const [view, setView] = useState('dashboard'); // Nuevo estado para controlar la vista actual
  const [sidebarOpen, setSidebarOpen] = useState(false); // Estado para controlar la visibilidad de la barra lateral en móviles
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

        if (response.ok) {
          const data = await response.json();
          setIsAdmin(data.isAdmin);

          if (data.isAdmin) {
            const firstName = data.user.name.split(' ')[0];
            setUserName(firstName);
            setUserPermissions(data.user.permissions);
          }
        } else {
          console.error('Error al hacer la solicitud protegida:', response.statusText);
        }
      } catch (error) {
        console.error('Error al hacer la solicitud protegida:', error);
      }
    };

    handleProtectedRequest();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); // Redirige al usuario a la página de inicio de sesión
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <>
            <h2>{`Bienvenido al Panel Administrativo, ${userName}!`}</h2>
            <p>Área para realizar tareas administrativas.</p>

            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Estadísticas del Panel</h5>
                <p>Información clave para administración.</p>
              </div>
            </div>
          </>
        );
      case 'users':
        return <Users />;
      case 'roles':
        return <Roles />
      case 'settings':
        return <div>Configuración</div>;
      case 'reports':
        return <div>Reportes</div>;
      default:
        return <div>Vista no encontrada</div>;
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getBreadcrumb = () => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'users':
        return 'Usuarios > Usuarios';
      case 'roles':
        return 'Usuarios > Roles';
      case 'settings':
        return 'Configuración';
      case 'reports':
        return 'Reportes';
      default:
        return '';
    }
  };

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '';
  };

  return (
    <div>
      {/* Barra superior */}
      {isAdmin && (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <a className="navbar-brand" href="#" >  Panel Administrativo INSPI</a>
          <button className="navbar-toggler" type="button" onClick={toggleSidebar}>
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse justify-content-end d-none d-lg-flex">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <div className="user-initial bg-light text-dark rounded-circle d-flex justify-content-center align-items-center">
                    {getInitial(userName)}
                  </div>
                  <span className="ms-2">{userName}</span>
                </a>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                  <li><a className="dropdown-item" href="#">Perfil</a></li>
                  <li><a className="dropdown-item" href="#">Ajustes</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Cerrar Sesión</button></li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <div className="d-flex">
        {/* Barra lateral fija */}
        {isAdmin && (
          <div className={`sidebar bg-dark text-white p-3 ${sidebarOpen ? 'show' : ''}`}>
            <div className="breadcrumb mb-3">
              <i className="fas fa-home"></i> {getBreadcrumb()}
            </div>
            <ul className="nav flex-column">
              <li className="nav-item d-lg-none">
                <div className="nav-link">
                  <span>{userName}</span>
                </div>
                <div className="nav-item">
                  <a className="nav-link text-white" href="/profile">Perfil</a>
                </div>
                <div className="nav-item">
                  <a className="nav-link text-white" href="/settings">Ajustes</a>
                </div>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white btn btn-link" onClick={() => { setView('dashboard'); toggleSidebar(); }}>
                  <i className="fas fa-tachometer-alt"></i> Dashboard
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link text-white btn btn-link"
                  data-bs-toggle="collapse"
                  data-bs-target="#userSubMenu"
                  aria-expanded="false"
                  aria-controls="userSubMenu"
                >
                  <i className="fas fa-users"></i>Usuarios <i className="fas fa-chevron-down"></i>
                </button>
                {/* Submenu para la gestión de usuarios */}
                <div className="collapse" id="userSubMenu">
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <button
                        className="nav-link text-white btn btn-link"
                        onClick={() => { setView('users'); toggleSidebar(); }}
                      >
                        Usuarios
                      </button>
                    </li>
                    <li className="nav-item">
                      <button
                        className="nav-link text-white btn btn-link"
                        onClick={() => { setView('roles'); toggleSidebar(); }}
                      >
                        Roles
                      </button>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white btn btn-link" onClick={() => { setView('settings'); toggleSidebar(); }}>
                  <i className="fas fa-cogs"></i> Configuración
                </button>
              </li>
              <li className="nav-item">
                <button className="nav-link text-white btn btn-link" onClick={() => { setView('reports'); toggleSidebar(); }}>
                  <i className="fas fa-file-alt"></i> Reportes
                </button>
              </li>
              <li className="nav-item d-lg-none">
                <div className="nav-item">
                  <button className="nav-link text-white btn btn-link" onClick={handleLogout}>Cerrar Sesión</button>
                </div>
              </li>
            </ul>
          </div>
        )}

        <div className={`content p-4`}>
          {isAdmin ? renderContent() : <h1>No tienes permiso para acceder a esta página.</h1>}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
