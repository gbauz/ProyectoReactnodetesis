import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importación de Bootstrap

const Login = () => {
  const [email, setEmail] = useState(''); // Estado para el email
  const [password, setPassword] = useState(''); // Estado para la contraseña
  const navigate = useNavigate(); // Para redirigir después del login

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_electronico: email, contraseña: password }), // Datos de inicio de sesión
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/admin'); // Redirigir al Panel Administrativo si el login es exitoso
      } else {
        alert(data.error); // Mostrar el mensaje de error
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error); // Manejo de errores
      alert('Error al iniciar sesión.'); // Mensaje genérico de error
    }
  };

  return (
    <div className="bg-primary min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header text-center">
                <h3>Inicio de Sesión</h3>
              </div>
              <div className="card-body">
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="inputEmail"
                    type="email"
                    placeholder="Correo electrónico"
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
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={handleLogin}
                  >
                    Iniciar Sesión
                  </button>
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
