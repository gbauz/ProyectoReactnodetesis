const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { verificaToken } = require('./auth');
const { registrarAuditoria, auditoriaMiddleware } = require('../utils/auditoria');
const getClientIp = require('request-ip').getClientIp;


//Endpoint para Obtener todos los médicos
router.get('/', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute('SELECT  * from medico m JOIN especialidad e on m.id_especialidad = e.id_especialidad;');
    res.json({ medicos: rows });
  } catch (error) {
    console.error('Error fetching medicos:', error);
    res.status(500).json({ error: 'Error al obtener médicos.' });
  }
});

//Endpoint para Crear un nuevo médico
router.post('/', verificaToken, auditoriaMiddleware((req) => `Creó Médico con cédula: ${req.body.cedula}`), async (req, res) => {
  const { cedula, nombre_apellido, id_especialidad, celular, direccion } = req.body;

  try {
    const [existingUserRows] = await (await Conexion).execute(
      'SELECT * FROM Medico WHERE cedula = ?',
      [cedula]
    );

    if (existingUserRows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un medico con esa cédula.' });
    }

    await (await Conexion).execute(
      'INSERT INTO Medico (cedula, nombre_apellido, celular, direccion, id_especialidad) VALUES (?, ?, ?, ?, ?)',
      [cedula, nombre_apellido, celular, direccion, id_especialidad]
    );

    res.json({ success: true, message: 'Médico creado correctamente.' });
  } catch (error) {
    console.error('Error creating medico:', error);
    res.status(500).json({ error: 'Error al crear médico.' });
  }
});

//Endpoint para Actualizar médico
router.put('/:cedula', verificaToken, auditoriaMiddleware((req) => `Editó Médico con cédula: ${req.body.cedula}`), async (req, res) => {
  const medicoCedula = req.params.cedula;
  const { nombre_apellido, id_especialidad, celular, direccion } = req.body;
  try {
    const [existingMedicoRows] = await (await Conexion).execute(
      'SELECT * FROM Medico WHERE cedula = ?',
      [medicoCedula]
    );

    if (existingMedicoRows.length === 0) {
      return res.status(404).json({ error: 'Médico no encontrado.' });
    }

    await (await Conexion).execute(
      'UPDATE Medico SET nombre_apellido = ?, celular = ?, direccion = ? , id_especialidad = ? WHERE cedula = ?',
      [nombre_apellido, celular, direccion, id_especialidad, medicoCedula]
    );

    res.json({ success: true, message: 'Médico actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating medico:', error);
    res.status(500).json({ error: 'Error al actualizar médico.' });
  }
});

//Endpoint para Eliminar médico
router.delete('/:cedula', verificaToken, async (req, res) => {
  const medicoCedula = req.params.cedula;
  const usuario_nombre = req.user.name;
  const ip_usuario = getClientIp(req);
  const accion = `Eliminó Médico con cédula: ${medicoCedula}`;

  try {
    const [existingMedicoRows] = await (await Conexion).execute(
      'SELECT * FROM Medico WHERE cedula = ?',
      [medicoCedula]
    );

    if (existingMedicoRows.length === 0) {
      return res.status(404).json({ error: 'Médico no encontrado.' });
    }

    await (await Conexion).execute('DELETE FROM Medico WHERE cedula = ?', [medicoCedula]);

    await registrarAuditoria(usuario_nombre, ip_usuario, accion);

    res.json({ success: true, message: 'Médico eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting medico:', error);
    res.status(500).json({ error: 'Error al eliminar médico.' });
  }
});

// Endpoint buscar medico
router.get('/:id', verificaToken, async (req, res) => {
  const medicoId = req.params.id; 
  try {
    const [rows] = await (await Conexion).execute('SELECT cedula, nombre_apellido FROM Medico WHERE cedula = ?', [medicoId]);

    if (rows.length === 1) {
      res.json({ success: true, cedula: rows[0].cedula, nombre_apellido: rows[0].nombre_apellido, message: 'Médico encontrado correctamente.' });
    } else {
      res.status(404).json({ error: 'Médico no encontrado.' });
    }
  } catch (error) {
    console.error('Error al buscar médico:', error);
    res.status(500).json({ error: 'Error al buscar médico.' });
  }
});

module.exports = router;
