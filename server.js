const express = require('express');
const path = require('path');
const { verificaToken, generateToken, revokeToken } = require('./controlador/tokens');
const Conexion = require('./controlador/conexion');


const app = express();
const port = process.env.PORT || 3000;
const bcrypt = require('bcrypt');
const saltRounds = 10; // Número de rondas de hashing para bcrypt

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
    // Buscar al usuario por su cédula en la base de datos
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE cedula = ?',
      [cedula]
    );

    // Si no se encuentra ningún usuario con la cédula proporcionada
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Obtener el hash de la contraseña almacenada en la base de datos
    const usuario = rows[0];
    const hashContraseña = usuario.contraseña;

    // Comparar la contraseña ingresada con el hash almacenado en la base de datos
    const passwordMatch = await bcrypt.compare(contraseña, hashContraseña);

    // Si las contraseñas coinciden, el inicio de sesión es exitoso
    if (passwordMatch) {
      // Verificar los permisos del usuario (rol_id)
      if (usuario.rol_id === 1 || usuario.rol_id === 2) {
        // Generar token de sesión
        const token = generateToken(usuario);
        return res.json({ success: true, token });
      } else {
        return res.status(403).json({ error: 'No tienes permiso para acceder.' });
      }
    } else {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }
  } catch (error) {
    console.error('Error al autenticar:', error);
    return res.status(500).json({ error: 'Error al autenticar usuario.' });
  }
});

// Endpoint para verificar si un usuario es administrador
app.get('/api/session', verificaToken, async (req, res) => {
  try {
    const { cedula, email, name, rol } = req.user;
    const isAdmin = [1, 2].includes(rol);
    // Consultar los permisos del usuario desde la base de datos según su rol
    const [rows] = await (await Conexion).execute(
      'SELECT rp.id_permiso FROM Roles_Permisos rp WHERE rp.id_rol = ?',
      [rol]
    );

    const permissions = rows.map(row => row.id_permiso);
    //console.log(permissions);

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
  const { cedula, nombre, correo_electronico, contraseña, rol_id } = req.body;

  try {
    // Verificar si ya existe un usuario con la misma cédula
    const [existingUserRows] = await (await Conexion).execute(
      'SELECT * FROM Usuario WHERE cedula = ?',
      [cedula]
    );

    // Si ya existe un usuario con la misma cédula, devolver un error
    if (existingUserRows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario con el mismo número de cédula.' });
    }

    // Encriptar la contraseña antes de almacenarla en la base de datos
    const hashedPassword = await bcrypt.hash(contraseña, 10); // Generar hash de la contraseña con 10 rounds de salting

    // Insertar el nuevo usuario en la base de datos con la contraseña encriptada
    await (await Conexion).execute(
      'INSERT INTO Usuario (cedula, nombre, correo_electronico, contraseña, rol_id) VALUES (?, ?, ?, ?, ?)',
      [cedula, nombre, correo_electronico, hashedPassword, rol_id]
    );

    // Respuesta exitosa
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
    // Verificar el rol del usuario antes de eliminar
    const [userRows] = await (await Conexion).execute(
      'SELECT rol_id FROM Usuario WHERE cedula = ?',
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    const userRol = userRows[0].rol_id;

    if (userRol === 1) {
      return res.status(403).json({ error: 'No se puede eliminar a un usuario con rol Administrador.' });
    }

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
  const {nombre, correo_electronico, rol_id } = req.body;

  try {
    await (await Conexion).execute(
      'UPDATE Usuario SET  nombre = ?, correo_electronico = ?, rol_id = ? WHERE cedula = ?',
      [nombre, correo_electronico, rol_id, userId]
    );
    res.json({ success: true, message: 'Usuario actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error al actualizar usuario.' });
  }
});
// Endpoint para editar contraseña a un usuario
app.put('/api/users/:id/password', verificaToken, async (req, res) => {
  const userId = req.params.id;
  const { nuevaContraseña, confirmarContraseña } = req.body;

  // Verificar que las contraseñas coincidan
  if (nuevaContraseña !== confirmarContraseña) {
    return res.status(400).json({ error: 'Las contraseñas no coinciden.' });
  }

  try {
    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContraseña, saltRounds);

    // Actualizar la contraseña en la base de datos
    await (await Conexion).execute(
      'UPDATE Usuario SET contraseña = ? WHERE cedula = ?',
      [hashedPassword, userId]
    );

    res.json({ success: true, message: 'Contraseña actualizada correctamente.' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ error: 'Error al actualizar la contraseña.' });
  }
});

// Endpoint para obtener todos los roles
app.get('/api/roles', verificaToken, async (req, res) => {
  try {
    const [roles] = await (await Conexion).execute('SELECT id_rol, nombre FROM Rol');
    // Obtener permisos para cada rol
    const rolesWithPermissions = await Promise.all(roles.map(async (role) => {
      const [permisos] = await (await Conexion).execute(
        'SELECT p.id_permiso, p.nombre_permiso AS permiso_nombre FROM Permisos p JOIN Roles_Permisos rp ON p.id_permiso = rp.id_permiso WHERE rp.id_rol = ?',
        [role.id_rol]
      );
      return { ...role, permisos };
    }));

    res.json({ roles: rolesWithPermissions });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({ error: 'Error al obtener roles.' });
  }
});
// Endpoint para crear un nuevo rol con permisos
app.post('/api/roles', verificaToken, async (req, res) => {
  const { nombre, permisos } = req.body;

  try {
    const [result] = await (await Conexion).execute(
      'INSERT INTO Rol (nombre) VALUES (?)',
      [nombre]
    );
    const rolId = result.insertId;

    if (permisos && permisos.length > 0) {
      const permisosValues = permisos.map(permisoId => [rolId, permisoId]);
      await (await Conexion).query(
        'INSERT INTO Roles_Permisos (id_rol, id_permiso) VALUES ?',
        [permisosValues]
      );
    }

    res.json({ success: true, message: 'Rol creado correctamente.' });
  } catch (error) {
    console.error('Error creating role:', error);
    res.status(500).json({ error: 'Error al crear rol.' });
  }
});

// Endpoint para editar un rol con permisos
app.put('/api/roles/:id', verificaToken, async (req, res) => {
  const roleId = req.params.id;
  const { nombre, permisos } = req.body;

  try {
    await (await Conexion).execute(
      'UPDATE Rol SET nombre = ? WHERE id_rol = ?',
      [nombre, roleId]
    );

    // Primero, eliminamos los permisos actuales
    await (await Conexion).execute('DELETE FROM Roles_Permisos WHERE id_rol = ?', [roleId]);

    // Luego, agregamos los nuevos permisos
    if (permisos && permisos.length > 0) {
      const permisosValues = permisos.map(permisoId => [roleId, permisoId]);
      await (await Conexion).query(
        'INSERT INTO Roles_Permisos (id_rol, id_permiso) VALUES ?',
        [permisosValues]
      );
    }

    res.json({ success: true, message: 'Rol actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ error: 'Error al actualizar rol.' });
  }
});
// Endpoint para eliminar un rol con sus permisos
app.delete('/api/roles/:id', verificaToken, async (req, res) => {
  const roleId = req.params.id;

  try {
    const [[usersWithRole]] = await (await Conexion).execute(
      'SELECT COUNT(*) AS count FROM Usuario INNER JOIN Rol ON Usuario.rol_id = Rol.id_rol WHERE Rol.id_rol = ?',
      [roleId]
    );

   // console.log(usersWithRole);
    //console.log(typeof usersWithRole.count);

    if (usersWithRole.count > 0) {
      // Si hay usuarios asignados, devolver un mensaje de error
      return res.status(400).json({ error: 'No se puede eliminar el rol porque está asignado a uno o más usuarios.' });

    }

    // Primero, eliminamos las relaciones de permisos del rol
    await (await Conexion).execute('DELETE FROM Roles_Permisos WHERE id_rol = ?', [roleId]);

    // Luego, eliminamos el rol
    await (await Conexion).execute('DELETE FROM Rol WHERE id_rol = ?', [roleId]);
    
    res.json({ success: true, message: 'Rol eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Error al eliminar rol.' });
  }
});

//Endpoint de permisos
app.get('/api/permisos', verificaToken, async (req, res) => {
  try {
    const [permisos] = await (await Conexion).execute('SELECT id_permiso, nombre_permiso FROM Permisos');
    res.json({ permisos });
  } catch (error) {
    console.error('Error fetching permisos:', error);
    res.status(500).json({ error: 'Error al obtener permisos.' });
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
