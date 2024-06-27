const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3010;

const usuariosRouter = require('./modelo/usuarios');
const rolesRouter = require('./modelo/roles');
const permisosRouter = require('./modelo/permisos');
const auditoriaRouter = require('./modelo/auditoria');


function exception_routes(paths, fn) {
  return function (req, res, next) {
    if (paths.some(path => req.path.startsWith(path))) return next();
    return fn(req, res, next);
  }
}

const whitelist = ['https://localhost', 'http://localhost:3010'];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.some(domain => origin.includes(domain))) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(exception_routes(['/login', '/another_route'], cors(corsOptions)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', usuariosRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/permisos', permisosRouter);
app.use('/api/auditoria', auditoriaRouter);

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
