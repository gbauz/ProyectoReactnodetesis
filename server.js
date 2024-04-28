const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Endpoint de ejemplo para el backend
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hola desde el backend!' });
});

// Servir archivos estáticos desde la carpeta 'client/build'
app.use(express.static(path.join(__dirname, 'client', 'build')));

// Servir el archivo HTML principal para rutas no definidas
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
