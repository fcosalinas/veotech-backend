// ----------------------------------------------------------------
// routes/seller.routes.js - Define los endpoints de la API para Vendedores
// ----------------------------------------------------------------
const router = require('express').Router();
let Seller = require('../models/seller.model');

// --- GET: Obtener todos los vendedores activos ---
// Corresponde a: GET /api/sellers
router.route('/').get((req, res) => {
    Seller.find({ isActive: true })
        .then(sellers => res.json(sellers))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- GET: Obtener un vendedor por su ID ---
// Corresponde a: GET /api/sellers/:id
router.route('/:id').get((req, res) => {
    Seller.findById(req.params.id)
        .then(seller => res.json(seller))
        .catch(err => res.status(400).json('Error: ' + err));
});

// --- POST: Crear un nuevo vendedor (versión inicial) ---
// Corresponde a: POST /api/sellers
router.route('/add').post((req, res) => {
    // Extraemos la información del cuerpo de la petición
    const { 
        name, location, profileImage, description, sellerType, 
        deliveryRegions, serviceRegions, contactEmail, contactPhone 
    } = req.body;

    const newSeller = new Seller({
        name, location, profileImage, description, sellerType,
        deliveryRegions, serviceRegions, contactEmail, contactPhone
    });

    newSeller.save()
        .then(() => res.json('Vendedor añadido!'))
        .catch(err => res.status(400).json('Error: ' + err));
});

// TODO: Implementar rutas para Actualizar (PUT) y Eliminar (DELETE)

module.exports = router;
