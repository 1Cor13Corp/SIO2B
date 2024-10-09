import Recepcion from '../src/models/recepcion'
import reclamos from '../src/models/reclamos';
import ComentariosRecepcion from '../src/models/comentarios-recepcion';

module.exports = (io) => {
  io.on('connection', (socket) => {
    const emitirReclamos = async () => {
      try{
        const Reclamos = await reclamos.find({ borrado: false })
                                        .populate({
                                          path: 'recepcion',
                                          populate: [
                                            {
                                              path: 'proveedor', // Poblar el campo 'proveedor' dentro de 'recepcion'
                                              model: 'proveedor'  // Asegúrate de que este sea el nombre correcto del modelo de Proveedor
                                            },
                                            {
                                              path: 'materiales.material', // Poblar el campo 'material' dentro de 'materiales' en 'recepcion'
                                              populate: {
                                                path: 'fabricante' // Poblar el campo 'fabricante' dentro de 'material'
                                              }
                                            }
                                          ]
                                        })
                                        .exec();

        io.emit('SERVER:Reclamos', Reclamos)
      } catch(err){
        console.error('Error al buscar reclamos:', err)
      }
    }

    socket.on('CLIENTE:BuscarReclamos', async () => {
      try {
        await emitirReclamos()
      } catch (err) {
        console.error('No se pudo realizar la busqueda de los reclamos', err)
      }
    })

    const emitirRecepciones = async () => {
      try {
        const Recepciones = await Recepcion.find({ borrado: false })
          .populate('materiales.oc')
          .populate('materiales.material')
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'fabricante'
            }
          })
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'grupo'
            }
          })
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'especificacion'
            }
          })
          .populate({
            path: 'materiales.material',
            populate: {
              path: 'especificacion2'
            }
          })
          .populate('proveedor')
          .exec()
        io.emit('SERVER:Recepciones', Recepciones)
      } catch (error) {
        console.error('Error al buscar recepciones:', error)
      }
    }
    socket.on('CLIENTE:BuscarRecepciones', async () => {
      try {
        await emitirRecepciones()
      } catch (err) {
        console.error('No se pudo realizar la busqueda de las recepciones', err)
      }
    })


    //****************/
    // NUEVO RECLAMO
    //************** */

    socket.on('CLIENTE:NuevoReclamo', async (data) => {
    try {
      // Set data.recepcion to data.recepcion._id if it exists
      if (data.recepcion && data.recepcion._id) {
        data.recepcion = data.recepcion._id;
      }

      if (data._id) {
        // If data._id exists, update the existing reclamo
        await reclamos.findByIdAndUpdate(data._id, data, { new: true });
        console.log('Reclamo de material actualizado');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Reclamo en la recepción de material actualizado', icon: 'success' });
      } else {
        // If data._id does not exist, create a new reclamo
        const NuevoReclamo = new reclamos(data);
        await NuevoReclamo.save();
        console.log('Nueva reclamo de material creada');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Nuevo reclamo en la recepción de material creado', icon: 'success' });
      }
      emitirReclamos();
    } catch (err) {
      console.error('Error en la realización de reclamo:', err);
      socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la realización de reclamo', icon: 'error' });
    }
  });

    // *******************
    // * NUEVA RECEPCIÓN *
    // *******************

    socket.on('CLIENTE:NuevaRecepcion', async (data) => {
      try {
        if (data._id) {
          // Verificar si todos los resultados son "Aprobado" y si la longitud de resultados es igual a la de materiales
          const todosAprobados = data.resultados.every((resultado) => resultado === "Aprobado");
    
          if (todosAprobados && data.resultados.length === data.materiales.length) {
            data.status = 'Finalizado';
          }
    
          // Editar la recepción
          await Recepcion.findByIdAndUpdate(data._id, data);
          console.log('Recepción editada con éxito');
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Recepción editada con éxito', icon: 'success' });
        } else {
          // Si no existe _id, crear nueva recepción
          const NuevaRecepcion = new Recepcion(data);
          await NuevaRecepcion.save();
          console.log('Nueva recepción de materiales creada');
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Nueva recepción de materiales creada', icon: 'success' });
        }
        emitirRecepciones();
      } catch (err) {
        console.error('Error en la recepción de materiales:', err);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la recepción de materiales', icon: 'error' });
      }
    });
    
    
    
    //***********************
    //* notificar recepcion *
    //***********************
    socket.on('CLIENTE:NotificaNuevoMaterial', async (id) => {
      try {
        await Recepcion.updateOne({ _id: id }, { status: 'Notificado' });
        console.log('Se realizo la notificacion de un material...')
      } catch (err) {
        console.log('ha ocurrido un error', err)
      }
      emitirRecepciones();
    })
    //cambiar a en observacion
    socket.on('CLIENTE:CheckeoDeMaterial', async (id) => {
      console.log(id);
      try {
        await Recepcion.updateOne({ _id: id }, { status: 'En observacion' });
        console.log('Se realizó el chequeo de la informacion');
      } catch (err) {
        console.log('error al checkear informacion', err)
      }
      emitirRecepciones();
    })


    // *******************************************
    // COMENTARIOS EN LA RECEPCION
    // *******************************************

    const EmitirComentarios = async() =>{
      try{
        const Comentarios = await ComentariosRecepcion.find({ borrado: false })
                                                      .exec()
        io.emit('SERVER:Comentario', Comentarios)
      }catch(err){
        console.log(err)
      }
    }

    socket.on('CLIENTE:Comentario', async () =>{
      EmitirComentarios();
    })

    socket.on('CLIENTE:NuevoComentario', async (data) => {

      // Verificar si los datos requeridos están completos
      const NuevaComentario = new ComentariosRecepcion(data);
      try {
        await NuevaComentario.save();
        // console.log('Se realizó nueva recepción de materiales');
        // socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nueva recepción de materiales', icon: 'success' });
        EmitirComentarios();
      } catch (err) {
        console.error('No se pudo guardar comentario:', err);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error: No se pudo guardar comentario', icon: 'error' });
      }
    });

  })
}
