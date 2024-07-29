const express = require('express');
const router = express.Router();
const Conexion = require('../controlador/conexion');
const { verificaToken } = require('./auth');
const moment = require('moment-timezone');

// Endpoint para obtener exámenes según el análisis seleccionado
router.get('/', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(
      `SELECT 
        re.id_realizar, re.id_paciente, re.id_medico, re.id_examen, re.id_analisis, re.fecha, 
        p.cedula AS paciente_cedula, p.paciente, p.edad, p.sexo, p.celular AS paciente_celular,
		    m.cedula AS medico_cedula, m.nombre_apellido, m.celular AS medico_celular,
		    m.direccion, esp.id_especialidad, esp.nombre, a.analisis, e.examen
        FROM 
          realizar_examen re 
        INNER JOIN 
          pacientes p ON re.id_paciente = p.id_paciente 
        INNER JOIN 
          medico m ON re.id_medico = m.id_medico 
        INNER JOIN 
          especialidad esp ON m.id_especialidad = esp.id_especialidad
        INNER JOIN 
          analisis a ON re.id_analisis = a.id_analisis 
        INNER JOIN 
          examenes e ON re.id_examen = e.id_examen
        ORDER BY 
          re.fecha DESC`
    );
    const result = [];
    rows.forEach(row => {
      let existingEntry = result.find(
        r => r.id_paciente === row.id_paciente && r.id_medico === row.id_medico
      );
      if (!existingEntry) {
        existingEntry = {
          id: row.id_realizar,
          fecha: row.fecha,
          id_paciente: row.id_paciente,
          paciente_cedula: row.paciente_cedula,
          paciente: row.paciente,
          edad: row.edad,
          sexo: row.sexo,
          celular: row.paciente_celular,
          id_medico: row.id_medico,
          medico_cedula: row.medico_cedula,
          nombre_apellido: row.nombre_apellido,
          medico_celular: row.medico_celular,
          direccion: row.direccion,
          id_especialidad: row.id_especialidad,
          especialidad: row.nombre,
          analisis: []
        };
        result.push(existingEntry);
      }
      let analisis = existingEntry.analisis.find(a => a.id_analisis === row.id_analisis);
      if (!analisis) {
        analisis = {
          id_analisis: row.id_analisis,
          analisis: row.analisis,
          examen: []
        };
        existingEntry.analisis.push(analisis);
      }
      if (!analisis.examen.find(e => e.id_examen === row.id_examen)) {
        analisis.examen.push({
          id_realizar: row.id_realizar,
          id_examen: row.id_examen,
          examen: row.examen
        });
      }
    });
    res.json({ mantexamen: result });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error las ordenes de examen' });
  }
});

// Endpoint para agregar un nuevo examen realizado
router.post('/', verificaToken, async (req, res) => {
  const { id_paciente, id_medico, id_examen, id_analisis } = req.body;
  // Verifica que los parámetros requeridos no sean undefined
  if (!id_paciente || !id_medico || !id_examen  || !id_analisis) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }
  try {
    await (await Conexion).execute(
      'INSERT INTO realizar_examen (id_paciente, id_medico, id_analisis, id_examen) VALUES (?, ?, ?, ?)',
      [id_paciente, id_medico, id_analisis, id_examen]
    );
    res.json({ success: true, message: 'Examen realizado creado correctamente.' });
  } catch (error) {
    console.error('Error al insertar examen realizado:', error);
    res.status(500).json({ error: 'Error al insertar examen realizado.' });
  }
});

router.delete('/:id', verificaToken, async (req, res) => {
  const examenId = req.params.id;
  try {
    // Verifica que el examenId no es undefined
    if (!examenId) {
      return res.status(400).json({ error: 'ID del examen no proporcionado.' });
    }
    await (await Conexion).execute('DELETE FROM realizar_examen WHERE id_realizar = ?', [examenId]);
    res.json({ success: true, message: 'Examen eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting examen:', error);
    res.status(500).json({ error: 'Error al eliminar examen.' });
  }
});
// Endpoint para editar un examen realizado
router.put('/:id', verificaToken, async (req, res) => {
  const examenId = req.params.id;
  const { id_paciente, id_medico, id_examen, id_analisis} = req.body;

  // Verifica que los parámetros requeridos no sean undefined
  if (!id_paciente || !id_medico || !id_examen || !id_analisis) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  try {
    // Actualizar el examen realizado en la base de datos
    const [result] = await (await Conexion).execute(
      'UPDATE realizar_examen SET id_paciente = ?, id_medico = ?, id_examen = ?, id_analisis = ? WHERE id_realizar = ?',
      [id_paciente, id_medico, id_examen, id_analisis, examenId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Examen no encontrado.' });
    }

    res.json({ success: true, message: 'Examen actualizado correctamente.' });
  } catch (error) {
    console.error('Error updating examen:', error);
    res.status(500).json({ error: 'Error al actualizar examen.' });
  }
});
// Nuevo endpoint para obtener médico y análisis/exámenes según el paciente seleccionado
router.get('/:id', verificaToken, async (req, res) => {

  const id_paciente = req.params.id;

  try {
    const [medicoResult] = await (await Conexion).execute(
      'SELECT m.nombre_apellido FROM realizar_examen re INNER JOIN Medico m ON re.id_medico = m.id_medico WHERE re.id_paciente = ?',
      [id_paciente]
    );

    console.log(id_paciente);

    if (medicoResult.length === 0) {
      return res.status(404).json({ error: 'Médico no encontrado para el paciente proporcionado.' });
    }

    const medico = medicoResult[0];

    const [analisisYExamenesResult] = await (await Conexion).execute(
      'SELECT a.analisis, e.examen FROM realizar_examen re INNER JOIN analisis a ON re.id_analisis = a.id_analisis INNER JOIN examenes e ON re.id_examen = e.id_examen WHERE re.id_paciente = ?',
      [id_paciente]
    );

    res.json({ medico, analisisYExamenes: analisisYExamenesResult });
  } catch (error) {
    console.error('Error fetching médico and análisis/exámenes:', error);
    res.status(500).json({ error: 'Error al obtener médico y análisis/exámenes.' });
  }
});

// Endpoint para obtener el ultimo id registrado
router.get('/last/exam', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(
      'SELECT id_realizar FROM realizar_examen ORDER BY id_realizar DESC LIMIT 1;'
    );
    res.json({ mantexamen: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error las ordenes de examen' });
  }
});

// Endpoint para obtener examen
router.get('/obtener/examen', verificaToken, async (req, res) => {
  try {
    const { id_paciente, id_examen, id_analisis } = req.query;
    if (!id_paciente || !id_examen || !id_analisis) {
      return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM `realizar_examen` WHERE `id_paciente`=? AND `id_examen`=? AND `id_analisis`=?;',
      [id_paciente, id_examen, id_analisis]
    );
    res.json({ mantexamen: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error las ordenes de examen' });
  }
});

module.exports = router;
