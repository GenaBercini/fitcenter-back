import swaggerAutogen from 'swagger-autogen';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const doc = {
    info: {
        title: 'API de Mascotas',
        description: 'Documentación de la API para la gestión de mascotas',
    },
    host: process.env.HOST || 'localhost:3000',
    schemes: [process.env.SCHEME || 'http'],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ['../index.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    require('../index.js'); 
});