module.exports = (error, _req, res, _next) => {
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error',
    details: error.details || null
  });
};
