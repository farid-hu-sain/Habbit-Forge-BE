import swaggerJSDoc from "swagger-jsdoc";

const option: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Habit Tracker API Documentation",
      version: "1.0.0",
      description: "Dokumentasi lengkap API Habit Tracker System",
    },
    servers: [
      {
        url: `https://habbit-forge-be-production.up.railway.app/api`,
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["src/routes/*.ts"],
};

const swaggerSpec = swaggerJSDoc(option);
export default swaggerSpec;