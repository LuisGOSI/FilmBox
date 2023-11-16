var express = require("express");
var path = require("path");
var session = require("cookie-session")
var rutas = require("./routes/usuariosRutas");
var rutaAd = require("./routes/adminsRutas");

var app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(session({
  name:'session',
  keys:['askfhvakjrhsfiuvabñoweucbÑSID'],
  maxAge: 24 * 60 * 60 * 1000
}));
app.use("/", express.static(path.join(__dirname, "/web")));
app.use("/", rutas);
app.use("/", rutaAd);

var port = process.env.port || 3000;

app.listen(port, () => {
  console.log("Servidor en http://localhost:" + port);
});
