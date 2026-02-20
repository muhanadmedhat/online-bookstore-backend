const express = require('express');
const CustomError = require('./helpers/CustomError');
const router = require('./routes');

const app = express();

app.use(express.json());
app.use('/health', (req, res) => {
  console.log('aa');
  res.json({message: 'API is running'});
});
app.use(router);
app.use((error, req, res, next) => {
  console.error('ERROR:', `${error}`);
  if (error instanceof CustomError) {
    res.status(error.statusCode || 500).json({error: error.message});
  } else {
    res.status(500).json({error: 'Internal Server Error'});
  }
});
module.exports = app;
