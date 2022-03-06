const express = require('express'),
  app = express(),
  config = require('./config/app');
  routes = require('./routes/index'),
  bodyParser = require('body-parser');
  expressSwagger = require('express-swagger-generator')(app);

let options = {
    swaggerDefinition: {
        info: {
            description: 'This is a sample server',
            title: 'Swagger',
            version: '1.0.0',
        },
        host: 'localhost:3001',
        basePath: '/api',
        produces: [
            "application/json",
            "application/xml"
        ],
        schemes: ['http', 'https'],
        securityDefinitions: {
            JWT: {
                type: 'apiKey',
                in: 'header',
                name: 'Authorization',
                description: "",
            }
        }
    },
    basedir: __dirname,
    files: ['./routes/**/*.js']
};
expressSwagger(options)
app.listen(3000);

const port = config.port;

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', routes);


app.listen(port, () => {console.log(`Example app listening at http://localhost:${port}`)})
