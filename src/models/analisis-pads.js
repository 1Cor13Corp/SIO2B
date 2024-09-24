const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analisisPadsSchema = new Schema({
    muestras: { type: Number, default: 0 },
    largo: {
      largo: { type: [Number], default: [] },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    ancho: {
      ancho: { type: [Number], default: [] },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    signado: {
      signado: { type: [Number], default: [] },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    espesor: {
      espesor: { type: [Number], default: [] },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    resultado: {
      observacion: { type: String, default: '' },
      resultado: { type: String, default: '' },
      guardado: {
        usuario: { type: String, default: '' },
        fecha: { type: String, default: '' }
      },
      validado: {
        usuario: { type: String, default: '' },
        fecha: { type: String, default: '' }
      }
    }
  },{
    timestamps:true
  });

module.exports = mongoose.model('AnalisisPads', analisisPadsSchema);