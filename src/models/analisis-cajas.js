const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analisisCajasSchema = new Schema({
  muestras:{ type: Number},
  longitud_interna: {
    largo: {
      largo: [Number],
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    ancho: {
      ancho: [Number],
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    alto: {
      alto: [Number],
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    }
  },
  longitud_externa: {
    largo: {
      largo: [Number],
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    ancho: {
      ancho: [Number],
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    alto: {
      alto: [Number],
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    }
  },
  espesor: {
    espesor: [Number],
    min: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    promedio: { type: Number, default: 0 },
    desviacion: { type: Number, default: 0 },
    decimales: { type: Number, default: 0 }
  },
  resultado:{
    estandar:String,
    resultado:String,
    observacion:String,
    guardado:{
      usuario:String,
      fecha:String
    },
    validado:{
      usuario:String,
      fecha:String
    }
  }
},{
  timestamps:true
});

module.exports = mongoose.model('AnalisisCajas', analisisCajasSchema);