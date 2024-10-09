const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ReclamoSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    status:{
        type:String
    },
    observacion:{
        type:String,
    },
    numero:{
        type:String
    },
    recepcion:{
        type:Schema.Types.ObjectId,
        ref: 'recepcion'
    },
    index_producto:{
        type:Number
    },
    plan:{
        type:String
    }
}],{
    timestamps:true
})

// Middleware para incrementar el número de reclamo automáticamente
ReclamoSchema.pre('save', async function (next) {
    if (!this.isNew) {
        return next();
    }

    // Encuentra el reclamo con el mayor número
    const lastReclamo = await mongoose.model('reclamos').findOne().sort({ numero: -1 }).exec();

    let nextNumero = 1;
    
    // Si hay algún reclamo, se obtiene el número más alto y se le suma 1
    if (lastReclamo && lastReclamo.numero) {
        nextNumero = parseInt(lastReclamo.numero, 10) + 1;
    }

    // Formateamos el número a 4 dígitos
    this.numero = nextNumero.toString().padStart(4, '0');

    next();
});


module.exports = mongoose.model('reclamos', ReclamoSchema)