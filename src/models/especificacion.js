const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let EspecificacionSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    viscosidad:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      rigidez:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      tack:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      finura:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      secado:{
        min:{type:Number},
        max:{type:Number},
        con:{type:String}
      },
      gramaje: {
        min: {type:Number},
        nom: {type:Number},
        max: {type:Number},
      },
      calibre: {
        pt: {
          min: {type:Number},
          nom: {type:Number},
          max: {type:Number},
        },
        um: {
          min: {type:Number},
          nom: {type:Number},
          max: {type:Number},
        },
        mm: {
          min: {type:Number},
          nom: {type:Number},
          max: {type:Number},
        },
      },
      cobb: {
        top: {
          min: {type:Number},
          nom: {type:Number},
          max: {type:Number},
        },
        back: {
          min: {type:Number},
          nom: {type:Number},
          max: {type:Number},
        },
      },
      curling: {
        min: {type:Number},
        nom: {type:Number},
        max: {type:Number},
      },
      blancura: {
        min: {type:Number},
        nom: {type:Number},
        max: {type:Number},
      },
}],{
  timestamps:true
})

module.exports = mongoose.model('especificacion', EspecificacionSchema)