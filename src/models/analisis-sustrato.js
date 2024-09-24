mongoose
const mongoose = require('mongoose');

const analisisSustratoSchema = new mongoose.Schema({
  numero_muestras: { type: Number, default: 0 },
  ancho: { type: Number, default: 0 },
  largo: { type: Number, default: 0 },
  gramaje: {
    masa_inicial: [Number],
    masa_final: [Number],
    gramaje: [Number],
    promedio: { type: Number, default: 0 },
    desviacion: { type: Number, default: 0 },
    max: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
    decimales: { type: Number, default: 0 }
  },
  cobb: {
    top: {
      cobb: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    back: {
      cobb: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    }
  },
  calibre: {
    mm: {
      mm: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    um: {
      um: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    pt: {
      pt: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    }
  },
  curling_blancura: {
    curling: {
      curling: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    blancura: {
      blancura: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    }
  },
  dimensiones: {
    Escuadra: {
      escuadra: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    contraEscuadra: {
      contraEscuadra: [Number],
      max: { type: Number, default: 0 },
      min: { type: Number, default: 0 },
      promedio: { type: Number, default: 0 },
      desviacion: { type: Number, default: 0 },
      decimales: { type: Number, default: 0 }
    },
    Pinza: {
        pinza: [Number],
        max: { type: Number, default: 0 },
        min: { type: Number, default: 0 },
        promedio: { type: Number, default: 0 },
        desviacion: { type: Number, default: 0 },
        decimales: { type: Number, default: 0 }
      },
      contraPinza: {
        contraPinza: [Number],
        max: { type: Number, default: 0 },
        min: { type: Number, default: 0 },
        promedio: { type: Number, default: 0 },
        desviacion: { type: Number, default: 0 },
        decimales: { type: Number, default: 0 }
      }
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

module.exports = mongoose.model('AnalisisSustrato', analisisSustratoSchema);