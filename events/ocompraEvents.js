import ocompra from '../src/models/orden-compra'
module.exports = (io) => {
    io.on('connection', (socket) => {
        // *******************
        // * BUSCAR Orden *
        // *******************
        const EmitirOrdenes = async () => {
            try {
            const ordenes = await ocompra.find({ borrado: false })
                                            .populate('cliente')
                                            .populate({
                                                path: 'pedido',
                                                populate: {
                                                    path: 'producto',
                                                    populate: {
                                                    path: 'materia_prima.tintas.tinta materia_prima.sustrato identificacion.cliente'
                                                    }
                                                }
                                                });
            io.emit('SERVER:OrdenesCompra', ordenes);
            } catch (error) {
            console.error('Ha ocurrido un error al consultar las ordenes:', error);
            }
        };

        socket.on('CLIENTE:BuscarOrdenesCompra', async () => {
            await EmitirOrdenes();
        });

        // *******************
        // * NUEVA ORDEN POLIGRÁFICA *
        // *******************
        // Este código escucha el evento 'CLIENTE:NuevaOrdenPoligrafica' en un socket.
        // Cuando se activa este evento, crea un nuevo objeto OrdenPoligrafica con los datos recibidos,
        // lo guarda en la base de datos y luego emite una actualización de órdenes poligráficas.
        socket.on('CLIENTE:NuevaOrdenCompra', async (data) => {
            const nuevaOrden = new ocompra(data);
            try {
            const nuevaOrdenGuardada = await nuevaOrden.save();
            console.log('Se registró una nueva orden de compra', nuevaOrdenGuardada);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró una nueva orden de compra', icon: 'success' });
            await EmitirOrdenes();
            } catch (error) {
            console.error('No se pudo registrar la orden poligráfica', error);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en el registro de la orden de compra', icon: 'error' });
            }
        });

    }
)}