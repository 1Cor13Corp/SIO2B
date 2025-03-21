const mongoose = require('mongoose');

const asignacionSchema = new mongoose.Schema({
  op: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'op',
    required: true
  },
  material: [{
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
    required: true
  },
  borrado: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

asignacionSchema.pre('validate', async function(next) {
  if (!this.numero) {
    const yearPrefix = new Date().getFullYear().toString().slice(-2);
    const lastAsignacion = await this.constructor.findOne({}, {}, { sort: { createdAt: -1 } });
    let nextCounter = 1;
    
    if (lastAsignacion) {
      const lastNumber = parseInt(lastAsignacion.numero.split('-')[1], 10);
      nextCounter = lastNumber + 1;
    }
    
    this.numero = `${yearPrefix}-${String(nextCounter).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Asignacion', asignacionSchema);