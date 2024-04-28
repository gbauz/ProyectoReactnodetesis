import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js'; // Para íconos de FontAwesome

const Paneladministrador = () => {
  return (
    <div className="d-flex">
      {/* Barra lateral izquierda fija */}
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
        <p>Este es el área principal donde puedes ver información clave y realizar acciones administrativas.</p>

        {/* Ejemplo de tarjeta */}
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Estadísticas del Panel</h5>
            <p>Visualiza estadísticas clave aquí.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Paneladministrador;
