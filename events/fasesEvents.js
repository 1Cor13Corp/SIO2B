import fase from "../src/models/fase"
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emitirFases = async () =>{
            try {
                const Fase = await fase.find({borrado:false})
                                                    .exec()
                io.emit('SERVER:fase', Fase)
            } catch (error) {
                console.error('Error al buscar fase:', error)
            }
        }
        socket.on('CLIENTE:buscarFase', async() => {
            try{
                await emitirFases()
            }catch(err){
                console.error('No se pudo realizar la busqueda de las fases')
            }
        })

        // CREAR FASE
        socket.on('CLIENTE:nuevaFase', async (data) => {
            // Verificar si el grupo ya existe en la base de datos
            const faseExiste = await fase.findOne({ nombre: data.nombre, borrado: false });
            if (faseExiste) {
              console.log('la fase ya se encuentra registrado');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Esta fase ya se encuentra registrada', icon: 'info' });
            } else {
              // Verificar si los datos requeridos están completos
              if (!data.nombre) {
                console.log('Faltan datos requeridos para crear la fase');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para crear la fase', icon: 'warning' });
              } else {
                // Crear una nueva instancia de Grupo
                const NuevaNota = new fase(data);
                try {
                  await NuevaNota.save();
                  console.log('Se creó un nueva fase');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó un nueva fase', icon: 'success' });
                  emitirFases();
                } catch (err) {
                  console.error('Hubo un error en la creación de fase:', err);
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la creación de la fase', icon: 'error' });
                }
              }
            }
          });

        //   EDITAR FASE
        socket.on('CLIENTE:EditFase', async (data) => {
            if (!data.nombre) {
              console.log('Falta el nombre de la fase para editar');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Falta el nombre de la fase para editar', icon: 'warning' });
            } else {
              try {
                await fase.findByIdAndUpdate(data._id, data);
                console.log('Se editó la fase');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó la fase', icon: 'success' });
              } catch (err) {
                console.error('Error al editar fase: ', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la edición de la fase', icon: 'error' });
              }
              emitirFases();
            }
          });

        // ******************
        // * Eliminar FASE *
        // ******************
        socket.on('CLIENTE:deleteFase', async (id) => {
          await fase.updateOne({_id:id}, {borrado:true})
              .then(()=>{
                  console.log('Se eliminó una fase')
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó la fase', icon:'success' });
              }).catch((err)=>{
                  console.error('Hubo un error en la eliminación de la fase:', err)
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la eliminación de la fase', icon:'error' });
              })
            emitirFases();
      });
    })
}