var conexion = require("./conexion").conexionPelis;
var Pelicula = require("../models/Peliculas");

async function mostrarPeliculas() {
  var movies = [];
  try {
    var peliculas = await conexion.get();
    peliculas.forEach((pelicula) => {
      var movie = new Pelicula(pelicula.id, pelicula.data());
      movies.push(movie.obtenerDatos);
    });
  } catch (err) {
    console.log("Error al recuperar peliculas de la base de datos: " + err);
  }
  return movies;
}

async function buscarPelicula(id) {
  try {
    var pelicula = await conexion.doc(id).get();
    if (pelicula.exists) {
      return new Pelicula(pelicula.id, pelicula.data());
    } else {
      console.log("No se encontró la película");
    }
  } catch (err) {
    console.log("Error al buscar la película: " + err);
  }
}

async function buscarPeliculaGenero(genero) {
  try {
    const consultaTodas = await conexion.get();
    if (consultaTodas.empty) {
      console.log("No se encontraron películas en la base de datos.");
      return [];
    }
    const movies = [];
    consultaTodas.forEach((pelicula) => {
      const movie = new Pelicula(pelicula.id, pelicula.data());
      if (movie.genero.includes(genero)) {
        movies.push(movie.obtenerDatos);
      }
    });
    return movies;
  } catch (err) {
    console.error("Error al buscar películas por género: " + err);
  }
}

async function nuevaPelicula(datos) {
    var movie = new Pelicula(null, datos);
    var error = 1;
    if (movie.bandera == 0) {
      try {
        await conexion.doc(movie.titulo).set(movie.obtenerDatos);
        console.log("Pelicula insertada a la base de datos");
        error = 0;
      } catch (err) {
        console.log("Error al capturar la pelicula nueva: " + err);
      }
    }
    return error;
  }

  
async function modificarPelicula(datos) {
  var error = 1;
  var respuestaBuscar = await buscarPelicula(datos.id);
  if (respuestaBuscar != "") {
      var pelicula = new Pelicula(datos.id, datos);
      if (pelicula.bandera == 0) {
          try {
              await conexion.doc(pelicula.id).set(pelicula.obtenerDatos);
              console.log("Película modificada");
              error = 0;
          } catch (err) {
              console.log("Error al modificar película: " + err);
          }
      }
  }
  return error;
}

async function borrarPelicula(id) {
  var error = 1;
  var pelicula = await buscarPelicula(id);
  if (pelicula != "") {
      try {
          await conexion.doc(id).delete();
          console.log("Película eliminada de la base de datos");
          error = 0;
      } catch (err) {
          console.log("Error al eliminar la película: " + err);
      }
  }
  return error;
}

module.exports = {
    mostrarPeliculas,
    buscarPelicula,
    nuevaPelicula,
    buscarPeliculaGenero,
    modificarPelicula,
    borrarPelicula
}