import {Schema, model} from 'mongoose';

const departamentoSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre  :{
        type:String,
        require:true
    },
    superior:{
        type:String,
        require:true
    },
    color : {
        type:String,
        require:true
      }
},{
    timestamps:true
})

export default model('departamento', departamentoSchema)