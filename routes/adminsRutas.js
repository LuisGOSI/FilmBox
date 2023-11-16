var rutaAd = require("express").Router();
var fs = require("fs");
var { adminAutorizado, autorizado} = require("../middlewares/funcionesSecurity");
var {  mostrarUsuarios, buscarPorID, borrarUsuario, modificarUsuario} = require("../database/usuariosbd");
var { mostrarPeliculas } = require("../database/peliculasbd");
var subirArchivo = require("../middlewares/subirArchivo");

// Pagina de inicio de admin-----------------------------------------------------------------------------------------------------
rutaAd.get("/adminInicio", adminAutorizado, async (req, res) => {
    var peliculas = await mostrarPeliculas()
    var users = await mostrarUsuarios()
    res.render("adminInicio", { peliculas, users });
});

rutaAd.get("/editar/:id", autorizado, async (req, res) => {
    var user = await buscarPorID(req.params.id);
    res.render("modificarUser", { user });
});

rutaAd.post("/editar", subirArchivo(), async (req, res) => {
    try {
        const usuarioAct = await buscarPorID(req.body.id);
        if (req.file) {
            req.body.foto = req.file.originalname;
            if (usuarioAct.foto) {
                const rutaFotoAnterior = `web/images/${usuarioAct.foto}`;
                fs.unlinkSync(rutaFotoAnterior);
            }
        } else {
            req.body.foto = req.body.fotoVieja;
        }
        await modificarUsuario(req.body);
        res.redirect("/adminInicio");
    } catch (error) {
        console.error("Error al editar usuario:", error);
    }
});

rutaAd.get("/borrar/:id", async (req, res) => {
    var usuario = await buscarPorID(req.params.id)
    if (usuario) {
        var foto = usuario.foto;
        fs.unlinkSync(`web/images/${foto}`);
        await borrarUsuario(req.params.id);
    }
    res.redirect("/adminInicio");
});

rutaAd.get("/", (req, res) => {
    res.render("usuarios/login");
});
module.exports = rutaAd;