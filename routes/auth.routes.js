// ----------------------------------------------------------------
// routes/auth.routes.js - Define los endpoints para Registro y Login
// ----------------------------------------------------------------
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
let Seller = require('../models/seller.model');

// --- POST: Registrar un nuevo Vendedor ---
// Ruta: /api/auth/register
router.route('/register').post(async (req, res) => {
    // Para el registro, solo pedimos los campos esenciales
    const { name, contactEmail, password } = req.body;
    
    if (!name || !contactEmail || !password) {
        return res.status(400).json({ msg: 'Por favor, ingresa todos los campos.' });
    }

    try {
        let seller = await Seller.findOne({ contactEmail });
        if (seller) {
            return res.status(400).json({ msg: 'Ya existe un vendedor con ese email.' });
        }
        
        seller = new Seller({
            name,
            contactEmail,
            password,
            // Asignamos valores por defecto para los otros campos requeridos
            tagline: `Emprendedor de ${name}`,
            sellerType: 'product',
            location: 'Sur de Chile',
        });

        await seller.save();
        res.status(201).json({ msg: 'Vendedor registrado con éxito. Ahora puedes iniciar sesión.' });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// --- POST: Iniciar sesión (Login) de un Vendedor ---
// Ruta: /api/auth/login
router.route('/login').post(async (req, res) => {
    const { contactEmail, password } = req.body;
    if (!contactEmail || !password) {
        return res.status(400).json({ msg: 'Por favor, ingresa todos los campos.' });
    }

    try {
        const seller = await Seller.findOne({ contactEmail });
        if (!seller) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas.' });
        }

        const payload = {
            seller: { id: seller.id }
        };

        // Generamos el token de seguridad
        // NOTA: En un proyecto real, el 'secreto' debe ser una variable de entorno segura.
        jwt.sign(payload, 'jwt_super_secreto_temporal', { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

module.exports = router;
