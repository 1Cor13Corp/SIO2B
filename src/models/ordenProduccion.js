const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let CounterSchema = new mongoose.Schema({
    year: { type: Number, required: true },
    seq: { type: Number, default: 1 },
  });

  const OpCounter = mongoose.model('OpCounter', CounterSchema);

let OPSchema = new Schema([{
    numero_op: { type: String, unique: true },
    borrado:{
        type:Boolean,
        default:false,
    },
    status:{
        type:String,
        default: 'Por asignar'
    },
    cliente:{
        type:Schema.Types.ObjectId,
        ref: 'cliente'
    },
    oc:{
        type:Schema.Types.ObjectId,
        ref: 'ocompra'
    },
    solicitud:{
        type:String,
        require:true
    },
    montaje:{
        type:Number,
        require:true
    },
    ejemplares:{
        type:Number,
        require:true,
    },
    cantidad:{
        type:Number,
        requiere:true
    },
    demasia:{
        type:Number,
        require:true
    },
    sustrato:{
        sustrato:{type:Schema.Types.ObjectId, ref:'material'},
        cantidad:{type:Number}
    },
    tinta:[{
        tinta:{type:Schema.Types.ObjectId, ref:'material'},
        cantidad:{type:Number}
    }],
    barniz:{
        barniz:{type:Schema.Types.ObjectId, ref:'material'},
        cantidad:{type:Number}
    },
    pega:{
        pega:{type:Schema.Types.ObjectId, ref:'material'},
        cantidad:{type:Number}
    },
    producto:{
        type:Array,
        requiere:true
    },
    hojas:{
        type:Number,
        require:true
    },
    fases:[{
        maquina:{type:Schema.Types.ObjectId, ref:'maquina'},
        fases:{type:Array}
    }]

}],{
    timestamps:true
  });

// Middleware `pre` para generar `numero_op` antes de guardar
OPSchema.pre('save', async function (next) {
    const currentYear = new Date().getFullYear();
    const op = this;
  
    if (!op.numero_op) {
      try {
        // Encuentra o crea un documento para el año actual
        const counter = await OpCounter.findOneAndUpdate(
          { year: currentYear },
          { $inc: { seq: 1 } },
          { new: true, upsert: true }
        );
  
        // Genera el `numero_op` en formato `año_actualX` donde X es un número de 3 dígitos
        const paddedSeq = String(counter.seq).padStart(3, '0'); // Asegura que la secuencia tenga 3 dígitos
        op.numero_op = `${currentYear}${paddedSeq}`;
        next();
      } catch (error) {
        next(error);
      }
    } else {
      next();
    }
  });

module.exports = mongoose.model('op', OPSchema)