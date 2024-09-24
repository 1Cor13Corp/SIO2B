import cliente from '../src/models/cliente'
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emitirClientes = async () =>{
            try {
                const Fase = await cliente.find({borrado:false})
                                                    .exec()
                io.emit('SERVER:cliente', Fase)
            } catch (error) {
                console.error('Error al buscar cliente:', error)
            }
        }
        socket.on('CLIENTE:buscarCliente', async() => {
            try{
                await emitirClientes()
            }catch(err){
                console.error('No se pudo realizar la busqueda de los clientes')
            }
        })
        // CREAR FASE
        socket.on('CLIENTE:nuevoCliente', async (data) => {
            // Verificar si el grupo ya existe en la base de datos
            const faseExiste = await cliente.findOne({ nombre: data.nombre, borrado: false });
            if (faseExiste) {
              console.log('el cliente ya se encuentra registrado');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Este cliente ya se encuentra registrado', icon: 'info' });
            } else {
              // Verificar si los datos requeridos están completos
              if (!data.nombre) {
                console.log('Faltan datos requeridos para el registro del cliente');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para el registro del cliente', icon: 'warning' });
              } else {
                // Crear una nueva instancia de Grupo
                const NuevaNota = new cliente(data);
                try {
                  await NuevaNota.save();
                  console.log('Se registró nuevo cliente');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró nuevo cliente', icon: 'success' });
                  emitirClientes();
                } catch (err) {
                  console.error('Hubo un error en el registro del cliente:', err);
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro de cliente', icon: 'error' });
                }
              }
            }
          });
        
          //   EDITAR FASE
        socket.on('CLIENTE:EditCliente', async (data) => {
            if (!data.nombre) {
              console.log('Falta el nombre de la fase para editar');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Falta el nombre de la fase para editar', icon: 'warning' });
            } else {
              try {
                await cliente.findByIdAndUpdate(data._id, data);
                console.log('Se editó el cliente');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó el cliente', icon: 'success' });
              } catch (err) {
                console.error('Error al editar cliente: ', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la edición del cliente', icon: 'error' });
              }
              emitirClientes();
            }
          });

    })
}