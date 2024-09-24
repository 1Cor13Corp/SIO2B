const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProveedorSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    },
    direccion:{
        type:String,
        required:true
    },
    rif:{
        type:String,
        required:true
    },
    contactos:{
        type:Array,
        required:true
    },
    fabricantes:[{
        type:Schema.Types.ObjectId,
        ref: 'fabricante'
    }]

}],{
    timestamps:true
  })

module.exports = mongoose.model('proveedor', ProveedorSchema)