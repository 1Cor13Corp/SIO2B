import {Schema, model} from 'mongoose';

const grupoSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    },
    parcial:{
        type:Boolean,
        required:true
    },
    icono:{
        type:String,
    },
    trato:{
        type:Boolean,
        default:false
    },
    otro:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export default model('grupo', grupoSchema)