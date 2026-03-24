const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  const isAPI = req.path.startsWith('/api/');

  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map(e => e.message);
    if (isAPI) return res.status(400).json({ success: false, message: 'Validation error', errors: messages });
    return res.status(400).render('error', { title: 'Validation Error', message: messages.join(', '), status: 400 });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  if (isAPI) return res.status(status).json({ success: false, message });
  res.status(status).render('error', { title: 'Error', message, status });
};

const notFound = (req, res, next) => {
  const isAPI = req.path.startsWith('/api/');
  if (isAPI) return res.status(404).json({ success: false, message: 'Route not found.' });
  res.status(404).render('error', { title: '404 Not Found', message: 'The page you are looking for does not exist.', status: 404 });
};

module.exports = { errorHandler, notFound };
