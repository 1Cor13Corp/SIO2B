// Importa mongoose
const mongoose = require('mongoose');

const gestionSchema = new mongoose.Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    orden:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'op', // Relación con otra colección llamada "Producto"
    },
    fase:{
        type:Number
    },
    usuario:{
        type:String,
    },
    fecha:{
        type:String,
    },
    inicio:{
        type:String,
    },
    fin:{
        type:String,
    },
    hojas:{
        type:Number,
    },
    productos:{
        type:Number,
    },
    paletas:{
        type:Number,
    },
    team:{
        type:String,
    },
    defectos:[{
        paleta:{type:Number},
        defectos:{type:Array}
    }],
    observaciones:{
        type:String,
    },
},{
    timestamps:true
})

module.exports = mongoose.model('gestion', gestionSchema)