import {Schema, model} from 'mongoose';


const historialCambiosSchema = new Schema({
    producto: { type: Schema.Types.ObjectId, ref: 'Producto', required: true },
    fechaCambio: { type: Date, default: Date.now },
    cambios: { type: Map, of: String } // Guardar los cambios como pares clave-valor
});

export default model('HistorialCambios', historialCambiosSchema);