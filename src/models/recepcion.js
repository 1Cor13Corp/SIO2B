const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let RecepcionSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    status:{
        type:String,
        default:'Por notificar'
    },
    OC:{
        type:String,
        default:'DEPRECATED'
    },
    cantidad:[{
        type:String,
        required:[true, 'Debe indicar una cantidad total recepcionada']
    }],
    documento:{
        type:String,
        required:[true, 'Debes ingresar un documento']
    },
    control:{
        type:String,
        required:[true, 'Debes ingresar un numero de control']
    },
    precio:{
        type:String,
        required:[true, 'Debes ingresar un numero de control']
    },
    fabricacion:[{
        type:String,
    }],
    materiales:[[{
        analisis:{type:String},
        codigo:{type:Number},
        presentacion:{type:String},
        neto:{type:String},
        lote:{type:String},
        unidad:{type:String},
        fabricacion:{type:String},
        ancho:{type:Number},
        largo:{type:Number},
        material:{
            type:Schema.Types.ObjectId,
            ref: 'material'
        },
        oc:{
            type:Schema.Types.ObjectId,
            ref: 'ordenPoligrafica'
        }
    }]],
    proveedor:{
        type:Schema.Types.ObjectId,
        ref: 'proveedor'
    },
    f_fabricacion:{
        type:String
    },
    recepcion:{
        type:String,
        required:[true, 'Debes indicar una recepción']
    },
    transportista:{
        type:String,
        required:[true, 'Debes ingresar un transportista']
    },
    condicion:[{
        Certificado_de_calidad:{type:Boolean},
        Identificacion_del_lote:{type:Boolean},
        Cajas_en_buen_estado:{type:Boolean},
        Cajas_limpias:{type:Boolean},
        Envases_cerrado_hermeticamente:{type:Boolean}
    }],

}],{
    timestamps:true
  })

module.exports = mongoose.model('recepcion', RecepcionSchema)