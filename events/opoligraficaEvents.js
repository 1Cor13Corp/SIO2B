import ordenPoligrafica from '../src/models/orden-poligrafica';

module.exports = (io) => {
  io.on('connection', (socket) => {


        // *******************
        // * BUSCAR Orden *
        // *******************
        const EmitirOrdenes = async () => {
            try {
              const ordenes = await ordenPoligrafica.find({ borrado: false })
                                                    .populate('proveedor')
                                                    .populate({
                                                      path: 'pedido.material',
                                                      model: 'material',
                                                      populate: [
                                                        { 
                                                          path: 'fabricante', 
                                                          model: 'fabricante' 
                                                        },
                                                        { 
                                                          path: 'grupo', 
                                                          model: 'grupo' 
                                                        }
                                                      ]
                                                    });
            io.emit('SERVER:OrdenesPoligrafica', ordenes);
            } catch (error) {
            console.error('Ha ocurrido un error al consultar las ordenes:', error);
            }
        };

        socket.on('CLIENTE:BuscarOrdenesPoligrafica', async () => {
            await EmitirOrdenes();
        });

     // *******************
// * NUEVA ORDEN POLIGRÁFICA *
// *******************
// Este código escucha el evento 'CLIENTE:NuevaOrdenPoligrafica' en un socket.
// Cuando se activa este evento, crea un nuevo objeto OrdenPoligrafica con los datos recibidos,
// lo guarda en la base de datos y luego emite una actualización de órdenes poligráficas.
socket.on('CLIENTE:NuevaOrdenPoligrafica', async (data) => {
    const nuevaOrden = new ordenPoligrafica(data);
    try {
      const nuevaOrdenGuardada = await nuevaOrden.save();
      console.log('Se registró una nueva orden poligráfica', nuevaOrdenGuardada);
      socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró una nueva orden de compra', icon: 'success' });
      await EmitirOrdenes();
    } catch (error) {
      console.error('No se pudo registrar la orden poligráfica', error);
      socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en el registro de la orden de compra', icon: 'error' });
    }
  });
  

    })
}