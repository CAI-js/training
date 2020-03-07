const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const userRouter = require('./user.router');
const agentRouter = require('./agent.router');
const domainRouter = require('./domain.router');
const intentRouter = require('./intent.router');

const apiRoot = '/api';

function mount(app) {
  app.use(apiRoot, userRouter);
  app.use(apiRoot, agentRouter);
  app.use(apiRoot, domainRouter);
  app.use(apiRoot, intentRouter);

  const options = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Chatbot Trainer',
        version: '1.0.0',
        description: 'API for the NLP.js Chatbot Trainer',
        license: {
          name: 'MIT',
          url: 'https://choosealicense.com/licenses/mit/',
        },
        contact: {
          name: 'Swagger',
          url: 'https://swagger.io',
          email: 'Info@SmartBear.com',
        },
      },
      servers: [
        {
          url: 'http://localhost:4891/api',
        },
      ],
    },
    apis: ['./**/*.router.js'],
  };
  const specs = swaggerJsdoc(options);
  app.use('/docs', swaggerUi.serve);
  app.get('/docs', swaggerUi.setup(specs, { explorer: true }));
}

module.exports = mount;
