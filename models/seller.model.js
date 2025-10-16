// ----------------------------------------------------------------
// models/seller.model.js - Define el Schema de MongoDB para los Vendedores
// ----------------------------------------------------------------
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const sellerSchema = new Schema({
    name: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true },
    // El email de contacto ahora debe ser único para cada vendedor
    contactEmail: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    profileImageUrl: { type: String },
    sellerType: { 
        type: String, 
        required: true,
        enum: ['product', 'service', 'both']
    },
    deliveryRegions: { type: [String] },
    serviceRegions: { type: [String] },
    rating: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
});

// Hook para encriptar la contraseña automáticamente antes de guardar un nuevo vendedor
sellerSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Seller = mongoose.model('Seller', sellerSchema);

module.exports = Seller;

