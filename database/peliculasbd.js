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
    // console.log(movies);
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

module.exports = {
    mostrarPeliculas,
    buscarPelicula,
    nuevaPelicula,
    buscarPeliculaGenero,
}