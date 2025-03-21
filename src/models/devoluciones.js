const mongoose = require('mongoose');

const devolucionSchema = new mongoose.Schema({
  op: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'op',
    required: true
  },
  material: [{
    asignacion:{
        type:String
    },
    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'almacen',
      required: true
    },
    cantidad: {
      type: Number,
      required: true
    }
  }],
  numero: {
    type: String,
    unique: true,
  },
  status:{
    type:String,
    default:'Por Confirmar'
  },
  borrado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model('devolucion', devolucionSchema);