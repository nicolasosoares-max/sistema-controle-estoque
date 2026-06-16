const express = require('express');
const produtosRouter = require('./routes/produtos');

const app = express();
const PORTA = 3000;


app.use(express.json());


app.get('/', (req, res) => {
  return res.status(200).json({
    mensagem: 'API do Sistema de Controle de Estoque funcionando'
  });
});


app.use('/produtos', produtosRouter);


app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});console.log("Sistema de Controle de Estoque iniciado");