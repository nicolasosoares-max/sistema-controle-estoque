const express = require('express');

const produtosController = require(
  '../controllers/produtosController'
);

const {
  autenticar,
  permitirPerfis
} = require('../middlewares/authMiddleware');

const router = express.Router();

router.get(
  '/',
  autenticar,
  produtosController.listar
);

router.get(
  '/:id',
  autenticar,
  produtosController.buscarPorId
);

router.post(
  '/',
  autenticar,
  permitirPerfis('administrador'),
  produtosController.criar
);

router.put(
  '/:id',
  autenticar,
  permitirPerfis('administrador'),
  produtosController.atualizar
);

router.delete(
  '/:id',
  autenticar,
  permitirPerfis('administrador'),
  produtosController.remover
);

module.exports = router;