const jwt = require('jsonwebtoken');

function autenticar(req, res, next) {
  const autorizacao = req.headers.authorization;

  if (!autorizacao || !autorizacao.startsWith('Bearer ')) {
    return res.status(401).json({
      erro: 'Token não informado.'
    });
  }

  const token = autorizacao.substring(7);

  try {
    const usuario = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.usuario = usuario;

    return next();
  } catch (erro) {
    return res.status(401).json({
      erro: 'Token inválido ou expirado.'
    });
  }
}

function permitirPerfis(...perfis) {
  return function verificarPerfil(req, res, next) {
    if (!req.usuario) {
      return res.status(401).json({
        erro: 'Usuário não autenticado.'
      });
    }

    if (!perfis.includes(req.usuario.perfil)) {
      return res.status(403).json({
        erro: 'Usuário sem permissão para esta operação.'
      });
    }

    return next();
  };
}

module.exports = {
  autenticar,
  permitirPerfis
};