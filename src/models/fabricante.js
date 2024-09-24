const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let FabricanteSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    proveedor:{
        type:Boolean,
        default:false
    },
    nombre:{
        type:String,
        required:true
    },
    alias:{
        type:String,
        required:true
    },
    origenes:[{
        pais:{type:String},
        estado:{type:String}
    }],
    grupo:[{
        type:Schema.Types.ObjectId,
        ref: 'grupo'
    }],

}],{
    timestamps:true
  })

module.exports = mongoose.model('fabricante', FabricanteSchema)