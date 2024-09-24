const mongoose = require('mongoose');

let Schema = mongoose.Schema;

const usuarioSchema = new Schema([{
    Nombre: {
      type: String,
      required: true,
    },
    Apellido: {
      type: String,
      required: true,
    },
    Correo: {
      type: String,
      required: true,
      unique: true,
    },
    Password: {
      type: String,
      required: true,
    },
    Role: {
      type: String,
      enum: ['admin', 'user'], // Puedes ajustar los roles según tus necesidades
      default: 'user',
    },
    Departamento: {
      type: String
    },
  }]);

module.exports = mongoose.model('Usuario', usuarioSchema)
