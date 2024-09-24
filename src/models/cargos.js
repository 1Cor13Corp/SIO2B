import {Schema, model} from 'mongoose';

const cargoSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre  :{
        type:String,
        require:true
    },
    funcion:{
        type:String,
        require:true
    }
},{
    timestamps:true
})

export default model('cargo', cargoSchema)