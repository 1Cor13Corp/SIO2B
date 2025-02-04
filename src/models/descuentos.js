// Importa mongoose
const mongoose = require('mongoose');

// Define el esquema
const registroSchema = new mongoose.Schema({
  entrada: {
    type: Number,
    required: true,
    default: 0
  },
  fecha: {
    type: String,
    required: true
  },
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'almacen', // Relación con otra colección llamada "Producto"
    required: true
  },
  restante: {
    type: Number,
    required: true,
    default: 0
  },
  salida: {
    type: Number,
    required: true
  },
  usuario: {
    type: String,
    required: true
  },
  material:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'material', // Relación con otra colección llamada "Producto"
    required: true
  },
  borrado: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true // Agrega campos createdAt y updatedAt automáticamente
});

// Crea y exporta el modelo
module.exports = mongoose.model('Registro', registroSchema);