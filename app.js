const cors = require('cors');
const express = require('express');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger.js');
const CustomError = require('./helpers/CustomError');
const logger = require('./helpers/logger.js');
const router = require('./routes');

const app = express();
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ['\'self\''],
        imgSrc: ['\'self\'', 'https://res.cloudinary.com'],
        scriptSrc: ['\'self\''],
        styleSrc: ['\'self\'']
      }
    }
  })
);

app.set('trust proxy', 1);

const corsOptions = {
  origin: [
    'http://localhost:4200',
    'https://online-bookstore-frontend-mu.vercel.app/home'
  ]
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(
  morgan('combined', {
    stream: {
      write: (message) => logger.http(message.trim())
    }
  })
);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300
});

app.use('/', limiter, router);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({message: 'API is running'});
});

app.use((error, req, res, next) => {
  logger.error({
    message: error.message,
    stack: error.stack
  });
  if (error instanceof CustomError) {
    res.status(error.statusCode).json({error: error.message});
  } else {
    res.status(500).json({error: 'Internal Server Error'});
  }
});

module.exports = app;
