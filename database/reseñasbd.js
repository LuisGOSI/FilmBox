var conexion = require("./conexion").conexionReseñas;
var Reseña = require("../models/Reseñas");

async function nuevaReseña(datos) {
    var review = new Reseña(null, datos);
    var error = 1;
    if (review.bandera == 0) {
        try {
            await conexion.doc().set(review.obtenerDatos);
            console.log("Reseña insertada a la base de datos");
            error = 0;
        } catch (err) {
            console.log("Error al capturar la reseña nueva: " + err);
        }
    }
    return error;
}

async function mostrarReseñasPorId(idPeli) {
    var reviews = [];
    try {
        var reseñas = await conexion.where("pelicula", "==", idPeli).get();
        reseñas.forEach((reseña) => {
            var review = new Reseña(reseña.id, reseña.data());
            if (review.bandera == 0) {
                reviews.push(review.obtenerDatos);
            }
        });
    } catch (err) {
        console.log("Error al recuperar reseñas de la base de datos: " + err);
    }
    return reviews;
}

async function mostrarReseñas() {
    var reviews = [];
    try {
        var reseñas = await conexion.get();
        reseñas.forEach((reseña) => {
            var review = new Reseña(reseña.id, reseña.data());
            if (review.bandera == 0) {
                reviews.push(review.obtenerDatos);
            }
        });
    } catch (err) {
        console.log("Error al recuperar las reseñas de la base de datos: ") + err;
    }
    return reviews;
}

module.exports = {
    nuevaReseña,
    mostrarReseñasPorId,
    mostrarReseñas
};
