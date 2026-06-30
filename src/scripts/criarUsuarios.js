require('dotenv').config();

const bcrypt = require('bcryptjs');
const pool = require('../config/database');

async function criarUsuarios() {
  const usuarios = [
    {
      nome: 'Administrador do Sistema',
      email: process.env.ADMIN_EMAIL,
      senha: process.env.ADMIN_PASSWORD,
      perfil: 'administrador'
    },
    {
      nome: 'Operador do Estoque',
      email: process.env.OPERADOR_EMAIL,
      senha: process.env.OPERADOR_PASSWORD,
      perfil: 'operador'
    }
  ];

  try {
    for (const usuario of usuarios) {
      const senhaCriptografada = await bcrypt.hash(
        usuario.senha,
        10
      );

      await pool.query(
        `
          INSERT INTO usuarios (
            nome,
            email,
            senha,
            perfil
          )
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (email)
          DO UPDATE SET
            nome = EXCLUDED.nome,
            senha = EXCLUDED.senha,
            perfil = EXCLUDED.perfil,
            ativo = TRUE
        `,
        [
          usuario.nome,
          usuario.email,
          senhaCriptografada,
          usuario.perfil
        ]
      );
    }

    console.log('Usuários criados com sucesso.');
  } catch (erro) {
    console.error('Erro ao criar usuários:', erro.message);
  } finally {
    await pool.end();
  }
}

criarUsuarios();