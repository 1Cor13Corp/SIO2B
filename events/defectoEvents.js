import defecto from "../src/models/defectos";
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emitirDefectos = async () => {
            try {
              const Defecto = await defecto.find({ borrado: false })
                                           .populate('cliente')
                                           .populate('categoria')
                                           .exec()
              io.emit('SERVER:defecto', Defecto)
            } catch (error) {
              console.error('Error al buscar defecto:', error)
            }
          }
      
          socket.on('CLIENTE:BuscarDefecto', async () => {
            try {
              await emitirDefectos()
            } catch (err) {
              console.error('No se pudo realizar la busqueda de defecto', err)
            }
          })

          // GUARDAR DEFECTO
        socket.on('CLIENTE:NuevoDefecto', async (data) => {
            const existente = await defecto.findOne({ cliente: data.cliente, categoria: data.categoria });

            if (existente) {
                try {
                    await defecto.updateOne({ cliente: data.cliente, categoria: data.categoria }, data);
                    console.log('Se actualizó el defecto existente');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el defecto existente', icon: 'success' });
                    emitirDefectos();
                } catch (err) {
                    console.error('Hubo un error al actualizar el defecto:', err);
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error al actualizar el defecto', icon: 'error' });
                }
            } else {
                // Crear una nueva instancia de Defecto
                const nuevoDefecto = new defecto(data);
                try {
                    await nuevoDefecto.save();
                    console.log('Se registraron defectos');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registraron defectos', icon: 'success' });
                    emitirDefectos();
                } catch (err) {
                    console.error('Hubo un error en el registro de los defectos:', err);
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro de los defectos', icon: 'error' });
                }
            }
        });
    });
}