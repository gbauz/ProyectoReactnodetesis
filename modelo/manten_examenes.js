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
        re.id_realizar, re.fecha, p.id_paciente, p.cedula AS paciente_cedula, p.paciente,
        p.edad, p.sexo, p.celular AS paciente_celular, re.id_medico, m.cedula AS medico_cedula, 
        m.nombre_apellido, m.celular AS medico_celular, m.direccion, esp.id_especialidad, 
        esp.nombre, re.id_analisis, a.analisis, re.id_examen, e.examen
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
          p.id_paciente, re.fecha, m.id_medico, a.id_analisis, e.id_examen;`
    );
    const result = {};
    rows.forEach(row => {
      if (!result[row.id_paciente]) {
        result[row.id_paciente] = {
          id_realizar: row.id_realizar,
          fecha: row.fecha,
          id_paciente: row.id_paciente,
          paciente_cedula: row.paciente_cedula,
          paciente: row.paciente,
          edad: row.edad,
          sexo: row.sexo,
          celular: row.paciente_celular,
          medico: []
        };
      }

      let medico = result[row.id_paciente].medico.find(m => m.id_medico === row.id_medico);
      if (!medico) {
        medico = {
          id_medico: row.id_medico,
          medico_cedula: row.medico_cedula,
          nombre_apellido: row.nombre_apellido,
          medico_celular: row.medico_celular,
          id_especialidad: row.id_especialidad,
          especialidad: row.nombre,
          direccion: row.direccion,
          analisis: []
        };
        result[row.id_paciente].medico.push(medico);
      }

      let analisis = medico.analisis.find(a => a.id_analisis === row.id_analisis);
      if (!analisis) {
        analisis = {
          id_analisis: row.id_analisis,
          analisis: row.analisis,
          examen: []
        };
        medico.analisis.push(analisis);
      }

      if (!analisis.examen.find(e => e.id_examen === row.id_examen)) {
        analisis.examen.push({
          id_examen: row.id_examen,
          examen: row.examen
        });
      }
    });
    const response = Object.values(result);
    res.json({ mantexamen: response });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Error las ordenes de examen' });
  }
});

// Endpoint para agregar un nuevo examen realizado
router.post('/', verificaToken, async (req, res) => {
  const { id_paciente, id_medico, examenes } = req.body;

  // Verifica que los parámetros requeridos no sean undefined
  if (!id_paciente || !id_medico || !examenes || !Array.isArray(examenes)) {
    return res.status(400).json({ error: 'Datos incompletos o inválidos' });
  }

  try {
    // Preparar los datos para la inserción
    const values = examenes.map(examen => [id_paciente, id_medico, examen.id_examen, examen.id_analisis]);

    // Construir la consulta SQL dinámica
    let sql = 'INSERT INTO realizar_examen (id_paciente, id_medico, id_examen, id_analisis) VALUES ';
    sql += values.map(() => '(?, ?, ?, ?)').join(', ');

    // Obtener los valores de la matriz para la inserción
    const flattenedValues = values.reduce((acc, val) => acc.concat(val), []);
    console.log(values)

    // Insertar los nuevos exámenes realizados en la base de datos
    const [result] = await (await Conexion).execute(sql, flattenedValues);

    // Respondemos con el ID del nuevo registro insertado
    res.json({ id_realizar: result.insertId });
  } catch (error) {
    console.error('Error al insertar examen realizado:', error);
    res.status(500).json({ error: 'Error al insertar examen realizado.' });
  }
});

router.delete('/:id', verificaToken, async (req, res) => {
  const userId = req.params.id;
  //const usuario_nombre = req.user.name; // Asumiendo que el middleware verificaToken añade el nombre del usuario logueado a req.user
  //const ip_usuario = getClientIp(req);
  //const accion = `Eliminó usuario: ${userId}`;

  try {
    
    await (await Conexion).execute('DELETE FROM Realizar_examen WHERE id_realizar = ?', [userId]);

    //await registrarAuditoria(usuario_nombre, ip_usuario, accion);
    res.json({ success: true, message: 'Analisis eliminado correctamente.' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error al eliminar usuario.' });
  }
});
module.exports = router;
