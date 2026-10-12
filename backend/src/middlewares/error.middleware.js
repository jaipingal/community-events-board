export const notFound = (req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } });
};

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;

  if (status >= 500) {
    console.error(err);
  }

  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message;

  res.status(status).json({ error: { message, details: err.details } });
};
