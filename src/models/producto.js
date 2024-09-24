const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let ProductoSchema = new Schema([{
    borrado:{
        type:Boolean,
        default:false,
    },
    identificacion: {
        cliente: { type:Schema.Types.ObjectId,ref: 'cliente' },
        categoria: { type:Schema.Types.ObjectId,ref: 'categoria' },
        producto: { type: String },
        codigo: { type: String },
        version: { type: String }
    },
    dimensiones: {
        desplegado: {
            ancho: { type: String },
            largo: { type: String },
            tolerancia: { type: String }
        },
        cerrado: {
            ancho: { type: String },
            largo: { type: String },
            alto: { type: String },
            tolerancia: { type: String }
        },
        diseno:{type: String}
    },
    materia_prima: {
        sustrato: { type: [{ type: Schema.Types.ObjectId, ref: 'material' }] },
        tintas: [{ tinta: {type:Schema.Types.ObjectId,ref: 'material' }, cantidad: String }],
        barnices: [{ barniz: {type:Schema.Types.ObjectId,ref: 'material' }, cantidad: String }]
    },
    pre_impresion: {
        diseno: { type: String },
        montajes: { type: String },
        nombre_montajes: { type: [String] },
        tamano_sustrato: {
            montajes: [{ ancho: String, largo: String, ejemplares: String }],
            margenes: [{ inferior: String, superior: String, izquierdo: String, derecho: String }]
        },
        plancha: {
            tipo: { type: String },
            marca: { type: String },
            tiempo_exposicion: { type: String }
        }
    },
    impresion: {
        impresoras: { type: [{ type: Schema.Types.ObjectId, ref: 'maquina' }] },
        secuencia: { type: [[String]] },
        pinzas: { type: [[String]] },
        fuentes: { type: [{ type: Schema.Types.ObjectId, ref: 'material' }] }
    },
    post_impresion: {
        troqueladora: { type: [{ type: Schema.Types.ObjectId, ref: 'maquina' }] },
        henidura: {
            alto: { type: String },
            ancho: { type: String }
        },
        guillotina: { type: [{ type: Schema.Types.ObjectId, ref: 'maquina' }] },
        pegadora: { type: [{ type: Schema.Types.ObjectId, ref: 'maquina' }] },
        pegamento: [{ pega: { type: Schema.Types.ObjectId, ref: 'material' }, cantidad: String }],
        caja: {
            nombre: { type: String },
            cabida: { type: [String] }
        },
        distribucion:{
            aerea:{ type: String },
            v3d:{ type: String },
            peso_cajas:{ type: String },
            estibas:{ type: String },
            paletizado:{ type: String }
        }
    }
}],{
    timestamps:true
  })

  module.exports = mongoose.model('producto', ProductoSchema)
