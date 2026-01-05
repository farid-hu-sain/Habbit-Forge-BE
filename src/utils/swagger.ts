import swaggerJSDoc from "swagger-jsdoc";
import config from "./env.js";

const option: swaggerJSDoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: 'E-Commerce API Documentation',
            version: '1.0.0',
            description: 'Dokumentasi lengkap API E-Commerce',
            contact: {
                name: 'Backend Developer',
            },
        },
        servers: [
            {
                url: `${config.HOST}:${config.PORT}/api`,
                description: 'Development server',
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ['src/routes/*.ts']
}

const swaggerSpec = swaggerJSDoc(option)

export default swaggerSpec;