const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { registrarAuditoria, auditoriaMiddleware } = require('../utils/auditoria');
const { verificaToken } = require('./auth');
const getClientIp = require('request-ip').getClientIp;
const moment = require('moment-timezone');

// Endpoint para obtener todos los analisis
router.get('/', verificaToken, async (req, res) => {
  try {
      const especialidad = req.query.especialidad;
      let query = 'SELECT * FROM analisis a INNER JOIN especialidad e on a.id_especialidad=e.id_especialidad';
      let params = [];

      if (especialidad) {
          query += ' WHERE e.nombre = ?';
          params.push(especialidad);
      }

      const [rows] = await (await Conexion).execute(query, params);

      const analisis = rows.map(row => ({
          ...row,
          fecha: moment(row.fecha).format('YYYY-MM-DD HH:mm:ss')
      }));

      res.json({ analisis });
  } catch (error) {
      console.error('Error fetching analysis:', error);
      res.status(500).json({ error: 'Error al obtener los análisis.' });
  }
});

// Endpoint para crear un nuevo analisis
router.post('/', verificaToken, auditoriaMiddleware((req) => `Creó Análisis: ${req.body.analisis}`), async (req, res) => {
  const {analisis, id_especialidad} = req.body;
  
    try {
  
      await (await Conexion).execute(
        'INSERT INTO analisis (analisis, id_especialidad) VALUES (?, ?)',
        [analisis, id_especialidad]
      );
  
      res.json({ success: true, message: 'Análisis creado correctamente.' });
    } catch (error) {
      console.error('Error creating analisis:', error);
      res.status(500).json({ error: 'Error al crear Análisis.' });
    }  
});

// Endpoint para editar analisis
router.put('/:id', verificaToken, auditoriaMiddleware((req) => `Editó Análisis: ${req.body.analisis}`), async (req, res) => {
    const analisisId = req.params.id;
    const {analisis, id_especialidad} = req.body;

    try {
      await (await Conexion).execute(
        'UPDATE analisis SET analisis = ?, id_especialidad = ?  WHERE id_analisis = ?',
        [analisis, id_especialidad, analisisId]
      );
      res.json({ success: true, message: 'Análisis actualizado correctamente.' });
    } catch (error) {
      console.error('Error updating analisis:', error);
      res.status(500).json({ error: 'Error al actualizar Análisis.' });
    }
    
  });

// Endpoint para eliminar analisis
router.delete('/:id', verificaToken, async (req, res) => {
  const analisisId = req.params.id;
  const usuario_nombre = req.user.name; // Asumiendo que el middleware verificaToken añade el nombre del usuario logueado a req.user
  const ip_usuario = getClientIp(req);
  const accion = `Eliminó Análisis con ID: ${analisisId}`;

  try {

    const [[analisisWithExamen]] = await (await Conexion).execute(
      'SELECT COUNT(*) AS count FROM examenes e INNER JOIN analisis a ON e.id_analisis = a.id_analisis WHERE a.id_analisis = ?',
      [analisisId]
    );

    if (analisisWithExamen.count > 0) {
      return res.status(400).json({ error: 'No se puede eliminar el Analisis porque está asignado a uno o más examenes.' });
    }
    
    await (await Conexion).execute('DELETE FROM analisis WHERE id_analisis = ?', [analisisId]);

  await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    res.json({ success: true, message: 'Analisis eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar Análisis.' });
  }
});
  

module.exports = router;