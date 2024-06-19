/* *** SCRIPT PUNTO DE PARTIDA DE LA APP *** */

// modulos nativos
import path from "path";

// dependencias
import express from "express";
import expressLayouts from "express-ejs-layouts";

// constantes
import { APP_PORT, VIEWS, SALT_ROUNDS } from "./src/config/app-config.js";

const app = express();

// middlewares y acceso a las plantilas y directorios públicos
app.use(express.static('public'));
app.use("/styles/css", express.static(path.resolve(process.cwd(), "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.resolve(process.cwd(), "node_modules/bootstrap/dist/js")));
app.use(express.urlencoded({ extended: false }));

// andamiaje de plantillas ejs
app.set('views', VIEWS);
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('layout', path.resolve(VIEWS, "publicas", "layouts", "layout-general.ejs")); // layout general

// rutas para las vistas públicas
import { router as rutas_publicas } from "./src/rutas/rutasPublicas.js";
app.use("/", rutas_publicas);

// handle del error 404
app.use((req, res) => {
    res.status(404).render(path.resolve(VIEWS, "404.ejs"));
});


// servidor web de nodejs
app.listen(APP_PORT, () => {
    console.log(`Servidor iniciado en el puerto ${APP_PORT}...`);
});