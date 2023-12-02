var ruta = require("express").Router();
var rutaAd = require("express").Router();
var fs = require("fs");
var subirArchivo = require("../middlewares/subirArchivo");
var { nuevoUsuario, modificarUsuario } = require("../database/usuariosbd");
var { mostrarPeliculas, buscarPelicula, buscarPeliculaGenero} = require("../database/peliculasbd");



// Mostrar peliculas -------------------------------------------------
ruta.get("/api/mostrarPeliculas", async (req, res) => {
  var peliculas = await mostrarPeliculas();
  console.log("Peliculas:", peliculas);
  if (peliculas.length > 0)
    res.status(200).json(peliculas);
  else
    res.status(400).json("No hay peliculas");
});

// Buscar pelicula por ID ------------------------------------------
ruta.get("/api/pelicula/:id", async (req, res) => {
  try {
    var pelicula = await buscarPelicula(req.params.id);
    var reseñas = await mostrarReseñasPorId(req.params.id);
    if (pelicula) {
      res.json({ pelicula, reseñas });
    } else {
      var error = "Pelicula no encontrada";
      console.log(error);
      res.status(404).json({ mensaje: error });
    }
  } catch (err) {
    var error = "Error al buscar la película";
    console.log(error);
    res.status(500).json({ mensaje: error });
  }
});

// Buscar pelicula por genero ----------------------------------------

ruta.get("/api/genero/:genero", async (req, res) => {
  try {
    var genero = req.params.genero; 
    var peliculas = await buscarPeliculaGenero(genero);
    if (peliculas.length > 0) {
      res.status(200).json({ peliculas, genero });
    } else {
      res.status(404).json({ mensaje: "No se encontraron películas para el género especificado" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: "Error al buscar películas con ese género" });
  }
});

// Nuevo usuario -------------------------------------------------------

ruta.post("/api/nuevousuario", subirArchivo(), async (req, res) => {
  try {
    req.body.foto = req.file.originalname;
    var error = await nuevoUsuario(req.body);
    res.status(200).json({ mensaje: "Usuario agregado exitosamente" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ mensaje: "Error al agregar un nuevo usuario" });
  }
});

//editar usuario--------------------------------------------------------

rutaAd.post("/api/editar", subirArchivo(), async (req, res) => {
    try {
        const usuarioAct = await buscarPorID(req.body.id);
        if (req.file) {
            req.body.foto = req.file.originalname;
            if (usuarioAct.foto) {
                const rutaFotoAnterior = `web/images/${usuarioAct.foto}`;
                await fs.unlink(rutaFotoAnterior);
            }
        } else {
            req.body.foto = req.body.fotoVieja;
        }
        req.body.admin = req.body.admin === "true";
        await modificarUsuario(req.body);
        res.status(200).json({ mensaje: "Usuario editado exitosamente" });
    } catch (error) {
        console.error("Error al editar usuario:", error);
        res.status(500).json({ mensaje: "Error al editar usuario" });
    }
});

module.exports = ruta;