import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/js/all.js'; // Para íconos de FontAwesome
import { useState } from 'react'; // Para manejar el estado del formulario

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Lógica para manejar el login
    console.log(`Email: ${email}, Password: ${password}`);
  };

  return (
    <div className="bg-primary min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header">
                <h3 className="text-center font-weight-light my-4">Inicio de Sesión</h3>
              </div>
              <div className="card-body">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputEmail"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="inputEmail">Correo Electrónico</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputPassword"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label htmlFor="inputPassword">Contraseña</label>
                </div>
                <div className="form-check mb-3">
                  <input
                    className="form-check-input"
                    id="inputRememberPassword"
                    type="checkbox"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="inputRememberPassword"
                  >
                    Recordar Contraseña
                  </label>
                </div>
                <div className="d-flex align-items-center justify-content-between mt-4 mb-0">
                  <a className="small" href="/forgot-password">
                    ¿Olvidaste tu contraseña?
                  </a>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={handleLogin}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              </div>
              <div className="card-footer text-center py-3">
                <div className="small">
                  <a href="/register">¿Necesitas una cuenta? Regístrate aquí.</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

