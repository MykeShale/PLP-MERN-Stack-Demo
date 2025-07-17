const errorMiddleware = (err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
};

module.exports = errorMiddleware; 