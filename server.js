const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken'); // Importa la librería jsonwebtoken
const Conexion = require('./controlador/conexion');
const { verificaToken, tokensRevocados, generateToken, revokeToken } = require('./controlador/tokens');

const app = express();
const port = process.env.PORT || 3000;
const tokensRevocados = new Set();// Crear un conjunto para almacenar los tokens revocados

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

<<<<<<< HEAD
=======
  // Verificar si los campos están vacíos
>>>>>>> 9d6b3cc28a543820ccbf22e624278f977dd30b3f
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
<<<<<<< HEAD
      if (usuario.rol_id === 1) {
        const token = generateToken(usuario);
=======
      if (usuario.rol_id === 1) { // Verificar si el usuario es administrador
        // Generar un token JWT
        const token = jwt.sign({ userId: usuario.id, isAdmin: true, email: usuario.correo_electronico, name: usuario.nombre }, 'tu_clave_secreta', { expiresIn: '1h' });
>>>>>>> 9d6b3cc28a543820ccbf22e624278f977dd30b3f

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

<<<<<<< HEAD
// Endpoint para verificar si un usuario es administrador
app.get('/api/session', verificaToken, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      const { email, name } = req.user;
      res.json({ isAdmin: true, user: { email, name } });
    } else {
=======
// Middleware para verificar el token en rutas protegidas
function verificaToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  const tokenValue = token.split(' ')[1];

  // Verificar si el token está en la lista de tokens revocados
  if (tokensRevocados.has(tokenValue)) {
    return res.status(401).json({ error: 'Token revocado. Inicie sesión nuevamente.' });
  }

  jwt.verify(tokenValue, 'tu_clave_secreta', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }
    
    req.user = decoded; // Decodificado exitosamente
    next();
  });
}

// Endpoint para verificar si un usuario es administrador (protegido con token)
app.get('/api/session', verificaToken, async (req, res) => {
  try {
    if (req.user && req.user.isAdmin) {
      //console.log('Usuario autenticado como administrador:', req.user);
      
      // Aquí puedes obtener el nombre del administrador desde req.user o tu base de datos
      const { email } = req.user;// Suponiendo que el nombre del administrador está en req.user.name
      const {name} = req.user;
      
      res.json({ isAdmin: true, user: { email, name } });
    } else {
      //console.log('Usuario no autenticado o no es administrador');
>>>>>>> 9d6b3cc28a543820ccbf22e624278f977dd30b3f
      res.json({ isAdmin: false });
    }
  } catch (error) {
    console.error('Error al obtener información de sesión:', error);
    res.status(500).json({ error: 'Error al obtener información de sesión.' });
  }
});

<<<<<<< HEAD
// Endpoint para cerrar sesión
app.post('/api/logout', verificaToken, (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    revokeToken(token);
=======
// Endpoint para cerrar sesión (opcionalmente podrías invalidar el token)
app.post('/api/logout', verificaToken, (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];

    // Agregar el token actual a la lista de tokens revocados
    tokensRevocados.add(token);
>>>>>>> 9d6b3cc28a543820ccbf22e624278f977dd30b3f
    res.json({ success: true, message: 'Sesión cerrada exitosamente.' });
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    res.status(500).json({ error: 'Error al cerrar sesión.' });
  }
});

// Servir archivos estáticos desde la carpeta 'client/build'
app.use(express.static(path.join(__dirname, 'client', 'build')));

<<<<<<< HEAD
// Ruta para manejar todas las demás solicitudes
=======
// Ruta para manejar todas las demás solicitudes (react-router)
>>>>>>> 9d6b3cc28a543820ccbf22e624278f977dd30b3f
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}/login`);
});
