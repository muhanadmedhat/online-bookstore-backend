const express = require("express");
const router = require('./routes');
const CustomError = require('./helpers/CustomError');
const app = express();
app.use(express.json());
app.use(router);

app.use((err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      error: err.message
    });
  } else {
    res.status(500).json({
      error: err.message
    });
  }
});
app.get("/health", (req, res) => {
  res.json({ message: "API is running" });
});

module.exports = app;