import {Schema, model} from 'mongoose';

const MaquinaSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    },
    marca:{
        type:String,
        required:true
    },
    modelo:{
        type:String,
        required:true
    },
    serial:{
        type:String,
        required:true
    },
    ano:{
        type:Number,
        required:true
    },
    fases:[{
        type:Schema.Types.ObjectId,
        ref: 'fase'
    }],
    trabajo:{
        type:Number,
        required:true
    },
    pinzas:{
        type:Array,
    },
    colores:{
        type:Number,
    },
},{
    timestamps:true
})

export default model('maquina', MaquinaSchema)