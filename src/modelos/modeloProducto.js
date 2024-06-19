import { pool } from "../config/app-config.js";

export class ModeloProducto {

    constructor() {
        // constantes a declarar
    }

    async getProductos(parametros) {
        try {
            let consulta = 'SELECT * FROM productos'
            let whereClause = ''
            let valores = []

            // concateno los filtros que haya, a la query SQL
            if (parametros.marca) {
                whereClause += ` productos.marca LIKE '%${parametros.marca}%' AND`
            }

            if (parametros.nombre) {
                whereClause += ` productos.nombre LIKE '%${parametros.nombre}%' AND`
            }

            if (parametros.precioMin) {
                whereClause += ` productos.precio >= ? AND`
                valores.push(parametros.precioMin) // se agregan los valores al array
            }

            if (parametros.precioMax) {
                whereClause += ` productos.precio <= ? AND`
                valores.push(parametros.precioMax) // se agregan los valores al array
            }

            // recorto el final de la cláusula WHERE y concateno a la consulta
            if (whereClause !== '') {
                whereClause = ' WHERE' + whereClause.slice(0, -4)
                consulta += whereClause;
            }

            // agrego el orden según lo seleccionado y concateno a la consulta
            if (parametros.orden) {
                consulta += ` ORDER BY productos.precio ${parametros.orden};`
            }

            console.log(consulta);
            const [rows] = await pool.query(consulta, valores);

            if (rows.length === 0) {
                throw new Error("No hay resultados en la base de datos");
            }

            return rows;
        } catch (error) {
            throw new Error("Error de base de datos: " + error.message);
        }
    }
};