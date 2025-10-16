// ----------------------------------------------------------------
// middleware/auth.middleware.js - Guardián de rutas protegidas
// ----------------------------------------------------------------
const jwt = require('jsonwebtoken');

// Este es un "middleware": una función que se ejecuta antes de la ruta final.
// Su trabajo es verificar el token de seguridad que envía el frontend.
module.exports = function(req, res, next) {
    // 1. Obtener el token del encabezado de la petición
    const token = req.header('x-auth-token');

    // 2. Si no hay token, denegar el acceso
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, autorización denegada' });
    }

    // 3. Si hay un token, verificar que sea válido
    try {
        // Usamos el mismo secreto que en auth.routes.js para decodificarlo
        const decoded = jwt.verify(token, 'jwt_super_secreto_temporal');
        
        // Si es válido, extraemos la información del vendedor (su ID)
        // y la añadimos al objeto `req` para que las rutas posteriores puedan usarla.
        req.seller = decoded.seller;
        
        // Le damos paso a la siguiente función (la lógica de la ruta)
        next();
    } catch (err) {
        // Si el token no es válido (ha expirado, está malformado), denegar el acceso
        res.status(401).json({ msg: 'El token no es válido' });
    }
};
