var admin=require("firebase-admin");
var keys=require("../filmbox-keys.json");

admin.initializeApp({
    credential:admin.credential.cert(keys)
});

var  micuenta=admin.firestore();
var conexion=micuenta.collection("Usuarios");
var conexionPelis=micuenta.collection("Peliculas")

module.exports={
    conexion,
    conexionPelis,
};