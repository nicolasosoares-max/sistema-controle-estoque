const express = require('express');

const router = express.Router();

// Dados temporários enquanto o banco de dados ainda não foi criado
const produtos = [
  {
    id: 1,
    nome: 'Teclado',
    quantidade: 10,
    preco: 120.00
  },
  {
    id: 2,
    nome: 'Mouse',
    quantidade: 15,
    preco: 80.00
  }
];

// GET /produtos
// Retorna todos os produtos
router.get('/', (req, res) => {
  return res.status(200).json(produtos);
});

// GET /produtos/:id
// Retorna um produto de acordo com o ID informado
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

  return res.status(200).json(produto);
});

// POST /produtos
// Cadastra um novo produto
router.post('/', (req, res) => {
  const { nome, quantidade, preco } = req.body;

  if (!nome || quantidade === undefined || preco === undefined) {
    return res.status(400).json({
      erro: 'Nome, quantidade e preço são obrigatórios'
    });
  }

  if (
    typeof quantidade !== 'number' ||
    quantidade < 0 ||
    typeof preco !== 'number' ||
    preco < 0
  ) {
    return res.status(400).json({
      erro: 'Quantidade e preço devem ser números positivos'
    });
  }

  const maiorId = produtos.reduce(
    (maior, produto) => Math.max(maior, produto.id),
    0
  );

  const novoProduto = {
    id: maiorId + 1,
    nome,
    quantidade,
    preco
  };

  produtos.push(novoProduto);

  return res.status(201).json(novoProduto);
});

module.exports = router;