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
  const { cedula, contraseña } = req.body;

  if (!cedula || !contraseña) {
    return res.status(400).json({ error: 'Usuario y contraseña son requeridos.' });
  }

  try {
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE cedula = ? AND contraseña = ?',
      [cedula, contraseña]
    );

    if (rows.length > 0) {
      const usuario = rows[0];
      if (usuario.rol_id === 1 ||  usuario.rol_id === 3 ) {
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
    res.status(500).json({ error: 'Error al autenticar usuario.' });
  }
});

// Endpoint para verificar si un usuario es administrador
app.get('/api/session', verificaToken, async (req, res) => {
  try {
    const { cedula, email, name, rol } = req.user;
    const isAdmin = [1, 3].includes(rol);
    // Consultar los permisos del usuario desde la base de datos según su rol
    const [rows] = await (await Conexion).execute(
      'SELECT rp.id_permiso FROM Roles_Permisos rp WHERE rp.id_rol = ?',
      [rol]
    );

    const permissions = rows.map(row => row.id_permiso);
    console.log(permissions);

    res.json({ isAdmin, user: { cedula, name, email, permissions } });
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

// Endpoint para obtener todos los usuarios
app.get('/api/users', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(
      'SELECT u.cedula, u.nombre, u.correo_electronico, r.nombre AS rol FROM Usuario u JOIN Rol r ON u.rol_id = r.id_rol'
    );
    res.json({ users: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error al obtener usuarios.' });
  }
});

// Endpoint para crear un nuevo usuario
app.post('/api/users', verificaToken, async (req, res) => {
  const {cedula, nombre, correo_electronico, contraseña, rol_id } = req.body;

  try {
    await (await Conexion).execute(
      'INSERT INTO Usuario (cedula, nombre, correo_electronico, contraseña, rol_id) VALUES (?, ?, ?, ?, ?)',
      [cedula, nombre, correo_electronico, contraseña, rol_id]
    );
    res.json({ success: true, message: 'Usuario creado correctamente.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error al crear usuario.' });
  }
});

// Endpoint para eliminar un usuario
app.delete('/api/users/:id', verificaToken, async (req, res) => {
  const userId = req.params.id;

  try {
    await (await Conexion).execute('DELETE FROM Usuario WHERE cedula = ?', [userId]);
    res.json({ success: true, message: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
});

// Endpoint para editar un usuario
app.put('/api/users/:id', verificaToken, async (req, res) => {
  const userId = req.params.id;
  const {nombre, correo_electronico, contraseña, rol_id } = req.body;

  try {
    await (await Conexion).execute(
      'UPDATE Usuario SET  nombre = ?, correo_electronico = ?, contraseña = ?, rol_id = ? WHERE cedula = ?',
      [nombre, correo_electronico, contraseña, rol_id, userId]
    );
    res.json({ success: true, message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
});

// Endpoint para obtener todos los roles
app.get('/api/roles', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute('SELECT id_rol, nombre FROM Rol');
    res.json({ roles: rows });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Error al obtener roles.' });
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
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
