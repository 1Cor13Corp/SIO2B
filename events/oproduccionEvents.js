const webPush = require('web-push');
import op from '../src/models/ordenProduccion';
import subscriptions from '../src/models/subscriptions';
import gestion from '../src/models/gestiones';

module.exports = (io) => {
  io.on('connection', (socket) => {

    // Función para enviar notificación
    function sendNotification(subscription, payload) {
        webPush.sendNotification(subscription, payload)
        .then(response => console.log('Notificación enviada', response))
        .catch(error => console.error('Error al enviar la notificación:', error));
    }

    const EmitirOP = async() =>{
        try {
            const ordenes = await op.find({ borrado: false })
                                    .populate('cliente')
                                    .populate('oc')
                                    .populate('sustrato.sustrato')
                                    .populate('tinta.tinta')
                                    .populate('barniz.barniz')
                                    .populate('pega.pega')
                                    .populate('fases.maquina')
                                                  
          io.emit('SERVER:OrdenProduccion', ordenes);
          } catch (error) {
          console.error('Ha ocurrido un error al consultar las ordenes de producción:', error);
          }
    };

    const EmitirGestiones = async() =>{
        try {
            const Gestiones = await gestion.find({ borrado: false })
                                    .populate('orden')
          io.emit('SERVER:Gestiones', Gestiones);
          } catch (error) {
          console.error('Ha ocurrido un error al consultar gestiones:', error);
          }
    };


    socket.on('CLIENTE:BuscarOrdenProduccion', async () => {
        await EmitirOP();
    });

    socket.on('Cliente:Gestiones', async () => {
        await EmitirGestiones();
    })

    // ****************** NUEVA ORDEN DE PRODUCCIÓN ************************

    socket.on('CLIENTE:NuevaOrdenProduccion', async (data) => {
      const nuevaOrden = new op(data);
   
      try {
         const nuevaOrdenGuardada = await nuevaOrden.save();
         console.log('Se registró una nueva orden de producción', nuevaOrdenGuardada);
         
         // Emitir mensaje al cliente después de guardar la orden
         socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró una nueva orden de producción', icon: 'success' });
   
         // Recuperar y enviar notificaciones
         const subscriptions_ = await subscriptions.find().lean(); // `lean()` para una mejor performance si no se necesita modificar los datos
         const payload = JSON.stringify('Se generó nueva orden de producción, nueva asignación pendiente');
   
         // Evitar enviar notificaciones repetidas
         const uniqueSubscriptions = new Set();
         subscriptions_.forEach(subscription => {
            if (!uniqueSubscriptions.has(subscription.endpoint)) {
               uniqueSubscriptions.add(subscription.endpoint);
               sendNotification(subscription, payload);
            }
         });
   
         console.log({ message: 'Notificaciones enviadas' });
         await EmitirOP();
   
      } catch (error) {
         console.error('No se pudo registrar la orden de producción', error);
         socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en el registro de la orden de producción', icon: 'error' });
      }
   });

   socket.on('CLIENTE:ActualizarOrdenProduccion', async (data) => {
      try {
          // Asumiendo que 'data' tiene un campo 'id' para identificar la orden
          const ordenActualizada = await op.findByIdAndUpdate(data._id, { status: 'En producción' }, { new: true });
          
          if (ordenActualizada) {
              console.log('Se actualizó el estado de la orden de producción a En producción', ordenActualizada);
              
              // Emitir mensaje al cliente después de actualizar la orden
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el estado de la orden de producción a En producción', icon: 'success' });
          } else {
              console.log('No se encontró la orden de producción con el ID especificado');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se encontró la orden de producción con el ID especificado', icon: 'error' });
          }
      } catch (error) {
          console.error('No se pudo actualizar la orden de producción', error);
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la actualización de la orden de producción', icon: 'error' });
      }
  
      await EmitirOP();
  });

  socket.on('CLIENTE:NuevaGestion', async (data) => {
    const nuevaGestion = new gestion(data);
 
    try {
       const nuevaGestionGuardada = await nuevaGestion.save();
       console.log('Se registró una nueva gestión', nuevaGestionGuardada);
       
       // Emitir mensaje al cliente después de guardar la orden
       socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró una nueva gestión', icon: 'success' });
       await EmitirOP();
 
    } catch (error) {
       console.error('No se pudo registrar la orden de producción', error);
       socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en el registro de la orden de producción', icon: 'error' });
    }

    await EmitirGestiones()
 });


  


  })
}