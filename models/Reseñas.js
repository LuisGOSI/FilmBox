class Reseña {
    constructor(id, data) {
        this.bandera = 0;
        this.id = id;
        this.usuario = data.usuario;
        this.resenya = data.resenya;
        this.pelicula = data.pelicula;
    }

    set id(id) {
        if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);
    }
    set usuario(usuario) {
        usuario.length > 0 ? (this._usuario = usuario) : (this.bandera = 1);
    }
    set resenya(resenya) {
        resenya.length > 0 ? (this._resenya = resenya) : (this.bandera = 1);
    }
    set pelicula(pelicula) {
        pelicula.length > 0 ? (this._pelicula = pelicula) : (this.bandera = 1);
    }
    get id() {
        return this._id;
    }
    get usuario() {
        return this._usuario;
    }
    get resenya() {
        return this._resenya;
    }
    get pelicula() {
        return this._pelicula;
    }
    get obtenerDatos() {
        if (this._id != null) {
            return {
                id: this.id,
                usuario: this.usuario,
                resenya: this.resenya,
                pelicula: this.pelicula,
            };
        } else {
            return {
                usuario: this.usuario,
                resenya: this.resenya,
                pelicula: this.pelicula,
            };
        }
    }
}

module.exports = Reseña;
