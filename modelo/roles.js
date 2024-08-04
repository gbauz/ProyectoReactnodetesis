const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { registrarAuditoria, auditoriaMiddleware } = require('../utils/auditoria');
const { verificaToken } = require('./auth');
const getClientIp = require('request-ip').getClientIp;

// Endpoint para obtener todos los roles
router.get('/', verificaToken, async (req, res) => {
  try {
    const [roles] = await (await Conexion).execute('SELECT id_rol, nombre FROM rol');
    const rolesWithPermissions = await Promise.all(roles.map(async (role) => {
      const [permisos] = await (await Conexion).execute(
        'SELECT p.id_permiso, p.nombre_permiso AS permiso_nombre FROM permisos p JOIN roles_permisos rp ON p.id_permiso = rp.id_permiso WHERE rp.id_rol = ?',
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
router.post('/', verificaToken, auditoriaMiddleware((req) => `Creó Rol: ${req.body.nombre}`), async (req, res) => {
  const { nombre, permisos } = req.body;

  try {
    const [result] = await (await Conexion).execute(
      'INSERT INTO rol (nombre) VALUES (?)',
      [nombre]
    );
    const rolId = result.insertId;

    if (permisos && permisos.length > 0) {
      const permisosValues = permisos.map(permisoId => [rolId, permisoId.id_permiso]);
      await (await Conexion).query(
        'INSERT INTO roles_permisos (id_rol, id_permiso) VALUES ?',
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
router.put('/:id', verificaToken, auditoriaMiddleware((req) => `Editó Rol: ${req.body.nombre}`), async (req, res) => {
  const roleId = req.params.id;
  const { nombre, permisos } = req.body;

  try {
    await (await Conexion).execute(
      'UPDATE rol SET nombre = ? WHERE id_rol = ?',
      [nombre, roleId]
    );

    await (await Conexion).execute('DELETE FROM roles_permisos WHERE id_rol = ?', [roleId]);

    if (permisos && permisos.length > 0) {
      const permisosValues = permisos.map(permisoId => [roleId, permisoId.id_permiso]);
      await (await Conexion).query(
        'INSERT INTO roles_permisos (id_rol, id_permiso) VALUES ?',
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
router.delete('/:id', verificaToken, async (req, res) => {
  const roleId = req.params.id;
  const { nombre, permisos} = req.body;
  const usuario_nombre = req.user.name; // Asumiendo que el middleware verificaToken añade el nombre del usuario logueado a req.user
  const ip_usuario = getClientIp(req);
  const accion = `Eliminó Rol con ID: ${roleId}`;

  try {
    const [[usersWithRole]] = await (await Conexion).execute(
      'SELECT COUNT(*) AS count FROM usuario INNER JOIN rol ON usuario.rol_id = rol.id_rol WHERE rol.id_rol = ?',
      [roleId]
    );

    if (usersWithRole.count > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el rol porque está asignado a uno o más usuarios.' });
    }

    await (await Conexion).execute('DELETE FROM roles_permisos WHERE id_rol = ?', [roleId]);
    await (await Conexion).execute('DELETE FROM rol WHERE id_rol = ?', [roleId]);

    await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    
    res.json({ success: true, message: 'Rol eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar rol:', error);
    res.status(500).json({ error: 'Error al eliminar rol.' });
  }
});

module.exports = router;
