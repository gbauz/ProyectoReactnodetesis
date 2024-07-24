const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { verificaToken } = require('./auth');
const getClientIp = require('request-ip').getClientIp;


// Endpoint para ver  especialidades
router.get('/', verificaToken, async (req, res) => {
    try {
      const [rows] = await (await Conexion).execute(
        'SELECT * FROM Especialidad'
      );

      res.json({ especialidades: rows });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error al obtener especialidades.' });
    }
});

// Endpoint para crear especialidades
router.post('/', verificaToken, async (req, res) => {
    const {nombre} = req.body;
  
    try {
  
      await (await Conexion).execute(
        'INSERT INTO especialidad (nombre) VALUES (?)',
        [nombre]
      );
  
      res.json({ success: true, message: 'Especialidad creado correctamente.' });
    } catch (error) {
      console.error('Error creating especialidad:', error);
      res.status(500).json({ error: 'Error al crear especialidad.' });
    }  
});

// Endpoint para editar un usuario
  router.put('/:id', verificaToken, async (req, res) => {
    const especialidadId = req.params.id;
    const {nombre} = req.body;
  
    try {
   
      await (await Conexion).execute(
        'UPDATE Especialidad SET nombre = ?  WHERE id_especialidad = ?',
        [nombre, especialidadId]
      );
  
      res.json({ success: true, message: 'Especialidad actualizada correctamente.' });
    } catch (error) {
      console.error('Error updating especialidad:', error);
      res.status(500).json({ error: 'Error al actualizar especialidad.' });
    }
});

// Endpoint para eliminar una especialidad
router.delete('/:id', verificaToken, async (req, res) => {
  const especialidadId = req.params.id;
  const usuario_nombre = req.user.name; // Asumiendo que el middleware verificaToken añade el nombre del usuario logueado a req.user
  const ip_usuario = getClientIp(req);
  const accion = `Eliminó usuario: ${especialidadId}`;

  try {

    const [[especialidadAnalisis]] = await (await Conexion).execute(
      'SELECT COUNT(*) AS count FROM  Especialidad e  INNER JOIN Analisis a on a.id_especialidad=e.id_especialidad WHERE e.id_especialidad = ?',
      [especialidadId]
    );

    if (especialidadAnalisis.count > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la Especialidad porque está asignado a un Analisis.' });
    }

    const [[especialidadWithMedico]] = await (await Conexion).execute(
      'SELECT COUNT(*) AS count FROM Medico m INNER JOIN Especialidad e ON m.id_especialidad = e.id_especialidad INNER JOIN Analisis a on a.id_especialidad=e.id_especialidad WHERE e.id_especialidad = ?',
      [especialidadId]
    );

    if (especialidadWithMedico.count > 0) {
      return res.status(400).json({ error: 'No se puede eliminar la Especialidad porque está asignado a uno o más Medicos o a un Analisis.' });
    }
    
    await (await Conexion).execute('DELETE FROM Especialidad WHERE id_especialidad = ?', [especialidadId]);

    //await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    res.json({ success: true, message: 'Especialidad eliminada correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar Especialidad.' });
  }
});

  module.exports = router;