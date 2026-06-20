require('dotenv').config();

const express = require('express');
const produtosRouter = require('./routes/produtos');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  return res.status(200).json({
    mensagem: 'API do Sistema de Controle de Estoque funcionando'
  });
});

app.use('/produtos', produtosRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});