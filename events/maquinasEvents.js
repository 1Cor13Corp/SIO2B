import maquina from '../src/models/maquinas'
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emitirMaquinas = async () =>{
            try {
                const Maquina = await maquina.find({borrado:false})
                                                    .populate('fases')
                                                    .exec()
                io.emit('SERVER:maquina', Maquina)
            } catch (error) {
                console.error('Error al buscar fase:', error)
            }
        }
        socket.on('CLIENTE:buscarMaquina', async() => {
            try{
                await emitirMaquinas()
            }catch(err){
                console.error('No se pudo realizar la busqueda de las fases')
            }
        })


        // GUARDAR MAQUINA
        socket.on('CLIENTE:nuevaMaquina', async (data) => {
            // Verificar si el grupo ya existe en la base de datos
            const maquinaExiste = await maquina.findOne({ nombre: data.nombre, borrado: false });
            if (maquinaExiste) {
              console.log('la maquina ya se encuentra registrado');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Esta maquina ya se encuentra registrada', icon: 'info' });
            } else {
              // Verificar si los datos requeridos están completos
              if (!data.nombre) {
                console.log('Faltan datos requeridos para registrar la maquina');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para registrar la maquina', icon: 'warning' });
              } else {
                // Crear una nueva instancia de Grupo
                const NuevaNota = new maquina(data);
                try {
                  await NuevaNota.save();
                  console.log('Se registró nueva maquina');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró un nueva maquina', icon: 'success' });
                  emitirMaquinas();
                } catch (err) {
                  console.error('Hubo un error en la creación de maquina:', err);
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la creación de la maquina', icon: 'error' });
                }
              }
            }
          });

        //   EDITAR FASE
        socket.on('CLIENTE:EditMaquina', async (data) => {
          if (!data.nombre) {
            console.log('Falta el nombre de la maquina para editar');
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Falta el nombre de la maquina para editar', icon: 'warning' });
          } else {
            try {
              await maquina.findByIdAndUpdate(data._id, data);
              console.log('Se editó la maquina');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó la maquina', icon: 'success' });
            } catch (err) {
              console.error('Error al editar maquina: ', err);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la edición de la maquina', icon: 'error' });
            }
            emitirMaquinas();
          }
        });
        // ******************
        // * Eliminar MAQUINA *
        // ******************
        socket.on('CLIENTE:deleteMaquina', async (id) => {
          await maquina.updateOne({_id:id}, {borrado:true})
              .then(()=>{
                  console.log('Se eliminó una maquina')
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó la maquina', icon:'success' });
              }).catch((err)=>{
                  console.error('Hubo un error en la eliminación de la maquina:', err)
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la eliminación de la maquina', icon:'error' });
              })
            emitirMaquinas();
      });
    })
}