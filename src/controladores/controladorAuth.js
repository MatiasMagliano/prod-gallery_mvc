import sharp from 'sharp';
import { pool, VIEWS } from '../config/app-config.js';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class ControladorAuth {

    /*
    * Método de registro de usuario
    * 
    */
    async registro(req, res) {
        try {
            const { nombre, username, password } = req.body;

            // Comprobar si el nombre de usuario ya existe
            const [existingUsers] = await pool.query(
                'SELECT id FROM users WHERE LOWER(username) = LOWER(?)',
                [username]
            );

            if (existingUsers.length) {
                req.flash('error_msg', 'Este nombre de usuario ya está en uso!');
                return res.redirect('/registro');
            }

            // Hash de la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar el nuevo usuario en la base de datos
            await pool.query(
                'INSERT INTO users (name, username, password, registered) VALUES (?, ?, ?, NOW())',
                [nombre, username, hashedPassword]
            );

            // Generar un token JWT
            const token = jwt.sign(
                { username },
                process.env.JWT_SECRET, // Proveniente del archivo de variables de ambiente .env
                { expiresIn: process.env.SESSION_EXPIRESIN }
            );

            // Establecer el token JWT en una cookie
            res.cookie('token', token, { httpOnly: true });

            req.flash('success_msg', 'Registro exitoso! Ahora puedes iniciar sesión.');
            return res.redirect('/dashboard');

        } catch (error) {
            console.error('Error durante el registro:', error);
            req.flash('error_msg', 'Error en el servidor, por favor intenta de nuevo más tarde.');
            return res.redirect('/registro');
        }
    }

    async dashboard(req, res) {
        try {
            res.render(
                path.resolve(VIEWS, "publicas", "dashboard"), {
                    titulo: "Área de usuario registrado"
                }
            );
        } catch (error) {
            
        }
    }

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