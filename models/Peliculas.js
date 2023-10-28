class Pelicula {
  constructor(id, data) {
    this.bandera = 0;
    this.id = id;
    this.titulo = data.titulo;
    this.director = data.director;
    this.anyo = data.anyo;
    this.genero = Array.isArray(data.genero) ? data.genero : [];
    this.rating = data.rating;
    this.sinopsis = data.sinopsis;
    this.foto = data.foto;
    this.trailer = data.trailer;
    this.plataforma = Array.isArray(data.plataforma) ? data.plataforma : [];
  }

  set id(id) {
    if (id != null) id.length > 0 ? (this._id = id) : (this.bandera = 1);
  }
  set titulo(titulo) {
    titulo.length > 0 ? (this._titulo = titulo) : (this.bandera = 1);
  }
  set director(director) {
    director.length > 0 ? (this._director = director) : (this.bandera = 1);
  }
  set anyo(anyo) {
    anyo.length >= 0 ? (this._anyo = anyo) : (this.bandera = 1);
  }
  set genero(genero) {
    this._genero = Array.isArray(genero) ? genero : [];
  }
  set rating(rating) {
    rating.length > 0 ? (this._rating = rating) : (this.bandera = 1);
  }
  set sinopsis(sinopsis) {
    sinopsis.length > 0 ? (this._sinopsis = sinopsis) : (this.bandera = 1);
  }
  set foto(foto) {
    foto.length > 0 ? (this._foto = foto) : (this.bandera = 1);
  }
  set trailer(trailer) {
    trailer.length > 0 ? (this._trailer = trailer) : (this.bandera = 1);
  }
  set plataforma(plataforma){
    this._plataforma = Array.isArray(plataforma) ? plataforma : [];
  }
  get id() {
    return this._id;
  }
  get titulo() {
    return this._titulo;
  }
  get director() {
    return this._director;
  }
  get anyo() {
    return this._anyo;
  }
  get genero() {
    return this._genero;
  }
  get rating() {
    return this._rating;
  }
  get sinopsis() {
    return this._sinopsis;
  }
  get foto() {
    return this._foto;
  }
  get trailer() {
    return this._trailer;
  }
  get plataforma(){
    return this._plataforma;
  }
  get obtenerDatos() {
    if (this._id != null) {
      return {
        id: this.id,
        titulo: this.titulo,
        director: this.director,
        anyo: this.anyo,
        genero: this.genero,
        rating: this.rating,
        sinopsis: this.sinopsis,
        foto: this.foto,
        trailer: this.trailer,
        plataforma: this.plataforma,
      };
    } else {
      return {
        titulo: this.titulo,
        director: this.director,
        anyo: this.anyo,
        genero: this.genero,
        rating: this.rating,
        sinopsis: this.sinopsis,
        foto: this.foto,
        trailer: this.trailer,
        plataforma: this.plataforma,
      };
    }
  }
}

module.exports = Pelicula;

