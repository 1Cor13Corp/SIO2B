const mongoose = require('mongoose');

// Esquema para un día específico
const DiaSchema = new mongoose.Schema({
  month: {
    type: Number,
    required: true
  },
  day: {
    type: Number,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  motivo: {
    type: String,
    default: null
  },
  laboral: {
    type: Boolean,
    default: true  // Por defecto, asumimos que el día es laboral
  }
});

// Esquema para el calendario completo
const CalendarioSchema = new mongoose.Schema({
  year: {
    type: Number,
    required: true
  },
  dias: [DiaSchema],  // Un calendario contiene múltiples días
  borrado: {
    type: Boolean,
    default: false
  }
});

// Crear el modelo de Mongoose
const Calendario = mongoose.model('Calendario', CalendarioSchema);

module.exports = Calendario;
