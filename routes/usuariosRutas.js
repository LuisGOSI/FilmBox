var ruta = require("express").Router();
var fs = require("fs");
var { nuevoUsuario, buscarPorUsuario } = require("../database/usuariosbd");
var { mostrarPeliculas, nuevaPelicula, buscarPelicula, buscarPeliculaGenero} = require("../database/peliculasbd");
var subirArchivo = require("../middlewares/subirArchivo");
var {autorizado,validarPassword} = require("../middlewares/funcionesSecurity");
const { mostrarReseñas, mostrarReseñasPorId, nuevaReseña } = require("../database/reseñasbd");

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
        req.session.usuario = usuarioEncontrado.usuario;
        res.redirect("/adminInicio");
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
    var error = "Nombre de usuario o contraseña incorrecta";
    res.send(`<script>alert("${error}"); window.location.href="/loginUser";</script>`);
    res.render("login");
  }
});

ruta.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

// Pagina de inicio--------------------------------------------------------------------------------------------------------------

ruta.get("/", async (req, res) => {
  var peliculas = await mostrarPeliculas();
  res.render("inicio", { peliculas });
});

// Pagina de peliculas-----------------------------------------------------------------------------------------------------------

ruta.get("/pelicula/:id", async (req, res) => {
  try {
    var sesion = req.session;
    var pelicula = await buscarPelicula(req.params.id);
    var reseñas = await mostrarReseñasPorId(req.params.id);
    if (pelicula) {
      res.render("pelicula", { pelicula, reseñas , sesion});
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


// Pagina de generos-------------------------------------------------------------------------------------------------------------

ruta.get("/genero/:genero", async (req, res) => {
  try {
    var genero = req.params.genero; 
    var peliculas = await buscarPeliculaGenero(genero);
    if (peliculas.length > 0) {
      res.render("genero", {peliculas , genero});
    } else {
      var error = "No se encontraron películas para el género especificado.";
      console.log(error);
      res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
    }
  } catch (err) {
    var error = "Error al buscar películas por género";
    console.log(error);
    res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
  }
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
  var error = await nuevaPelicula(req.body);
  res.redirect("/");
});

ruta.get("/nuevapelicula", autorizado, async(req,res)=>{
  res.render("nuevaPelicula");
});

// Nueva reseña -----------------------------------------------------------------------------------------------------------------

ruta.post("/agregarResenya", autorizado, async (req, res) => {
  try {
    var error = await nuevaReseña(req.body);
    res.redirect(req.get('referer'));
  } catch (err) {
    var error = "Error al agregar la reseña";
    console.log(error);
    res.send(`<script>alert("${error}"); window.location.href="/";</script>`);
  }
});

// Buscador ---------------------------------------------------------------------------------------------------------------------

ruta.post("/buscarPeli", async (req, res) => {
  try {
    var terminoBusqueda = req.body.search; 
    var pelicula = await buscarPelicula(terminoBusqueda);

    if (pelicula) {
      res.redirect(`/pelicula/${pelicula.id}`);
    } else {
      var error = "No se encontró la película";
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

