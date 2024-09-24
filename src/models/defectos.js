import {Schema, model} from 'mongoose';

const defectosSchema = new Schema({
    borrado:{
        type:Boolean,
        default:false,
    },
    cliente  :{
        type:Schema.Types.ObjectId,
        ref: 'cliente'
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref: 'categoria'
    },
    defectos : {
        menores : {
          defectos : {type:Array},
          aql      : {type:Number}
        },
        mayores : {
          defectos : {type:Array},
          aql      : {type:Number}
        },
        criticos: {
          defectos : {type:Array},
          aql      : {type:Number}
        }
      }
},{
    timestamps:true
})

export default model('defecto', defectosSchema)