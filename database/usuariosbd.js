var conexion = require("./conexion").conexion;
var Usuario = require("../models/Usuarios");
var crypto = require("crypto");
var { encriptarPassword } = require("../middlewares/funcionesSecurity");

async function buscarPorID(id) {
  var user = "";
  try {
    var usuario = await conexion.doc(id).get();
    var usuarioObjeto = new Usuario(usuario.id, usuario.data());
    if (usuarioObjeto.bandera == 0) {
      user = usuarioObjeto.obtenerDatos;
    }
  } catch (err) {
    console.log("Error al recuperar el usuario: " + err);
  }
  return user;
}

async function nuevoUsuario(datos) {
  var { hash, salt } = encriptarPassword(datos.password);
  datos.password = hash;
  datos.salt = salt;
  datos.admin = false;
  var user = new Usuario(null, datos);
  var error = 1;
  if (user.bandera == 0) {
    try {
      await conexion.doc().set(user.obtenerDatos);
      console.log("Usuario insertado a la base de datos");
      error = 0;
    } catch (err) {
      console.log("Error al capturar el nuevo usuario: " + err);
    }
  }
  return error;
}

async function modificarUsuario(datos) {
  var error = 1;
  var respuestaBuscar = await buscarPorID(datos.id);
  if (respuestaBuscar != "") {
    if (datos.password == "") {
      datos.password = datos.passwordViejo;
      datos.salt = datos.saltViejo;
    } else {
      var { salt, hash } = encriptarPassword(datos.password);
      datos.password = hash;
      datos.salt = salt;
    }
    var user = new Usuario(datos.id, datos);
    if (user.bandera == 0) {
      try {
        await conexion.doc(user.id).set(user.obtenerDatos);
        console.log("Modificado");
        error = 0;
      } catch (err) {
        console.log("Error al modificar usuario: " + err);
      }
    }
  }
  return error;
}

async function borrarUsuario(id) {
  var error = 1;
  var user = await buscarPorID(id);
  if (user != "") {
    try {
      await conexion.doc(id).delete();
      console.log("Usuario eliminado de la base de datos");
      error = 0;
    } catch (err) {
      console.log("Error al eliminar el usuario: " + err);
    }
  }
  return error;
}

async function buscarPorUsuario(usuario) {
  var user = "";
  try {
    var usuarios = await conexion.where("usuario", "==", usuario).get();
    usuarios.forEach((usuario) => {
      var usuarioObjeto = new Usuario(usuario.id, usuario.data());
      if (usuarioObjeto.bandera == 0) {
        user = usuarioObjeto.obtenerDatos;
      }
    });
  } catch (err) {
    console.log("Error al recuperar el usuario: " + err);
  }
  return user;
}



module.exports = {
  buscarPorID,
  modificarUsuario,
  borrarUsuario,
  nuevoUsuario,
  buscarPorUsuario,
};
