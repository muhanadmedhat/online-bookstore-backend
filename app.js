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
  const status = error.status || 500;
  const message = error.message || 'Internal server error';
  res.status(status).json({
    error: message
  });
});

module.exports = app;