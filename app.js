const express = require("express");
const routes = require('./routes');

const app = express();
app.use(express.json());
app.use(routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use((error, req, res, next) => {
  console.error('Error:', error);
  const statusCode = error.statusCode || error.status || 500;
  const message = error.message || 'Internal server error';
  const code = error.code || 'INTERNAL_SERVER_ERROR';
  res.status(statusCode).json({
    error: message,
    code: code
  });
});

module.exports = app;