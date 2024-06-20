/* *** NOMENCLADOR DE RUTAS PÚBLICAS *** */

import express from 'express';

import { ControladorPublico } from '../controladores/controladorPublico.js';

// instanciación del router de express
const router = express.Router();

const controladorPublico = new ControladorPublico();

// declaración de las rutas públicas
router.get("/index", controladorPublico.index);
router.get("/login", controladorPublico.login);
router.get("/registro", controladorPublico.registro);

export {
    router
}