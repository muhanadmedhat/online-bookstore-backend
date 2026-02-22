const swaggerJsdoc = require('swagger-jsdoc');

// Swagger definition
// This object defines the base configuration for our API documentation
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Online Bookstore API',
    version: '1.0.0',
    description: 'Documentation for the Online Bookstore backend API'
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
