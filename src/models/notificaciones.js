const mongoose = require('mongoose');

const NotificacionSchema = new mongoose.Schema({
  titulo:String,
  mensaje: String,
  devolucion:String,
  fecha: { type: Date, default: Date.now },
  usuarios_vistos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }]
});

module.exports = mongoose.model('Notificacion', NotificacionSchema);