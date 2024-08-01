const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3010;
const app_url = process.env.REACT_APP_BASE_URL || 'https://proyecto-reactnodetesis-brown.vercel.app' || 3010 ;

const routes = require('./routes'); // Importar el archivo de rutas


const whitelist = ['https://localhost', 'http://localhost:3010',  'http://localhost:3000', 'https://proyecto-reactnodetesis-brown.vercel.app'];
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

function exception_routes(paths, fn) {
  return function (req, res, next) {
    if (paths.some(path => req.path.startsWith(path))) return next();
    return fn(req, res, next);
  }
}

app.use(exception_routes(['/login', '/another_route'], cors(corsOptions)));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes); // Usar el archivo de rutas

app.use(express.static(path.join(__dirname, 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
