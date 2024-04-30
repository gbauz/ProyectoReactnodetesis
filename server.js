const express = require('express');
const session = require('express-session');
const path = require('path');
const Conexion = require('./controlador/conexion');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: 'tu_secreto', // Cambia esto por una clave segura
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Asegúrate de cambiar a true en producción con HTTPS
  })
);

// Comprobar la conexión a MySQL
Conexion.then((conn) => {
  console.log('Conectado a MySQL');
}).catch((err) => {
  console.error('Error conectando a MySQL:', err);
});

// Endpoint de inicio de sesión
app.post('/api/login', async (req, res) => {
  const { correo_electronico, contraseña } = req.body;

  try {
    const [rows, fields] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE correo_electronico = ? AND contraseña = ?',
      [correo_electronico, contraseña]
    );

    if (rows.length > 0) {
      const usuario = rows[0];
      if (usuario.rol_id === 1) { // Verificar si el usuario es administrador
        req.session.isAdmin = true; // Establece la sesión como administrador
        req.session.user = usuario; // Guardar información del usuario en la sesión
        res.json({ success: true });
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
app.get('/api/session', (req, res) => {
  if (req.session.isAdmin) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});

// Endpoint para cerrar sesión
app.post('/api/logout', (req, res) => {
  req.session.destroy(); // Destruye la sesión
  res.json({ success: true });
});

// Servir archivos estáticos desde la carpeta 'client/build'
app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
