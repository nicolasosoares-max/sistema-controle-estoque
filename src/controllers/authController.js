const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const pool = require('../config/database');

async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      erro: 'E-mail e senha são obrigatórios.'
    });
  }

  try {
    const resultado = await pool.query(
      `
        SELECT
          id,
          nome,
          email,
          senha,
          perfil,
          ativo
        FROM usuarios
        WHERE email = $1
      `,
      [email]
    );

    if (resultado.rowCount === 0) {
      return res.status(401).json({
        erro: 'E-mail ou senha inválidos.'
      });
    }

    const usuario = resultado.rows[0];

    if (!usuario.ativo) {
      return res.status(403).json({
        erro: 'Usuário inativo.'
      });
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      usuario.senha
    );

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: 'E-mail ou senha inválidos.'
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        perfil: usuario.perfil
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '2h'
      }
    );

    return res.status(200).json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil
      }
    });
  } catch (erro) {
    console.error('Erro no login:', erro);

    return res.status(500).json({
      erro: 'Erro interno ao realizar login.'
    });
  }
}

module.exports = {
  login
};