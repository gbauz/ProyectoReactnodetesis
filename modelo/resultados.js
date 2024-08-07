const express = require('express');
const router = express.Router();
const multer = require('multer');
const Conexion = require('../controlador/conexion');
const { verificaToken } = require('./auth');

// Obtener todos los resultados
router.get('/', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(`
      SELECT 
        re.id_realizar, re.id_paciente, re.id_medico, re.id_examen, re.id_analisis, 
        p.cedula AS paciente_cedula, p.paciente, 
        m.cedula AS medico_cedula, m.nombre_apellido, 
        a.analisis, e.examen,
        res.id_resultado, res.resultado 
      FROM realizar_examen re 
      LEFT JOIN resultado res ON re.id_realizar = res.id_realizar
      INNER JOIN pacientes p ON re.id_paciente = p.id_paciente 
      INNER JOIN medico m ON re.id_medico = m.id_medico 
      INNER JOIN analisis a ON re.id_analisis = a.id_analisis 
      INNER JOIN examenes e ON re.id_examen = e.id_examen 
      ORDER BY re.fecha DESC;
    `);
    const patientMap = new Map();
    rows.forEach(row => {
      if (!patientMap.has(row.id_paciente)) {
        patientMap.set(row.id_paciente, {
          id: row.id_realizar,
          id_paciente: row.id_paciente,
          paciente_cedula: row.paciente_cedula,
          paciente: row.paciente,
          id_medico: row.id_medico,
          medico_cedula: row.medico_cedula,
          nombre_apellido: row.nombre_apellido,
          examen: []
        });
      }
      const existingEntry = patientMap.get(row.id_paciente);
      existingEntry.examen.push({
        id_resultado: row.id_resultado,
        resultado: row.resultado,
        id_realizar: row.id_realizar,
        id_analisis: row.id_analisis,
        analisis: row.analisis,
        id_examen: row.id_examen,
        examen: row.examen
      });
    });
    const filteredResults = [];
    for (let [key, pacient] of patientMap) {
      let hasNonNullResult = false;
      for (let exam of pacient.examen) {
        if (exam.id_resultado !== null) hasNonNullResult = true;
        if (hasNonNullResult) {
          filteredResults.push(pacient);
          break;
        }
      }
    }
    res.json({ resultadosData: filteredResults });
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).json({ error: 'Error al obtener los resultados' });
  }
});

// Configuración de multer para manejo de archivos
// Configuración de multer para manejo de archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Subir un nuevo archivo
router.post('/', verificaToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }
  const { id_realizar } = req.body;
  const fileBuffer = req.file.buffer;
  try {
    await (await Conexion).execute(
      'INSERT INTO resultado (resultado, id_realizar) VALUES (?, ?)',
      [fileBuffer, id_realizar]
    );
    res.json({ success: true, message: 'Archivo subido exitosamente.' });
  } catch (error) {
    console.error('Error al guardar el archivo en la base de datos:', error);
    res.status(500).json({ error: 'Error al guardar el archivo' });
  }
});

// Editar un resultado existente
router.put('/:id', verificaToken, upload.single('file'), async (req, res) => {
  const { id } = req.params;
  const filePath = req.file ? req.file.path : null;
  try {
    if (filePath) {
      // Si hay un archivo, actualizamos el campo 'resultado'
      const query = 'UPDATE resultado SET resultado = ? WHERE id_resultado = ?';
      await (await Conexion).execute(query, [filePath, id]);
    } else {
      // Si no hay archivo, devolvemos un error
      return res.status(400).json({ error: 'No se ha proporcionado un archivo para actualizar el resultado' });
    }
    res.json({ success: true, message: 'Resultado actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el resultado en la base de datos:', error);
    res.status(500).json({ error: 'Error al actualizar el resultado' });
  }
});

// Eliminar un resultado existente
router.delete('/:id', verificaToken, async (req, res) => {
  const { id } = req.params;
  try {
    await (await Conexion).execute('DELETE FROM resultado WHERE id_resultado = ?', [id]);
    res.json({ success: true, message: 'Resultado eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar el resultado de la base de datos:', error);
    res.status(500).json({ error: 'Error al eliminar el resultado' });
  }
});

// Obtener por paciente y medico
router.get('/obtener/pacmedic', verificaToken, async (req, res) => {
  const { id_paciente, id_medico, action } = req.query;
  try {
    let query = `
      SELECT res.id_resultado, res.resultado, 
        re.id_realizar, re.id_paciente, re.id_medico, re.id_examen, re.id_analisis, 
        p.cedula AS paciente_cedula, p.paciente, 
        m.cedula AS medico_cedula, m.nombre_apellido, 
        a.analisis, e.examen 
      FROM resultado res 
      RIGHT JOIN realizar_examen re ON res.id_realizar = re.id_realizar 
      INNER JOIN pacientes p ON re.id_paciente = p.id_paciente 
      INNER JOIN medico m ON re.id_medico = m.id_medico 
      INNER JOIN analisis a ON re.id_analisis = a.id_analisis 
      INNER JOIN examenes e ON re.id_examen = e.id_examen
    `;
    const queryParams = [];
    if (id_paciente) {
      query += ` WHERE re.id_paciente = ?`;
      queryParams.push(id_paciente);
    }
    if (id_medico) {
      query += ` AND re.id_medico = ?`;
      queryParams.push(id_medico);
    }
    query += ` ORDER BY re.fecha DESC;`;
    const [rows] = await (await Conexion).execute(query, queryParams);
    //console.log("Columnas",rows);
    let filteredResults = [];
    let hasNullResult = false;
    if (action==='Create'){
      for (let patient of rows) {
        if (patient.id_resultado === null) hasNullResult = true;
        if (hasNullResult) {
          filteredResults.push(patient);
          hasNullResult = false;
        }
      }
    } else {
      filteredResults = rows;
    }
    res.json({ resultadosData: filteredResults });
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).json({ error: 'Error al obtener los resultados' });
  }
});

// Endpoint para Obtener todos los resultados
router.get('/obtener/result', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM resultado'
    );
    res.json({ result: rows });
  } catch (error) {
    console.error('Error fetching resultados:', error);
    res.status(500).json({ error: 'Error al obtener resultados.' });
  }
});
router.get('/download/:id', verificaToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await (await Conexion).execute(
      'SELECT res.resultado, p.paciente  FROM resultado res  join realizar_examen re ON res.id_realizar = re.id_realizar JOIN pacientes p ON re.id_paciente = p.id_paciente  WHERE res.id_resultado = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Archivo no encontrado' });
    }
    const fileData = rows[0].resultado;
    res.setHeader('Content-Disposition', `attachment; filename=${id}.pdf`);
    res.setHeader('Content-Type', 'application/pdf');
    res.send(fileData);
  } catch (error) {
    console.error('Error al obtener el archivo de la base de datos:', error);
    res.status(500).json({ error: 'Error al obtener el archivo' });
  }
});

module.exports = router;
