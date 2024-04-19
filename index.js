require("dotenv").config();
var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
var port = require("./config/config");
var connection = require("./connection/connection").connect;
var app = express();
var server = require("http").createServer(app);
var response = require("./response/index");
const logger = require("./services/LoggerService");
var api = require("./routes/routes");
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("jusoor project ")
});
app.use(
  response.ok,
  response.fail,
  response.serverError,
  response.forbidden,
  response.notFound,
  response.badRequest
);
app.use(cors());
app.use("/api", api);
app.use(express.static(__dirname + '/public'));
const swaggerOptions = {
  openapi: '3.0.0',
  swaggerDefinition: {
    title: 'jusoor',
    description: 'API description',
    version: '1.0.0',
  },
  // Define the path to the file containing Swagger annotations
  apis: ['./routes/FamilyRoutes.js','./routes/Auth/UserAuthRoutes.js','./swaggerDocs.js'],
};
// Set up Swagger documentation middleware
const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
//error handling middleware
const errorHandler = (error, req, res, next) => {
  const status = error.status || 500;
  console.log(error);
  logger.error({
    statusCode: `${status}`,
    message: `${error.message}`,
    error: `${error}`,
    stackTrace: `${error.stack}`,
  });

  res.status(status).json({
    success: false,
    message: error.message,
  });
};
app.use(errorHandler);

connection((result) => {
  if (result) {
    server.listen(port.port, () => {
      console.log(`Server is running on port ${port.port}.`);
    });
  }
});

