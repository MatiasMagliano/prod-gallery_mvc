/* *** CONTROLADOR PÚBLICO *** */
import { VIEWS } from '../config/app-config.js';
import path from 'path';

// modelos necesarios
import { ModeloProducto } from '../modelos/modeloProducto.js';
const Producto = new ModeloProducto();

export class ControladorPublico {
    async index(req, res) {
        let productos = await Producto.getProductos(req.query);
        try {
            res.render(
                path.resolve(VIEWS, "publicas", "homepage"), {
                    titulo: "Listado de productos",
                    productos: productos
                });
        } catch (error) {
            throw error;
        }
    }
}