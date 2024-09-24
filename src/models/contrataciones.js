// contratacion:{
//     fecha:'',
//     departamento:'',
//     cargo:'',
//     de:'',
//     sueldo:''
//   }

const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ContratacionSchema = new Schema([{
        fecha: { type: Date, },
        departamento: { 
          type:Schema.Types.ObjectId,
          ref: 'departamento' 
        },
        cargo: { 
          type:Schema.Types.ObjectId,
          ref: 'cargo' 
        },
        de: { 
          type:Schema.Types.ObjectId,
           ref: 'areas'
         },
        sueldo: { type: String, },
        trabajador: {
           type:Schema.Types.ObjectId,
           ref: 'trabajador'
        }
}],{
    timestamps:true
  })
  
module.exports = mongoose.model('Contratacion', ContratacionSchema)