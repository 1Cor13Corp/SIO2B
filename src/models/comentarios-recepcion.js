import {Schema, model} from 'mongoose';

const ComentariosRecepcionSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    usuario:{
        type:String,
        required:true
    },
    mensaje:{
        type:String,
        required:true
    },
    recepcion:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default model('ComentariosRecepcion', ComentariosRecepcionSchema)
