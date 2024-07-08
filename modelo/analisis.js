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
      const [rows] = await (await Conexion).execute(
        'SELECT * FROM Analisis'
      );

      const analisis = rows.map(row => ({
        ...row,
        fecha: moment(row.fecha).format('YYYY-MM-DD HH:mm:ss')
      }));
      res.json({ analisis: analisis });
    } catch (error) {
      console.error('Error fetching analisis:', error);
      res.status(500).json({ error: 'Error al obtener analisis.' });
    }
});

// Endpoint para crear un nuevo analisis
router.post('/', verificaToken, auditoriaMiddleware((req) => `Creó Análisis: ${req.body.analisis}`), async (req, res) => {
    const {analisis} = req.body;
  
    try {
  
      await (await Conexion).execute(
        'INSERT INTO Analisis (analisis) VALUES (?)',
        [analisis]
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
    const {analisis} = req.body;

    try {
      await (await Conexion).execute(
        'UPDATE Analisis SET analisis = ?  WHERE id_analisis = ?',
        [analisis, analisisId]
      );
      res.json({ success: true, message: 'Análisis actualizado correctamente.' });
    } catch (error) {
      console.error('Error updating analisis:', error);
      res.status(500).json({ error: 'Error al actualizar Análisis.' });
    }
    
  });

// Endpoint para eliminar analisis
router.delete('/:id_analisis', verificaToken, async (req, res) => {
  const analisisId = req.params.id_analisis;
  const usuario_nombre = req.user.name; // Asumiendo que el middleware verificaToken añade el nombre del usuario logueado a req.user
  const ip_usuario = getClientIp(req);
  const accion = `Eliminó Análisis con ID: ${analisisId}`;

  try {
    
    await (await Conexion).execute('DELETE FROM Analisis WHERE id_analisis = ?', [analisisId]);

  await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    res.json({ success: true, message: 'Analisis eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar Análisis.' });
  }
});
  

module.exports = router;