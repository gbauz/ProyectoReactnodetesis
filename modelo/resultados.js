const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Conexion = require('../controlador/conexion');
const { verificaToken } = require('./auth');

// Obtener todos los resultados
router.get('/', verificaToken, async (req, res) => {
  try {
    const [rows] = await (await Conexion).execute(`
      SELECT res.id_resultado, res.resultado, res.id_realizar, 
        re.id_paciente, re.id_medico, re.id_examen, re.id_analisis, 
        p.cedula AS paciente_cedula, p.paciente, 
        m.cedula AS medico_cedula, m.nombre_apellido, 
        a.analisis, e.examen 
      FROM resultado res 
      INNER JOIN realizar_examen re ON res.id_realizar = re.id_realizar 
      INNER JOIN pacientes p ON re.id_paciente = p.id_paciente 
      INNER JOIN medico m ON re.id_medico = m.id_medico 
      INNER JOIN analisis a ON re.id_analisis = a.id_analisis 
      INNER JOIN examenes e ON re.id_examen = e.id_examen ORDER 
      BY re.fecha DESC;
    `);
    const result = [];
    rows.forEach(row => {
      let existingEntry = result.find(
        r => r.id_paciente === row.id_paciente && r.id_medico === row.id_medico
      );
      if (!existingEntry) {
        existingEntry = {
          id: row.id_resultado,
          id_paciente: row.id_paciente,
          paciente_cedula: row.paciente_cedula,
          paciente: row.paciente,
          id_medico: row.id_medico,
          medico_cedula: row.medico_cedula,
          nombre_apellido: row.nombre_apellido,
          examen: []
        };
        result.push(existingEntry);
      }
      let existingExamen = existingEntry.examen.find(e => e.id_examen === row.id_examen);
      if (!existingExamen) {
        existingEntry.examen.push({
          id_resultado: row.id_resultado,
          resultado: row.resultado,
          id_analisis: row.id_analisis,
          analisis: row.analisis,
          id_examen: row.id_examen,
          examen: row.examen
        });
      }
    });
    res.json({ resultadosData: result });
  } catch (error) {
    console.error('Error al obtener los resultados:', error);
    res.status(500).json({ error: 'Error al obtener los resultados' });
  }
});

// Configuración de multer para manejo de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({ storage });

// Subir un nuevo archivo
router.post('/', verificaToken, upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No se subió ningún archivo' });
  }

  const { id_realizar } = req.body;
  const filePath = req.file.path;

  try {
    await (await Conexion).execute(
      'INSERT INTO resultado (resultado, id_realizar) VALUES (?, ?)',
      [filePath, id_realizar]
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

//Obtener resultado por id_realizar
router.get('/obtener/:id_realizar', verificaToken, async (req, res) => {
  try {
    const { id_realizar } = req.params;
    if (!id_realizar) {
      return res.status(400).json({ error: 'Datos incompletos o inválidos' });
    }
    const [rows] = await (await Conexion).execute(
      'SELECT * FROM `resultado` WHERE `id_realizar`=?',
      [id_realizar]
    );
    res.json({ resultadosData: rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error al obtener el resultado' });
  }
});

//Actualizar 
router.put('/actualizar/:id', verificaToken, async (req, res) => {
  const { id } = req.params;
  const { nuevoIdResultado } = req.body; // Suponiendo que envías el nuevo id_resultado en el cuerpo de la solicitud
  if (!nuevoIdResultado) {
    return res.status(400).json({ error: 'El nuevo id_resultado es requerido.' });
  }
  try {
    await (await Conexion).execute(
      'UPDATE `resultado` SET `id_resultado` = ? WHERE `id_resultado` = ?',
      [nuevoIdResultado, id]
    );
    res.json({ success: true, message: 'id_resultado actualizado exitosamente.' });
  } catch (error) {
    console.error('Error al actualizar el id_resultado en la base de datos:', error);
    res.status(500).json({ error: 'Error al actualizar el id_resultado' });
  }
});

module.exports = router;
