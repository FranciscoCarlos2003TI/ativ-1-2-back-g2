
function notFoundHandler(req, res) {
  res.status(404).json({ message: 'Rota não encontrada' });
}

function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'JSON inválido no corpo da requisição' });
  }

  console.error(err);
  res.status(500).json({ message: 'Erro interno do servidor' });
}

module.exports = { errorHandler, notFoundHandler };
