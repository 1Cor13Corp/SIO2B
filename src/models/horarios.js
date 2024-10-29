import {Schema, model} from 'mongoose';

const HorarioSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String
    },
    de:{
        type:String
    },
    a:{
        type:String
    },
    inicio:{
        type:String
    },
    fin:{
        type:String
    },
    default:{
        type:Boolean,
        default:false
    }
},{
    timestamps:true
})

export default model('horario', HorarioSchema)