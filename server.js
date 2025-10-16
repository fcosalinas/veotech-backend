// ----------------------------------------------------------------
// server.js - Punto de entrada principal para el Backend
// ----------------------------------------------------------------

// 1. Importar dependencias
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
// NUEVO: dotenv para manejar variables de entorno
require('dotenv').config(); 

// 2. Inicializar la aplicación Express
const app = express();
const PORT = process.env.PORT || 5000;

// 3. Configurar Middleware
// Habilita CORS para permitir que el frontend se comunique con este backend
app.use(cors()); 
// Permite que el servidor entienda JSON en las peticiones
app.use(express.json()); 

// 4. Conexión a la Base de Datos MongoDB
// (Recuerda reemplazar '<password>' y '<dbname>' con tus credenciales reales)
const dbURI = 'mongodb+srv://mercadosur_user:tTdkBRvo3U0HqUXL@cluster0.jpievxm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose.connect(dbURI)
  .then(() => console.log('Conexión a MongoDB exitosa.'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

// 5. Definir Rutas de la API
// Ruta de prueba
app.get('/', (req, res) => {
  res.send('API de Mercado Sur está funcionando!');
});

// Importar y usar las rutas para Vendedores, Productos y Autenticación
const sellerRoutes = require('./routes/seller.routes');
const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const uploadRoutes = require('./routes/upload.routes');

app.use('/api/sellers', sellerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes);

// 6. Iniciar el Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

