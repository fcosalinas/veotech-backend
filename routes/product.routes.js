// ----------------------------------------------------------------
// routes/product.routes.js - Define los endpoints de la API para Productos
// ----------------------------------------------------------------
const router = require('express').Router();
let Product = require('../models/product.model');
const auth = require('../middleware/auth.middleware');

// --- Rutas Públicas (Cualquiera puede verlas) ---

// GET: Obtener todos los productos
router.route('/').get((req, res) => {
    Product.find()
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Error: ' + err));
});

// GET: Obtener un producto por su ID
router.route('/:id').get((req, res) => {
    Product.findById(req.params.id)
        .then(product => res.json(product))
        .catch(err => res.status(400).json('Error: ' + err));
});

// GET: Obtener todos los productos de un vendedor específico
router.route('/by-seller/:sellerId').get((req, res) => {
    Product.find({ sellerId: req.params.sellerId })
        .then(products => res.json(products))
        .catch(err => res.status(400).json('Error: ' + err));
});


// --- Rutas Protegidas (Requieren iniciar sesión) ---

// POST: Crear un nuevo producto
router.route('/add').post(auth, async (req, res) => {
    const { name, description, price, priceUnit, category, images } = req.body;
    const sellerId = req.seller.id; // Obtenemos el ID del vendedor desde el token

    const newProduct = new Product({ name, description, price, priceUnit, category, images, sellerId });

    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(400).json('Error: ' + err);
    }
});

// DELETE: Eliminar un producto por su ID
router.route('/:id').delete(auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        if (product.sellerId.toString() !== req.seller.id) {
            return res.status(401).json({ msg: 'Acción no autorizada.' });
        }

        await product.deleteOne();
        res.json({ msg: 'Producto eliminado con éxito.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});

// PUT: Actualizar un producto por su ID
router.route('/update/:id').put(auth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ msg: 'Producto no encontrado.' });
        }

        if (product.sellerId.toString() !== req.seller.id) {
            return res.status(401).json({ msg: 'Acción no autorizada.' });
        }

        const { name, description, price, priceUnit, category, images } = req.body;

        product.name = name;
        product.description = description;
        product.price = price;
        product.priceUnit = priceUnit;
        product.category = category;
        product.images = images;

        await product.save();

        res.json({ msg: 'Producto actualizado con éxito.', product });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});

// --- GET: Buscar productos ---
// NUEVA RUTA PÚBLICA
router.route('/search/:query').get(async (req, res) => {
    try {
        const query = req.params.query;
        // Creamos una expresión regular para una búsqueda flexible (no distingue mayúsculas/minúsculas)
        const searchQuery = new RegExp(query, 'i');

        // Buscamos productos donde el nombre O la descripción coincidan con la búsqueda
        const products = await Product.find({
            $or: [
                { name: searchQuery },
                { description: searchQuery },
                { category: searchQuery }
            ]
        });

        res.json(products);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del Servidor');
    }
});

module.exports = router;

