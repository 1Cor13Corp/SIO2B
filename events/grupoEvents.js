import Grupo from '../src/models/grupo';
module.exports = (io) => {

    io.on('connection', (socket) => {
        // crear funcion para emitir grupos
        const emitGrupos = async () =>{
            try {
                const Grupos = await Grupo.find({borrado:false})
                io.emit('cargarGrupos', Grupos)
            } catch (error) {
                console.error('Error al buscar grupos:', error)
            }
            
        }
        
        // EVENTOS CRUD DE GRUPOS

        // ****************
        // * BUSCAR GRUPO *
        // ****************
        socket.on('CLIENTE:buscarGrupos', async () =>{
            try {
                emitGrupos()
            } catch (error) {
                console.error('Error al emitir grupos:', error)
            }
            
        });

        // ***************
        // * NUEVO GRUPO *
        // ***************
        socket.on('CLIENTE:NuevoGrupo', async (data) => {
            // Verificar si el grupo ya existe en la base de datos
            const grupoExistente = await Grupo.findOne({ nombre: data.nombre, borrado: false });
            if (grupoExistente) {
              console.log('Este grupo ya se encuentra registrado');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Este grupo ya se encuentra registrado', icon: 'info' });
            } else {
              // Verificar si los datos requeridos están completos
              if (!data.nombre) {
                console.log('Faltan datos requeridos para crear el grupo');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para crear el grupo', icon: 'warning' });
              } else {
                // Crear una nueva instancia de Grupo
                const NuevaNota = new Grupo(data);
                try {
                  await NuevaNota.save();
                  console.log('Se creó un nuevo grupo');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó un nuevo grupo', icon: 'success' });
                  emitGrupos();
                } catch (err) {
                  console.error('Hubo un error en la creación del grupo:', err);
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la creación del grupo', icon: 'error' });
                }
              }
            }
          });

        // ******************
        // * Eliminar GRUPO *
        // ******************
        socket.on('CLIENTE:deleteGrupo', async (id) => {
            await Grupo.updateOne({_id:id}, {borrado:true})
                .then(()=>{
                    console.log('Se eliminó un grupo')
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó el grupo', icon:'success' });
                }).catch((err)=>{
                    console.error('Hubo un error en la eliminación del grupo:', err)
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la eliminación del grupo', icon:'error' });
                })
            emitGrupos()
        });

        // ****************
        // * EDITAR GRUPO *
        // ****************
        socket.on('CLIENTE:EditarGrupo', async (data) => {
            if (!data.nombre) {
              console.log('Falta el nombre del grupo para editar');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Falta el nombre del grupo para editar', icon: 'warning' });
            } else {
              try {
                await Grupo.findByIdAndUpdate(data.id, data);
                console.log('Se editó un grupo');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó el grupo', icon: 'success' });
              } catch (err) {
                console.error('Error al editar grupo: ', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la edición del grupo', icon: 'error' });
              }
              emitGrupos();
            }
          });
    })

};