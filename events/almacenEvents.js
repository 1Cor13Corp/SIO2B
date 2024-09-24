import almacen from "../src/models/almacen"
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emitirAlmacen = async () => {
            try {
              const Almacen = await almacen.find({ borrado: false })
                                           .populate('material')
                                           .populate({path:'material',populate:'fabricante' })
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
    })
}