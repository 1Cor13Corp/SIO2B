const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RequisicionSchema = new Schema([{
        status:{
            type:String,
            default:'Por Aceptar',
        },
        materiales:[{
            material:{
                type:Schema.Types.ObjectId,
                ref: 'material'
            },
            cantidad:{
                type:Number,
            }
        }],
        motivo:{
            type:String
        },
        tag:{
            type:String
        },
        material:{
            type:Schema.Types.ObjectId,
            ref: 'material'
        },
        cantidad:{
            type:Number
        },
        analisis:{
            type:Schema.Types.ObjectId,
            ref: 'AnalisisTinta'
        }
}],{
    timestamps:true
});

module.exports = mongoose.model('requisiciones', RequisicionSchema)