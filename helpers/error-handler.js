function errorHandler(err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: '사용자 인증에 실패했습니다.' });
  }

  if (err.name === 'ValidationError') {
    return res.status(401).json({ message: err });
  }

  return res.status(500).json({ message: err });
}

module.exports = errorHandler;
