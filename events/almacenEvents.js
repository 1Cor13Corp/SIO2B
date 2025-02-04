const webPush = require('web-push');
import almacen from "../src/models/almacen"
import Registro from "../src/models/descuentos"
import subscriptions from "../src/models/subscriptions"

module.exports = (io) => {
    io.on('connection', (socket) => {


          function sendNotification(subscription, payload) {
              webPush.sendNotification(subscription, payload)
              .then(response => console.log('Notificación enviada', response))
              .catch(error => console.error('Error al enviar la notificación:', error));
          }

        const emitirAlmacen = async () => {
            try {
              const Almacen = await almacen.find({ borrado: false })
                                           .populate('material')
                                           .populate({path:'material',populate:'fabricante grupo' })
                                           .exec()
              io.emit('SERVER:almacen', Almacen)
            } catch (error) {
              console.error('Error al buscar almacen:', error)
            }
          }
      
          socket.on('CLIENTE:BuscarAlmacen', async () => {
            try {
              await emitirAlmacen()
            } catch (err) {
              console.error('No se pudo realizar la busqueda del almacen', err)
            }
          })
          //Nueva especificacion
          socket.on('CLIENTE:NuevoAlmacen', async (data) => {
              try {
              const nuevoAlmacen = await almacen.create(data);
              console.log('Se agrego material al almacen');
              } catch (err) {
              console.error('Ha ocurrido un error en la actualizacion del almacen', err);
              }
              await emitirAlmacen()
          })

socket.on('CLIENTE:Asignacion', async (data) => {
    try {
        
      for(let i=0;i<data.length;i++){
        almacen.findByIdAndUpdate(data[i].producto, {neto:data[i].restante})
      }
        // Inserta los documentos en la colección Registro
        await Registro.insertMany(data);
        
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó la asignación de material', icon: 'success' });

        // Recuperar y enviar notificaciones
        const subscriptions_ = await subscriptions.find().lean(); // `lean()` para una mejor performance si no se necesita modificar los datos
        const payload = JSON.stringify('Se realizó la asignación de material para la orden 2025001');
        
        // Evitar enviar notificaciones repetidas
        const uniqueSubscriptions = new Set();
        subscriptions_.forEach(subscription => {
            if (!uniqueSubscriptions.has(subscription.endpoint)) {
                uniqueSubscriptions.add(subscription.endpoint);
                sendNotification(subscription, payload);
            }
        });
    } catch (err) {
        console.log('Ha ocurrido un error en la realización del descuento', err);
    }

    await emitirAlmacen();
});

  socket.on('CLIENTE:BuscarLogs', async () => {
      try{
        const Registros = await Registro.find({ borrado: false})
        .populate('producto')
        .populate('material')
        .exec()
          
        io.emit('SERVER:registros', Registros)
      } catch (err){
        console.log('Ha ocurrido un error en la busqueda de registros', err);
      }

      await emitirAlmacen();
  })

    })
}