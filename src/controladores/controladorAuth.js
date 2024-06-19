import sharp from 'sharp';
import { pool, VIEWS } from '../config/app-config.js';
import path from 'path';

export class ControladorAuth {
    async nuevoProducto(req, res) {
        const { marca, nombre, precio, descripcion, stock, categoria } = req.body;

        if (!req.files || !req.files.imagen) {
            return res.status(400).send('No se subió ninguna imagen.');
        }

        const imagen = req.files.imagen;

        try {
            const connection = await pool.getConnection();
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO productos (marca, nombre, precio, descripcion, stock, categoria) VALUES (?, ?, ?, ?, ?, ?)',
                [marca, nombre, precio, descripcion, stock, categoria]
            );

            const productoId = result.insertId;
            const uploadPath = path.join(__dirname, 'public/uploads', `${productoId}.jpg`);
            const thumbnailPath = path.join(__dirname, 'public/uploads/thumbnails', `${productoId}.jpg`);

            // Guardar la imagen original y convertirla a .jpg
            await imagen.mv(uploadPath);

            // Crear una miniatura de 200x200 píxeles en formato .jpg
            await sharp(uploadPath)
                .resize(200, 200, { withoutEnlargement: true })
                .toFile(thumbnailPath);

            const imagenUrl = '/uploads/' + productoId + '.jpg';
            const thumbnailUrl = '/uploads/thumbnails/' + productoId + '.jpg';

            await connection.query(
                'UPDATE productos SET imagen_url = ?, thumbnail_url = ? WHERE id = ?',
                [imagenUrl, thumbnailUrl, productoId]
            );

            await connection.commit();
            connection.release();

            res.status(201).send('Producto creado con éxito y la imagen subida.');
        } catch (error) {
            console.error('Error al crear el producto:', error);
            const connection = await pool.getConnection();
            await connection.rollback();
            connection.release();
            res.status(500).send('Error al crear el producto.');
        }
    }
}