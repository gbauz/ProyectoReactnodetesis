import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Paneladministrador = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/session'); // Verifica si es administrador
        const data = await response.json();

        if (!data.isAdmin) {
          navigate('/'); // Redirige al inicio si no es administrador
        } else {
          setIsAdmin(true); // Permitir acceso si es administrador
        }
      } catch (error) {
        console.error('Error al verificar la sesión:', error);
        navigate('/'); // En caso de error, redirigir al inicio
      }
    };

    checkSession(); // Verificar cuando el componente se monta
  }, [navigate]);

  if (!isAdmin) {
    return null; // No mostrar el contenido si no es administrador
  }

  return (
    <div className="d-flex">
      {/* Barra lateral fija */}
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
        </ul>
      </div>

      {/* Área principal desplazada a la derecha */}
      <div className="p-4" style={{ marginLeft: '200px', width: 'calc(100% - 200px)' }}>
        <h2>Bienvenido al Panel Administrativo</h2>
        <p>Área para realizar tareas administrativas.</p>

        {/* Ejemplo de tarjeta */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Estadísticas del Panel</h5>
            <p>Información clave para administración.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paneladministrador;
