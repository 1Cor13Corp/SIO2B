import {Schema, model} from 'mongoose';

const formulaSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    pantone:{
        type:String,
        required:true
    },
    formula:[{
        material:{type:Schema.Types.ObjectId,ref: 'material'},
        cantidad:{type:String}
    }]
},{
    timestamps:true
})

export default model('formula', formulaSchema)