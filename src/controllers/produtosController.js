const pool = require('../config/database');

async function listar(req, res) {
  try {
    const resultado = await pool.query(
      `
        SELECT
          id,
          nome,
          descricao,
          quantidade,
          preco::FLOAT8 AS preco,
          estoque_minimo AS "estoqueMinimo",
          ativo
        FROM produtos
        WHERE ativo = TRUE
        ORDER BY id
      `
    );

    return res.status(200).json(resultado.rows);
  } catch (erro) {
    console.error('Erro ao listar produtos:', erro);

    return res.status(500).json({
      erro: 'Erro interno ao listar produtos.'
    });
  }
}

async function buscarPorId(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      erro: 'ID inválido.'
    });
  }

  try {
    const resultado = await pool.query(
      `
        SELECT
          id,
          nome,
          descricao,
          quantidade,
          preco::FLOAT8 AS preco,
          estoque_minimo AS "estoqueMinimo",
          ativo
        FROM produtos
        WHERE id = $1
          AND ativo = TRUE
      `,
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao buscar produto:', erro);

    return res.status(500).json({
      erro: 'Erro interno ao buscar produto.'
    });
  }
}

async function criar(req, res) {
  const {
    nome,
    descricao,
    quantidade,
    preco,
    estoqueMinimo
  } = req.body;

  const quantidadeNumero = Number(quantidade);
  const precoNumero = Number(preco);
  const estoqueMinimoNumero = Number(estoqueMinimo);

  if (
    !nome ||
    !Number.isFinite(quantidadeNumero) ||
    !Number.isFinite(precoNumero) ||
    !Number.isFinite(estoqueMinimoNumero)
  ) {
    return res.status(400).json({
      erro: 'Nome, quantidade, preço e estoque mínimo são obrigatórios.'
    });
  }

  if (
    quantidadeNumero < 0 ||
    precoNumero < 0 ||
    estoqueMinimoNumero < 0
  ) {
    return res.status(400).json({
      erro: 'Os valores numéricos não podem ser negativos.'
    });
  }

  try {
    const resultado = await pool.query(
      `
        INSERT INTO produtos (
          nome,
          descricao,
          quantidade,
          preco,
          estoque_minimo
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
          id,
          nome,
          descricao,
          quantidade,
          preco::FLOAT8 AS preco,
          estoque_minimo AS "estoqueMinimo",
          ativo
      `,
      [
        nome,
        descricao || null,
        quantidadeNumero,
        precoNumero,
        estoqueMinimoNumero
      ]
    );

    return res.status(201).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao criar produto:', erro);

    return res.status(500).json({
      erro: 'Erro interno ao criar produto.'
    });
  }
}

async function atualizar(req, res) {
  const id = Number(req.params.id);

  const {
    nome,
    descricao,
    quantidade,
    preco,
    estoqueMinimo
  } = req.body;

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      erro: 'ID inválido.'
    });
  }

  try {
    const resultado = await pool.query(
      `
        UPDATE produtos
        SET
          nome = $1,
          descricao = $2,
          quantidade = $3,
          preco = $4,
          estoque_minimo = $5,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = $6
          AND ativo = TRUE
        RETURNING
          id,
          nome,
          descricao,
          quantidade,
          preco::FLOAT8 AS preco,
          estoque_minimo AS "estoqueMinimo",
          ativo
      `,
      [
        nome,
        descricao || null,
        Number(quantidade),
        Number(preco),
        Number(estoqueMinimo),
        id
      ]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    return res.status(200).json(resultado.rows[0]);
  } catch (erro) {
    console.error('Erro ao atualizar produto:', erro);

    return res.status(500).json({
      erro: 'Erro interno ao atualizar produto.'
    });
  }
}

async function remover(req, res) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      erro: 'ID inválido.'
    });
  }

  try {
    const resultado = await pool.query(
      `
        UPDATE produtos
        SET
          ativo = FALSE,
          atualizado_em = CURRENT_TIMESTAMP
        WHERE id = $1
          AND ativo = TRUE
        RETURNING id
      `,
      [id]
    );

    if (resultado.rowCount === 0) {
      return res.status(404).json({
        erro: 'Produto não encontrado.'
      });
    }

    return res.status(204).send();
  } catch (erro) {
    console.error('Erro ao remover produto:', erro);

    return res.status(500).json({
      erro: 'Erro interno ao remover produto.'
    });
  }
}

module.exports = {
  listar,
  buscarPorId,
  criar,
  atualizar,
  remover
};