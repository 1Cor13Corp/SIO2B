const webPush = require('web-push');
import requisiciones from '../src/models/requisicion'
import subscriptions from '../src/models/subscriptions';


module.exports = (io) => {
    io.on('connection', (socket) => {

        // Función para enviar notificación
        function sendNotification(subscription, payload) {
          webPush.sendNotification(subscription, payload)
          .then(response => console.log('Notificación enviada', response))
          .catch(error => console.error('Error al enviar la notificación:', error));
        }

        const emitirRequisiciones = async () => {
            try{
              const Requisicion = await requisiciones.find()
                                              .populate('materiales.material')
                                              .populate('material')
                                              .populate('material.fabricante')
                                              .exec();
      
              io.emit('SERVER:Requisicion', Requisicion)
            } catch(err){
              console.error('Error al buscar Requisicion:', err)
            }
        }

        socket.on('CLIENTE:BuscarRequisicion', async () => {
            try {
              await emitirRequisiciones()
            } catch (err) {
              console.error('No se pudo realizar la busqueda de las solicitudes', err)
            }
        })


        /*
                NUEVA
            REQUISICIÓN

        */

            socket.on('CLIENTE:NuevaRequisicion', async (data) => {
                try{
                    const NuevaRequisicion = new requisiciones(data);
                    await NuevaRequisicion.save();
                    console.log('Nueva requisicion creada');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Nueva solicitud de material enviada', icon: 'success' });
                } catch(err) {
                    console.error('Error en la realización de requisicion:', err);
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al realizar solicitud de material', icon: 'error' });
                }

                emitirRequisiciones();
            });

            /*
              CANCELAR REQUISICIÓN
            */

              socket.on('CLIENTE:CancelarRequisicion', async (id) => {
                try {
                  // Buscar la requisición en la base de datos usando el ID
                  const requisicion = await requisiciones.findById(id);
              
                  if (requisicion) {
                    // Cambiar el estado de la requisición a 'cancelada'
                    requisicion.status = 'cancelada';
              
                    // Guardar los cambios en la base de datos
                    await requisicion.save();
              
                    console.log(`Requisición con ID ${id} cancelada`);
              
                    // Emitir un mensaje de éxito al cliente
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: `Requisición cancelada`, icon: 'success' });
                  } else {
                    // Si no se encuentra la requisición con el ID dado
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Requisición no encontrada', icon: 'error' });
                  }
                } catch (err) {
                  console.error('Error al intentar cancelar la solicitud:', err);
                  // Enviar mensaje de error si ocurre un problema
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al intentar cancelar la solicitud', icon: 'error' });
                }

              emitirRequisiciones();
            });


            socket.on('CLIENTE:AprobarRequisicion', async (id) => {
              try {
                // Buscar la requisición en la base de datos usando el ID
                const requisicion = await requisiciones.findById(id);
            
                if (requisicion) {
                  // Cambiar el estado de la requisición a 'cancelada'
                  requisicion.status = 'Por Asignar';
            
                  // Guardar los cambios en la base de datos
                  await requisicion.save();
            
                  console.log(`Requisición con ID ${id} aceptada`);
            
                  // Emitir un mensaje de éxito al cliente
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: `Requisición aprobada`, icon: 'success' });
                // Recuperar y enviar notificaciones
                const subscriptions_ = await subscriptions.find().lean(); // `lean()` para una mejor performance si no se necesita modificar los datos
                const payload = JSON.stringify('Nueva Solicitud de material pendiente por asignar');
          
                // Evitar enviar notificaciones repetidas
                const uniqueSubscriptions = new Set();
                subscriptions_.forEach(subscription => {
                    if (!uniqueSubscriptions.has(subscription.endpoint)) {
                      uniqueSubscriptions.add(subscription.endpoint);
                      sendNotification(subscription, payload);
                    }
                });

                } else {
                  // Si no se encuentra la requisición con el ID dado
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Requisición no encontrada', icon: 'error' });
                }
              } catch (err) {
                console.error('Error al intentar cancelar la solicitud:', err);
                // Enviar mensaje de error si ocurre un problema
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al intentar aprobar la solicitud', icon: 'error' });
              }

            emitirRequisiciones();
          });

          socket.on('CLIENTE:EtiquetarRequisicion', async (id) => {
            try {
              // Buscar la requisición en la base de datos usando el ID
              const requisicion = await requisiciones.findById(id);
          
              if (requisicion) {
                // Cambiar el estado de la requisición a 'cancelada'
                requisicion.status = 'Por Etiquetar';
          
                // Guardar los cambios en la base de datos
                await requisicion.save();
          
                console.log(`Requisición con ID ${id} liberada`);
          
                // Emitir un mensaje de éxito al cliente
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: `Se liberó la solicitud de material`, icon: 'success' });
              // Recuperar y enviar notificaciones
              const subscriptions_ = await subscriptions.find().lean(); // `lean()` para una mejor performance si no se necesita modificar los datos
              const payload = JSON.stringify('Se liberó un material, el mismo esta pendiente por ser etiquetado');
        
              // Evitar enviar notificaciones repetidas
              const uniqueSubscriptions = new Set();
              subscriptions_.forEach(subscription => {
                  if (!uniqueSubscriptions.has(subscription.endpoint)) {
                    uniqueSubscriptions.add(subscription.endpoint);
                    sendNotification(subscription, payload);
                  }
              });

              } else {
                // Si no se encuentra la requisición con el ID dado
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Solicitud no encontrada', icon: 'error' });
              }
            } catch (err) {
              console.error('Error al intentar liberar la solicitud:', err);
              // Enviar mensaje de error si ocurre un problema
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al intentar liberar la solicitud', icon: 'error' });
            }

          emitirRequisiciones();
        });
      

    }

)}