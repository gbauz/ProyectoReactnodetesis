const express = require('express');
const path = require('path');
const { verificaToken, generateToken, revokeToken } = require('./controlador/tokens');
const Conexion = require('./controlador/conexion');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Comprobar la conexión a MySQL
Conexion.then((conn) => {
  console.log('Conectado a MySQL');
}).catch((err) => {
  console.error('Error conectando a MySQL:', err);
});

// Endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo_electronico, contraseña } = req.body;

  if (!correo_electronico || !contraseña) {
    return res.status(400).json({ error: 'Correo electrónico y contraseña son requeridos.' });
  }

  try {
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE correo_electronico = ? AND contraseña = ?',
      [correo_electronico, contraseña]
    );

    if (rows.length > 0) {
      const usuario = rows[0];
      if (usuario.rol_id === 1) {
        const token = generateToken(usuario);
        res.json({ success: true, token });
      } else {
        res.status(403).json({ error: 'No tienes permiso para acceder.' });
      }
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    res.status(500).json({ error: 'Error al autenticar.' });
  }
});

// Endpoint para verificar si un usuario es administrador
app.get('/api/session', verificaToken, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      const { email, name } = req.user;
      res.json({ isAdmin: true, user: { email, name } });
    } else {
      res.json({ isAdmin: false });
    }
  } catch (error) {
    console.error('Error al obtener información de sesión:', error);
    res.status(500).json({ error: 'Error al obtener información de sesión.' });
  }
});

// Endpoint para cerrar sesión
app.post('/api/logout', verificaToken, (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    revokeToken(token); // Revocar el token actual
    res.json({ success: true, message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar sesión.' });
  }
});

// Servir archivos estáticos desde la carpeta 'client/build'
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Ruta para manejar todas las demás solicitudes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/login`);
});
