const mongoose = require('mongoose');

let Schema = mongoose.Schema;

let TrabajadorSchema = new Schema([{
  
  borrado:{
    type:Boolean,
    default:false,
  },
  datos_personales: {
    apellidos: { type: String, },
    nombres: { type: String, },
    cedula: { type: String, },
    fecha_nac: { type: Date, },
    altura: { type: String, },
    peso: { type: String, },
    sexo: { type: String, },
    nacimiento: { type: String, },
    nacionalidad: { type: String, },
    estado_civil: { type: String, },
    licencia: { type: String, },
    grado: { type: String, },
    rif: { type: String, },
    email: { type: String, },
    estado: { type: String, },
    municipio: { type: String, },
    parroquia: { type: String, },
    sector: { type: String, },
    domicilio: { type: String, },
    telefono: { type: String, },
    celular: { type: String, },
    foto: {type: String, default:'no-image' }
  },
  informacion_adicional: {
    referencias: [{
      nombre:{type:String},
      direccion:{type:String},
      telefono:{type:String},
      ocupacion:{type:String}
    }],
    carga_familiar: [{
      parentesco:{type:String},
      nombre:{type:String},
      fecha:{type:String}
    }],
    emergencia: [{
      parentesco:{type:String},
      nombre:{type:String},
      direccion:{type:String},
      telefono:{type:String}
    }]
  },
  instruccion_academica: {
    grado: {
      instruccion: { type: String, },
      ano: { type: String, },
      titulo: { type: String, }
    },
    cursos: [{
      nombre: { type: String, },
      periodo: { type: String, }
    }],
    idiomas: {
      idiomas: [{ 
        idioma: {type:String},
        nivel: {type:String}
       }]
    }
  },
  manejo_herramientas: {
    computadora: { type: String, },
    otros: [{ type: String }],
    referencias: [{
      empresa: {type:String},
      periodo: {type:String},
      cargo: {type:String},
      remuneracion: {type:String},
      motivo: {type:String}
    }]
  },
  contratacion: {
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
    sueldo: { type: String, }
  }
}],{
  timestamps:true
})

module.exports = mongoose.model('trabajador', TrabajadorSchema)
