const mysql = require('mysql2/promise');

/* const conexion = mysql.createConnection({
  host: 'localhost',  // Cambia por la dirección de tu servidor MySQL
  user: 'root',  // Cambia por tu usuario de MySQL
  password: '',  // Cambia por tu contraseña de MySQL
  database: 'proyecto_tesis',  // Cambia por tu base de datos
}); */

const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});




module.exports = conexion;
