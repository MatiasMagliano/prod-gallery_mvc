/* *** NOMENCLADOR DE RUTAS PÚBLICAS *** */

import express from 'express';

import { ControladorPublico } from '../controladores/controladorPublico.js';

// instanciación del router de express
const router = express.Router();

const controladorPublico = new ControladorPublico();

router.get("/index", controladorPublico.index);

export {
    router
}