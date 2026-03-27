const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);

  const status = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors?.[0]?.path || 'field';
    return res.status(400).json({
      message: `${field} already exists`,
      field,
    });
  }

  // Sequelize query errors
  if (err.name === 'SequelizeQueryError') {
    return res.status(400).json({
      message: 'Database error',
      details: message,
    });
  }

  // Generic error response
  res.status(status).json({
    message,
    timestamp: new Date().toISOString(),
  });
};

module.exports = errorMiddleware;
