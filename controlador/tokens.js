const jwt = require('jsonwebtoken');

const tokensRevocados = new Set(); // Conjunto para almacenar tokens revocados

function generateToken(user) {
  let isAdmin = user.rol_id === 1 || user.rol_id === 3;

  return jwt.sign(
    {
      //userId: user.id,
      isAdmin,
      cedula: user.cedula,
      email: user.correo_electronico,
      name: user.nombre
    },
    'tu_clave_secreta',
    { expiresIn: '1h' }
  );
}

function verificaToken(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado.' });
  }

  const tokenValue = token.split(' ')[1];

  if (tokensRevocados.has(tokenValue)) {
    return res.status(401).json({ error: 'Token revocado. Inicie sesión nuevamente.' });
  }

  jwt.verify(tokenValue, 'tu_clave_secreta', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }

    // El token es válido, asignar los datos decodificados a req.user
    req.user = decoded;

    // Verificar los permisos según el rol
    if (req.user.isAdmin || req.user.rol_id === 3) {
      // Si el usuario es administrador o tiene el rol 3, permitir acceso
      next(); // Continuar con la solicitud
    } else {
      // Si el usuario no tiene permisos adecuados
      return res.status(403).json({ error: 'No tienes permiso para acceder.' });
    }
  });
}

function revokeToken(token) {
  tokensRevocados.add(token);
}

module.exports = {
  verificaToken,
  generateToken,
  revokeToken,
  tokensRevocados,
};
