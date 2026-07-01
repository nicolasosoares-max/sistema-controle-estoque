require('dotenv').config();

const express = require('express');

const pool = require('./config/database');
const authRoutes = require('./routes/auth');
const produtosRoutes = require('./routes/produtos');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    mensagem: 'API do Sistema de Controle de Estoque funcionando.'
  });
});

app.use(authRoutes);
app.use('/produtos', produtosRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: 'Rota não encontrada.'
  });
});

const PORT = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  try {
    await pool.query('SELECT 1');

    console.log('PostgreSQL conectado com sucesso.');

    app.listen(PORT, () => {
      console.log(
        `Servidor rodando em http://localhost:${PORT}`
      );
    });
  } catch (erro) {
    console.error(
      'Erro ao conectar ao PostgreSQL:',
      erro.message
    );

    process.exit(1);
  }
}

iniciarServidor();