// routes.js
const express = require('express');
const router = express.Router();

const usuariosRouter = require('./modelo/usuarios');
const rolesRouter = require('./modelo/roles');
const permisosRouter = require('./modelo/permisos');
const auditoriaRouter = require('./modelo/auditoria');
const pacientesRouter = require('./modelo/pacientes');
const medicoRouter = require('./modelo/medico');
const analisisRouter = require('./modelo/analisis');
const examenesRouter = require('./modelo/examenes');
const manten_examenesRouter = require('./modelo/manten_examenes');
const especialidadRouter = require('./modelo/especialidad');
const examDetalleRouter = require('./modelo/examen_detalles');
const resultadosRouter = require('./modelo/resultados');

router.use('/api', usuariosRouter);
router.use('/api/roles', rolesRouter);
router.use('/api/permisos', permisosRouter);
router.use('/api/auditoria', auditoriaRouter);
router.use('/api/pacientes', pacientesRouter);
router.use('/api/medico', medicoRouter);
router.use('/api/analisis', analisisRouter);
router.use('/api/examenes', examenesRouter);
router.use('/api/mantenexamenes', manten_examenesRouter);
router.use('/api/especialidades', especialidadRouter);
router.use('/api/examen_detalle', examDetalleRouter);
router.use('/api/resultado', resultadosRouter);

module.exports = router;
