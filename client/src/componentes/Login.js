import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Importación de Bootstrap
import '@fortawesome/fontawesome-free/css/all.min.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ correo_electronico: email, contraseña: password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        const { token } = data;
        localStorage.setItem('token', token); // Almacena el token en localStorage
        navigate('/admin'); // Redirige a la página protegida
      } else {
        setError(data.error); // Muestra el mensaje de error del servidor
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión.');
    }
  };
  return (
    <div className="bs-body-color min-vh-100 d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="bs-secondary-color col-lg-5">
            <div className="card shadow-lg border-0 rounded-lg mt-5">
              <div className="card-header text-center">
                <img src="https://www.gob.ec/sites/default/files/styles/medium/public/2018-11/INSPI%20LOGO_0.png?itok=3n2KJyo2" alt="Logo de INSPI" />
                <h5>Inicio de Sesión</h5>
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
                  <label htmlFor="inputEmail" style={{ color: '#808080', opacity: 0.8 }}>
                    Correo Electrónico <i class="fa fa-user">
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
                  </label><br/>
                  {error && <div className="text-danger">{error}</div>}
                </div>
                <div className="d-flex justify-content-between">
                  <button
                    className="btn btn-primary"
                    onClick={handleLogin}
                  >
                    Iniciar Sesión
                  </button>
                  <a href="/register">¿Olvidaste tu Contraseña?</a>
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
