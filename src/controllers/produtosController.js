// Dados temporários em memória.
// Posteriormente serão substituídos pelo banco de dados.

const produtos = [
  {
    id: 1,
    nome: 'Teclado',
    quantidade: 10,
    preco: 120
  },
  {
    id: 2,
    nome: 'Mouse',
    quantidade: 15,
    preco: 80
  }
];

const listar = (req, res) => {
  return res.status(200).json(produtos);
};

const buscarPorId = (req, res) => {
  const id = Number(req.params.id);

  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

  return res.status(200).json(produto);
};

const criar = (req, res) => {
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
};

const atualizar = (req, res) => {
  const id = Number(req.params.id);

  const index = produtos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

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

  produtos[index] = {
    id: produtos[index].id,
    nome,
    quantidade,
    preco
  };

  return res.status(200).json(produtos[index]);
};

const remover = (req, res) => {
  const id = Number(req.params.id);

  const index = produtos.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({
      erro: 'Produto não encontrado'
    });
  }

  produtos.splice(index, 1);

  return res.status(204).send();
};

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};