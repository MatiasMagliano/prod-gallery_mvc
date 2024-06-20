/* *** NOMENCLADOR DE RUTAS CON AUTENTICACIÓN *** */

import express from 'express';

import { ControladorAuth } from '../controladores/controladorAuth.js';
import { ValidarRegistro } from '../middlewares/validar-registro.js';
import { EstaAutenticado } from '../middlewares/auth.js';

// instanciación del router de express
const router = express.Router();

const controladorAuth = new ControladorAuth();

// declaración de las rutas públicas
router.post("/login", EstaAutenticado, controladorAuth.dashboard);
router.post("/registro", ValidarRegistro, controladorAuth.registro);
router.get("/dashboard", EstaAutenticado, controladorAuth.dashboard);

export {
    router
}