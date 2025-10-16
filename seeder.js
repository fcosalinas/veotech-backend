// ----------------------------------------------------------------
// seeder.js - Script para poblar la base de datos con datos de ejemplo
// Uso:
// node seeder.js -i -> para importar los datos
// node seeder.js -d -> para eliminar los datos
// ----------------------------------------------------------------
const mongoose = require('mongoose');
const { sellers, products } = require('./data/seed_data');
const Seller = require('./models/seller.model');
const Product = require('./models/product.model');

// --- IMPORTANTE ---
// Copia y pega aquí la misma cadena de conexión (dbURI) que tienes en tu archivo server.js
const dbURI = 'mongodb+srv://mercadosur_user:tTdkBRvo3U0HqUXL@cluster0.jpievxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('MongoDB conectado para el seeder...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        // Limpiamos la base de datos primero
        await Seller.deleteMany();
        await Product.deleteMany();

        // Insertamos los datos
        await Seller.insertMany(sellers);
        await Product.insertMany(products);

        console.log('¡Datos importados con éxito!');
        process.exit();
    } catch (err) {
        console.error(`Error al importar datos: ${err}`);
        process.exit(1);
    }
};

const deleteData = async () => {
    try {
        await Seller.deleteMany();
        await Product.deleteMany();

        console.log('¡Datos eliminados con éxito!');
        process.exit();
    } catch (err) {
        console.error(`Error al eliminar datos: ${err}`);
        process.exit(1);
    }
};

// Lógica para ejecutar desde la terminal
const run = async () => {
    await connectDB();

    if (process.argv[2] === '-i') {
        await importData();
    } else if (process.argv[2] === '-d') {
        await deleteData();
    } else {
        console.log('Por favor, usa -i para importar o -d para eliminar los datos.');
        process.exit();
    }
};

run();
