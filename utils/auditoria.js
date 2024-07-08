const Conexion = require('../controlador/conexion');
const getClientIp = require('request-ip').getClientIp;

const registrarAuditoria = async (usuarioNombre, ipUsuario, accion) => {
  try {
    await (await Conexion).execute(`
      INSERT INTO auditoria (usuario_nombre, ip_usuario, accion)
      VALUES (?, ?, ?)
    `, [usuarioNombre, ipUsuario, accion]);
  } catch (error) {
    console.error('Error registrando auditoría:', error);
  }
};

const auditoriaMiddleware = (accionFn) => {
  return async (req, res, next) => {
    const usuario_nombre = req.user.name; // Assuming req.user is set by verificaToken
    const ip_usuario = getClientIp(req);
    const accion = accionFn(req);
    try {
      await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    } catch (error) {
      console.error('Error registrando auditoría:', error);
    }
    next();
  };
};

module.exports = {
  registrarAuditoria,
  auditoriaMiddleware
};
