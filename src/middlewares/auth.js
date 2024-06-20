import jwt from 'jsonwebtoken';

// Middleware para verificar si el usuario está autenticado
export const EstaAutenticado = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        req.flash('error_msg', 'Token no proporcionado');
        return res.redirect('/login');
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.error('Error al verificar el token JWT:', err);
        req.flash('error_msg', 'Sesión no válida. Por favor, inicia sesión nuevamente.');
        return res.redirect('/login');
    }
};