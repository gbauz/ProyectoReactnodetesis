import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importación de Bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css';
import './login.css';
import labLogo from './image/GB-LAB1.png';
import LoginService from '../../services/LoginService';

const Login = () => {
  const [cedula, setCedula] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const axiosResponse = await LoginService.logIn(JSON.stringify({ cedula: cedula, contraseña: password }));
      if (axiosResponse.status == '200') {
        const data = await axiosResponse.data;
        const { token } = data;
        localStorage.setItem('token', token); // Almacena el token en localStorage
        navigate('/admin', {replace: true}); // Redirige a la página protegida
      } else {
        setError(axiosResponse.response.data.error); // Muestra el mensaje de error del servidor
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión.');
    }
  };

  return (
    <div className="bs-body-color min-vh-100 d-flex align-items-center justify-content-center w-100">
      <div className="container">
        <div className="row justify-content-center">
          <div className="bs-secondary-color col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-body text-center">
              {/* <h4 style={{ color: 'blue' }}>Inicio de Sesión</h4> */}
              <img  src={labLogo} alt="Laboratorio Clínico GB-Lab" className="img-fluid mb-3" />
                <div className="form-floating mb-3">
                  <input
                    className="form-control"
                    id="input"
                    type="text"
                    placeholder="Usuario"
                    value={cedula}
                    onChange={(e) => setCedula(e.target.value)}
                  />
                  <label htmlFor="input" style={{ color: '#808080', opacity: 0.8 }}>
                    Usuario <i className="fa fa-user">
                  </i></label>
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
                  <label htmlFor="inputPassword" style={{ color: '#808080', opacity: 0.8 }}>
                    Contraseña <i className="fa fa-lock"></i>
                  </label>
                  {error && <div className="text-danger">{error}</div>}
                </div>
                <div className="d-grid gap-2">
                  <button className="btn btn-primary" onClick={handleLogin}>
                    Login
                  </button>
                  <a href="/register" className="mt-3">¿Olvidaste tu contraseña?</a>
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