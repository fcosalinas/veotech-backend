// ----------------------------------------------------------------
// models/product.model.js - Define el Schema de MongoDB para Productos Y Servicios
// ----------------------------------------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    // --- Campos Comunes ---
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    images: { type: [String], required: true },
    sellerId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Seller',
        required: true 
    },
    itemType: {
        type: String,
        required: true,
        enum: ['product', 'service'], // Solo permite estos dos valores
        default: 'product'
    },

    // --- Campos Específicos de Producto ---
    price: { type: Number }, // No es requerido para servicios
    priceUnit: { type: String }, // No es requerido para servicios

    // --- Campos Específicos de Servicio ---
    // El precio de un servicio puede ser variable, lo explicamos en la descripción
    serviceArea: { type: String }, // ej: "Región de Los Lagos"
    duration: { type: String }, // ej: "4 horas", "por noche"
    
}, {
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;

