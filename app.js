const cors = require('cors');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
const CustomError = require('./helpers/CustomError');
const router = require('./routes');

const app = express();
app.use(cors());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(express.json());

app.use('/health', (req, res) => {
  res.json({message: 'API is running'});
});

app.use(router);

app.use((error, req, res, next) => {
  console.error('ERROR:', `${error}`);
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({error: error.message});
  } else {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = app;
