import Material from "../src/models/material"
import especificacion from "../src/models/especificacion"
import prueba from "../src/models/analisis"

module.exports = (io) => {
  io.on('connection', (socket) => {
    const emitirEspecificaciones = async () => {
      try {
        const Especificaciones = await especificacion.find({ borrado: false }).exec()
        io.emit('SERVER:Especificaciones', Especificaciones)
        const Prueba = await prueba.find({ borrado: false }).exec()
        io.emit('SERVER:Especificaciones_', Prueba)
      } catch (error) {
        console.error('Error al buscar especificaciones:', error)
      }
    }

    socket.on('CLIENTE:BuscarEspecificaciones', async () => {
      try {
        await emitirEspecificaciones()
      } catch (err) {
        console.error('No se pudo realizar la busqueda de las especificaciones', err)
      }
    })

    //Nueva especificacion
    socket.on('CLIENTE:nuevaEspecificacion', async (data) => {
      try {
        const nuevaEspecificacion = await especificacion.create(data.especificacion);
        console.log('Se creo una nueva especificacion');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó una nueva especifiación', icon: 'success' });
        const Mat = await Material.findByIdAndUpdate(data.material, { especificacion: nuevaEspecificacion._id })
        console.log('Se actualizo el material')
        const materials = await Material.find({ borrado: false })
        .populate('fabricante')
        .populate('especificacion')
        .populate('especificacion2')
        .populate('grupo');
        socket.emit('SERVER:Materiales', materials);
      } catch (err) {
        console.error('Ha ocurrido un error en la creacion de la especificacion', err);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error en la creacion de la especificación', icon: 'error' });
      }
      await emitirEspecificaciones()
    })
    //Edicion de especificacion
    socket.on('CLIENTE:EdicionEspecificacion', async (data) => {
      try {
        await especificacion.findByIdAndUpdate(data._id, data);
        console.log('Se edito la especificacion');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se ha editado la especificación', icon: 'success' });
      
      } catch (err) {
        console.error('Ha ocurrido un error en la edicion de la especificacion', err)
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error en la edicion de la especificacion', icon: 'error' });
      }
      await emitirEspecificaciones()
    })
    //Nueva especificacion
    socket.on('CLIENTE:nuevaEspecificacion2', async (data) => {
      try {
        let nuevaEspecificacion;
        console.log(data)
        if (data.especificacion._id) {
          // Si existe _id en data, actualizar el registro existente
          nuevaEspecificacion = await prueba.findByIdAndUpdate(data.especificacion._id, { especificacion: data.especificacion }, { new: true });
          console.log('Se actualizó la especificación existente');
        } else {
          // Si no existe _id en data, crear un nuevo registro
          const especificacion = data.especificacion;
          nuevaEspecificacion = new prueba({ especificacion });
          await nuevaEspecificacion.save();
          console.log('Se creó una nueva especificación');
        }
    
        console.log(nuevaEspecificacion, '<<<<<<<<<<<<<<<<<<<')
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: data._id ? 'Se ha actualizado la especificación' : 'Se ha creado la especificación', icon: 'success' });
    
        const Mat = await Material.findByIdAndUpdate(data.material, { especificacion2: nuevaEspecificacion._id });
        console.log('Se actualizó el material');
        
        const materials = await Material.find({ borrado: false })
          .populate('fabricante')
          .populate('especificacion')
          .populate('especificacion2')
          .populate('grupo');
          
        socket.emit('SERVER:Materiales', materials);
      } catch (err) {
        console.error('Ha ocurrido un error en la creación/edición de la especificación', err);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error en la creación/edición de la especificación', icon: 'error' });
      }
      
      await emitirEspecificaciones();
    });
  })
}
