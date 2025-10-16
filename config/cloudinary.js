// ----------------------------------------------------------------
// config/cloudinary.js - Configuración de la conexión a Cloudinary
// ----------------------------------------------------------------
const cloudinary = require('cloudinary').v2;

// Configuramos Cloudinary con las credenciales que obtuviste.
// Estas se leerán desde el archivo .env para mantenerlas seguras.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
