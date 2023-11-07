var ruta = require("express").Router();
var fs = require("fs");
var { nuevoUsuario, buscarPorUsuario } = require("../database/usuariosbd");
var { mostrarPeliculas, nuevaPelicula, buscarPelicula} = require("../database/peliculasbd");
var subirArchivo = require("../middlewares/subirArchivo");
var {autorizado,validarPassword} = require("../middlewares/funcionesSecurity");

// Login-------------------------------------------------------------------------------------------------------------------------
ruta.get("/loginUser", (req, res) => {
  res.render("login");
});

ruta.post("/login", async (req, res) => {
  var { usuario, password } = req.body;
  var usuarioEncontrado = await buscarPorUsuario(usuario);
  if (usuarioEncontrado) {
    var passwordCorrecto = await validarPassword(
      password,
      usuarioEncontrado.password,
      usuarioEncontrado.salt
    );
    if (passwordCorrecto) {
      if (usuarioEncontrado.admin) {
        req.session.admin = usuarioEncontrado.admin;
        res.redirect("/");
      } else {
        req.session.usuario = usuarioEncontrado.usuario;
        res.redirect("/");
      }
    } else {
      var error = "Nombre de usuario o contraseña incorrecta";
      console.log(error);
      res.send(`<script>alert("${error}"); window.location.href="/loginUser";</script>`);
    }
  } else {
    console.log("Usuario o contraseña incorrectos");
    res.render("login");
  }
});

ruta.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

// Nuevo usuario-----------------------------------------------------------------------------------------------------------------
ruta.get("/nuevousuario", (req, res) => {
  res.render("nuevoUsuario");
});

ruta.post("/nuevousuario", subirArchivo(), async (req, res) => {
  req.body.foto = req.file.originalname;
  var error = await nuevoUsuario(req.body);
  res.redirect("/");
});

// Nueva pelicula----------------------------------------------------------------------------------------------------------------
ruta.post("/nuevapelicula", subirArchivo(), async (req, res) => {
  req.body.foto = req.file.originalname;
  console.log(req.body);
  var error = await nuevaPelicula(req.body);
  res.redirect("/");
});

ruta.get("/nuevapelicula", autorizado, async(req,res)=>{
  res.render("nuevaPelicula");
});

// Pagina de inicio--------------------------------------------------------------------------------------------------------------
ruta.get("/", async (req, res) => {
  var peliculas = await mostrarPeliculas();
  res.render("inicio", { peliculas });
});

// Pagina de peliculas-----------------------------------------------------------------------------------------------------------

ruta.get("/pelicula/:id", async (req, res) => {
  try {
    var pelicula = await buscarPelicula(req.params.id);
    if (pelicula) {
      res.render("pelicula", { pelicula });
    } else {
      var error = "Pelicula no encontrada";
      console.log(error);
      res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
    }
  } catch (err) {
    var error = "Error al buscar la película";
    console.log(error);
    res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
  }
});


module.exports = ruta;

