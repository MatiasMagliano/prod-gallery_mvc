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

    async login(req, res) {
        try {
            res.render(
                path.resolve(VIEWS, "publicas", "login"), {
                    titulo: "Ingreso de usuarios registrados"
                }
            );
        } catch (error) {
            throw error;
        }
    }

    async registro(req, res) {
        try {
            res.render(
                path.resolve(VIEWS, "publicas", "registro"), {
                    titulo: "Registro de nuevos usuarios"
                }
            );
        } catch (error) {
            throw error;
        }
    }
}