var crypto = require("crypto");

function encriptarPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var hash = crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { salt, hash }

}

function validarPassword(password, hash, salt) {
    var hashEvaluar = crypto.scryptSync(password, salt, 100000, 64, 'sha512').toString('hex');
    return hashEvaluar == hash;
}

function autorizado(req, res, cb) {
    if (req.session.usuario || req.session.admin) cb();
    else res.redirect("/loginUser");
}

function adminAutorizado(req, res, cb) {
    if (req.session.admin) cb();
    else res.redirect("/loginUser");
}



module.exports = {
    encriptarPassword,
    validarPassword,
    autorizado,
    adminAutorizado,
}