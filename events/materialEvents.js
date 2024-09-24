import Material from '../src/models/material';
import Recepcion from '../src/models/recepcion'

module.exports = (io) => {
  io.on('connection', (socket) => {

    // *******************
    // * BUSCAR MATERIAL *
    // *******************
    const EmitirMateriales = async () => {
      try {
        const materials = await Material.find({ borrado: false })
                                        .populate('fabricante')
                                        .populate('especificacion')
                                        .populate('especificacion2')
                                        .populate('grupo');
        io.emit('SERVER:Materiales', materials);
      } catch (error) {
        console.error('Error occurred while fetching materials:', error);
      }
    };

    socket.on('CLIENTE:BuscarMaterial', async () => {
      await EmitirMateriales();
    });

    // ******************
    // * NUEVO MATERIAL *
    // ******************
    // este código escucha el evento 'CLIENTE:NuevoMaterial' en un socket. 
    // Cuando se activa este evento, crea un nuevo objeto Material con los datos recibidos, 
    // lo guarda en la base de datos y luego emite una actualización de materiales.
    socket.on('CLIENTE:NuevoMaterial', async (data) => {
      const NuevoMaterial = new Material(data);
      const NuevoMaterial_ = await NuevoMaterial.save()
        .then((data) => {
          console.log('se registró un nuevo material', data)
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró un nuevo material', icon: 'success' });
        })
        .catch((err) => {
          console.log('no se pudo registrar material', err)
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en el registro de material', icon: 'error' });
        })
      await EmitirMateriales();
    })
    // ******************
    // * EDITAR MATERIAL *
    // ******************
    socket.on('CLIENTE:GuardarMaterial', async (data) => {
      try {
        const { _id, ...updatedData } = data;
        await Material.updateOne({ _id }, updatedData);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Los cambios en el material se han guardado', icon: 'success' });
      } catch (error) {
        console.error('Error al guardar el material:', error);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al guardar el material', icon: 'error' });

      }
      await EmitirMateriales();
    });

    // *********************
    // * ELIMINAR MATERIAL *
    // *********************
    socket.on('CLIENTE:elminarMaterial', async (id) => {
      try {
        await Material.updateOne({ _id: id }, { borrado: true });
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'El material fué eliminado', icon: 'success' });
      } catch (error) {
        console.error('Ha ocurrido un error con el material que solicitó eliminar', error)
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error con el material que solicitó eliminar', icon: 'error' });

      }
      await EmitirMateriales();
    });
  })
}
