import { body, validationResult } from 'express-validator';

// Middleware de validación para el registro
export const ValidarRegistro = [
  body('username')
    .isLength({ min: 3 }).withMessage('El nombre de usuario debe tener al menos 3 caracteres')
    .trim()
    .escape(),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .trim()
    .escape(),
  body('password_repeat')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Las contraseñas no coinciden');
      }
      return true;
    })
    .trim()
    .escape(),
  // Middleware para manejar los resultados de validación
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('error_msg', errors.array().map(err => err.msg).join(' '));
      return res.redirect('/registro');
    }
    next();
  }
];