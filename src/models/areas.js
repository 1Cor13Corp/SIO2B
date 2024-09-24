import {Schema, model} from 'mongoose';

const areaSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre  :{
        type:String,
        require:true
    },
    departamento:{
        type:String,
        require:true
    },
    sup : {
        type:String,
        require:true
      }
},{
    timestamps:true
})

export default model('areas', areaSchema)