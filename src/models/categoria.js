import {Schema, model} from 'mongoose';

const categoriaSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    }
},{
    timestamps:true
})

export default model('categoria', categoriaSchema);