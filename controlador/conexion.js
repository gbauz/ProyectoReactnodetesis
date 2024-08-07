const mysql = require('mysql2/promise');

const conexion = mysql.createConnection({
  host: 'localhost',  // Cambia por la dirección de tu servidor MySQL
  user: 'root',  // Cambia por tu usuario de MySQL
  password: '',  // Cambia por tu contraseña de MySQL
  database: 'proyecto_tesis',  // Cambia por tu base de datos
});
/* 
 const conexion = mysql.createConnection({
   host: process.env.DB_HOST,
   user: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DBNAME,
   waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); */

/* const conexion = mysql.createConnection({
  host: 'blyjpf4f1z3sqpoh8zub-mysql.services.clever-cloud.com',  // Cambia por la dirección de tu servidor MySQL
  user: 'uebkm8w0mngt6qil',  // Cambia por tu usuario de MySQL
  password: 'qF0Epmdk0Dx1rPg6lehV',  // Cambia por tu contraseña de MySQL
  database: 'blyjpf4f1z3sqpoh8zub',  // Cambia por tu base de datos
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}); */


module.exports = conexion;
