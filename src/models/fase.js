import {Schema, model} from 'mongoose';

const faseSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    },
    descripcion:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default model('fase', faseSchema)