const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { registrarAuditoria, auditoriaMiddleware } = require('../utils/auditoria');
const { verificaToken } = require('./auth');
const getClientIp = require('request-ip').getClientIp;
const moment = require('moment-timezone');

// Endpoint para obtener todos los examenes
router.get('/', verificaToken, async (req, res) => {
    try {
      const [rows] = await (await Conexion).execute(
        'SELECT * FROM analisis a JOIN examenes e ON a.id_analisis = e.id_analisis'
      );

      const examen = rows.map(row => ({
        ...row,
        fecha: moment(row.fecha).format('YYYY-MM-DD HH:mm:ss')
      }));
      res.json({ examenes: examen });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Error al obtener Examenes.' });
    }
  });
// Endpoint para crear un nuevo examen
router.post('/', verificaToken, auditoriaMiddleware((req) => `Creó Examen: ${req.body.examen}`), async (req, res) => {
  const {id_analisis, examen} = req.body;

  try {
    await (await Conexion).execute(
      'INSERT INTO examenes (id_analisis, examen)  VALUES (?, ?)',
      [id_analisis, examen]
    );

    res.json({ success: true, message: 'Examen creado correctamente.' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error al crear Examen.' });
  }

});

// Endpoint para editar examen
router.put('/:id', verificaToken, auditoriaMiddleware((req) => `Editó Examen: ${req.body.examen}`), async (req, res) => {
  const examenId = req.params.id;
  const {id_analisis, examen} = req.body;

  try {
 
    await (await Conexion).execute(
      'UPDATE examenes SET id_analisis = ?, examen = ? WHERE id_examen = ?;',
      [id_analisis, examen, examenId]
    );

    //await registrarAuditoria(usuario_nombre, ip_usuario, accion);

    res.json({ success: true, message: 'Examen actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating examenes:', error);
    res.status(500).json({ error: 'Error al actualizar examen.' });
  }
  
});
// Endpoint para eliminar examen
router.delete('/:id', verificaToken, async (req, res) => {
  const examenId = req.params.id;
  const usuario_nombre = req.user.name; // Asumiendo que el middleware verificaToken añade el nombre del usuario logueado a req.user
  const ip_usuario = getClientIp(req);
  const accion = `Eliminó examen con ID: ${examenId}`;

  try {

    
      const [[examenWithOrden]] = await (await Conexion).execute(
        'SELECT COUNT(*) AS count FROM Realizar_Examen re INNER JOIN examenes e ON re.id_examen = e.id_examen WHERE e.id_examen = ?',
        [examenId]
      );
  
      if (examenWithOrden.count > 0) {
        return res.status(400).json({ error: 'No se puede eliminar el examen porque está asignado a una o más ordenes de examenes.' });
      }
    
    await (await Conexion).execute('DELETE FROM Examenes WHERE id_examen = ?', [examenId]);

    await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    res.json({ success: true, message: 'Examen eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar Examen.' });
  }
});

router.get('/', verificaToken, async (req, res) => {
  const userId = req.params.id;

  try {
    // Consulta para obtener los exámenes según el análisis seleccionado
    const query = 'SELECT * FROM examenes WHERE id_analisis = ?';
    const result = await pool.query(query, [userId]);
    console.log(userId);

    // Si se encuentran exámenes, devolverlos en la respuesta
    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No se encontraron exámenes para este análisis.' });
    }
  } catch (error) {
    console.error('Error al obtener los exámenes:', error);
    res.status(500).json({ message: 'Error al obtener los exámenes.' });
  }
});

router.get('/:id_analisis/examenes', verificaToken, async (req, res) => {
  const id_analisis = req.params.id_analisis;

  try {
    const [rows] = await (await Conexion).execute(
      'SELECT e.id_examen, a.analisis, e.examen, e.fecha FROM analisis a JOIN examenes e ON a.id_analisis = e.id_analisis WHERE e.id_analisis = ?',
      [id_analisis]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).json({ message: 'No se encontraron exámenes para este análisis.' });
    }
  } catch (error) {
    console.error('Error al obtener exámenes:', error);
    res.status(500).json({ error: 'Error al obtener exámenes.' });
  }
});

module.exports = router;
