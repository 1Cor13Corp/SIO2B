const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const analisisOtrosSchema = new Schema({
    apariencias:{type:Boolean, default:false},
    ph:{type:String, default:''},
    otro:{type:String, default: ''},
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

module.exports = mongoose.model('AnalisisOtros', analisisOtrosSchema);