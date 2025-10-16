// ----------------------------------------------------------------
// routes/upload.routes.js - Endpoint para subir imágenes a Cloudinary
// ----------------------------------------------------------------
const router = require('express').Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

// Multer se encarga de procesar el archivo que se envía desde el frontend.
// Lo almacenamos temporalmente en memoria antes de subirlo a Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({ storage });

// --- POST: Subir una imagen ---
// Ruta: /api/upload
// Esta ruta está protegida, solo usuarios logueados pueden subir imágenes.
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No se ha subido ningún archivo.' });
    }

    // Usamos un stream para subir el archivo desde el buffer de memoria a Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) {
          return res.status(500).json({ msg: 'Error al subir la imagen a Cloudinary.', error });
        }
        // Si la subida es exitosa, Cloudinary nos devuelve la URL segura de la imagen.
        res.status(200).json({ secure_url: result.secure_url });
      }
    );

    // Escribimos el buffer del archivo en el stream de subida
    uploadStream.end(req.file.buffer);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
});

module.exports = router;
