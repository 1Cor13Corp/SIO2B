import {Schema, model} from 'mongoose';

const ClienteSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    nombre:{
        type:String,
        required:true
    },
    rif:{
        type:String,
        required:true
    },
    codigo:{
        type:String,
        required:true
    },
    direccion:{
        type:String,
        required:true
    },
    contactos:[{
        nombre:{type:String, required:true},
        titulo:{type:String, required:true},
        correo:{type:String, required:true},
        telefono:{type:String, required:true},
        cargo:{type:String, required:true}
    }],
    almacenes:[
        {
            nombre:{type:String, required:true}
        }
    ]
},{
    timestamps:true
})

export default model('cliente', ClienteSchema)