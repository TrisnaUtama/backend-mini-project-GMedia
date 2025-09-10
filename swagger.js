const swaggerJSDoc = require('swagger-jsdoc');
const { apiReference } = require('@scalar/express-api-reference');

exports.swagger = (app) => {
    const options = {
        definition: {
            openapi: '3.1.0',
            info: {
                title: 'Backend Mini Project API',
                description: 'API documentation for the Backend Mini Project',
                version: '1.0.0',
            },
        },
        apis: ['./routes/*.js', './server.js'],
    };

    const swaggerSpec = swaggerJSDoc(options);

    app.use(
        '/docs',
        apiReference({
            spec: {
                content: swaggerSpec,
            },
            theme: 'purple',
        }),
    );

    app.get('/docs.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
};
