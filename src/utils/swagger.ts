import swaggerJSDoc from "swagger-jsdoc";
import config from "./env";

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
        url: `http://localhost:${config.PORT}/api`,
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
  apis: [
    process.env.NODE_ENV === "production"
      ? "dist/routes/*.js"
      : "src/routes/*.ts", 
  ],
};

const swaggerSpec = swaggerJSDoc(option);
export default swaggerSpec;