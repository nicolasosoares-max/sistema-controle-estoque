const express = require('express');
const produtosRouter = require('./routes/produtos');

const app = express();
const PORTA = 3000;

// Permite que o servidor receba dados em JSON
app.use(express.json());

// Rota inicial para verificar se o servidor está funcionando
app.get('/', (req, res) => {
  return res.status(200).json({
    mensagem: 'API do Sistema de Controle de Estoque funcionando'
  });
});

// Registra as rotas de produtos
app.use('/produtos', produtosRouter);

// Inicia o servidor
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});console.log("Sistema de Controle de Estoque iniciado");