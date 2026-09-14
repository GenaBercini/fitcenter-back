import swaggerAutogen from "swagger-autogen";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const doc = {
  info: {
    title: "API de FitCenter",
    description: "Documentación de la API para la gestión de FitCenter",
  },
  host: process.env.HOST || "localhost:3000",
  schemes: [process.env.SCHEME || "http"],
  // securityDefinitions: {
  //   BearerAuth: {
  //     type: "apiKey",
  //     name: "Authorization",
  //     in: "header",
  //     description: "Introduce tu token de Supabase: **Bearer <token>**",
  //   },
  // },
  // security: [
  //   {
  //     BearerAuth: [],
  //   },
  // ],
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["../index.js"];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  require("../index.js");
});
