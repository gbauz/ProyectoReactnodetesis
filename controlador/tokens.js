const jwt = require('jsonwebtoken');

const tokensRevocados = new Set(); // Conjunto para almacenar tokens revocados

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, isAdmin: user.rol_id === 1, email: user.correo_electronico, name: user.nombre },
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

    req.user = decoded;
    next();
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
