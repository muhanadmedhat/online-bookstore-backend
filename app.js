const express = require("express");
const app = express();

const routes = require("./routes");

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ message: "API is running" });
});

// base prefix
app.use("/api/v1", routes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

module.exports = app;
