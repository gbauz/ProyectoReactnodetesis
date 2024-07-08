const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { registrarAuditoria, auditoriaMiddleware } = require('../utils/auditoria');
const { verificaToken } = require('./auth');
const getClientIp = require('request-ip').getClientIp;
const moment = require('moment-timezone');


// Endpoint para Obtener todos los pacientes
router.get('/', verificaToken, async (req, res) => {
    try {
      const [rows] = await (await Conexion).execute(
        'SELECT * FROM Pacientes'
      );
      const paciente = rows.map(row => ({
        ...row,
        fecha: moment(row.fecha).format('YYYY-MM-DD HH:mm:ss')
      }));
      res.json({ pacientes: paciente });
    } catch (error) {
      console.error('Error fetching pacientes:', error);
      res.status(500).json({ error: 'Error al obtener pacientes.' });
    }
});

// Endpoint para crear un nuevo Paciente
router.post('/', verificaToken, auditoriaMiddleware((req) => `Creó Paciente con cédula: ${req.body.cedula}`), async (req, res) => {
    const { cedula, paciente, edad, sexo, celular} = req.body;
    try {
      const [existingUserRows] = await (await Conexion).execute(
        'SELECT * FROM Pacientes WHERE cedula = ?',
        [cedula]
      );
      if (existingUserRows.length > 0) {
        return res.status(400).json({ error: 'Ya existe un paciente con el mismo número de cédula.' });
      }
      await (await Conexion).execute(
        'INSERT INTO Pacientes (cedula, paciente, edad, sexo, celular) VALUES (?, ?, ?, ?, ?)',
        [cedula, paciente, edad, sexo, celular]
      );
      res.json({ success: true, message: 'Paciente creado correctamente.' });
    } catch (error) {
      console.error('Error creating paciente:', error);
      res.status(500).json({ error: 'Error al crear paciente.' });
    }
});

// Endpoint para editar Paciente
router.put('/:id', verificaToken, auditoriaMiddleware((req) => `Editó Paciente con cédula: ${req.body.cedula}`), async (req, res) => {
    const pacienteId = req.params.id;
    const {paciente, edad, sexo, celular} = req.body;

    try {
      await (await Conexion).execute(
        'UPDATE Pacientes SET paciente = ?, edad = ?, sexo = ?, celular = ?  WHERE cedula = ?',
        [paciente, edad, sexo, celular, pacienteId]
      );
      console.log(pacienteId);
  
      res.json({ success: true, message: 'Paciente actualizado correctamente.' });
    } catch (error) {
      console.error('Error updating paciente:', error);
      res.status(500).json({ error: 'Error al actualizar paciente.' });
    }
    
});

// Endpoint para eliminar un paciente
  router.delete('/:id', verificaToken, async (req, res) => {
    const pacienteId = req.params.id;
    const usuario_nombre = req.user.name;
    const ip_usuario = getClientIp(req);
    const accion = `Eliminó Paciente con cédula: ${pacienteId}`;
  
    try {
      await (await Conexion).execute('DELETE FROM Pacientes WHERE cedula = ?', [pacienteId]);

      console.log(pacienteId);
  
      await registrarAuditoria(usuario_nombre, ip_usuario, accion);
      res.json({ success: true, message: 'Paciente eliminado correctamente.' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Error al eliminar paciente.' });
    }
});

// Endpoint buscar paciente
router.get('/:id_paciente', verificaToken, async (req, res) => {
  const pacienteId = req.params.id_paciente;

  try {
    
    const [rows] = await (await Conexion).execute('SELECT * FROM Pacientes WHERE cedula = ?', [pacienteId]);

    if (rows.length === 1) {
      res.json({ success: true, pacienteId, message: 'Paciente encontrado correctamente.' });
    } else {
      res.status(404).json({ error: 'Paciente no encontrado.' });
    }
  } catch (error) {
    console.error('Error al buscar paciente:', error);
    res.status(500).json({ error: 'Error al buscar paciente.' });
  }
});

module.exports = router;