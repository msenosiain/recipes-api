exports.handleNotFound = (message, res) => {
  return res.status(404).json({
    status: 'error',
    message: message || 'Not found'
  });
};

exports.handleError = (err, res) => {
  switch (err.name) {
    case 'ValidationError':
      res.status(400);
      break;
    default:
      res.status(500);
      break;
  }
  return res.json({
    error: err.message,
    response: err
  });
};
