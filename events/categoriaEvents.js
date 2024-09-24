import categoria from "../src/models/categoria"
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emititCategorias = async () =>{
            try {
                const Categoria = await categoria.find({borrado:false})
                                                    .exec()
                io.emit('SERVER:categoria', Categoria)
            } catch (error) {
                console.error('Error al buscar categoria:', error)
            }
        }
        socket.on('CLIENTE:buscarCategoria', async() => {
            try{
                await emititCategorias()
            }catch(err){
                console.error('No se pudo realizar la busqueda de las categorias')
            }
        })

        // CREAR CATEGORIA
        socket.on('CLIENTE:nuevaCategoria', async (data) => {
            // Verificar si el grupo ya existe en la base de datos
            const categoriaExistente = await categoria.findOne({ nombre: data.nombre, borrado: false });
            if (categoriaExistente) {
              console.log('la categoria ya se encuentra registrado');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Esta categoria ya se encuentra registrada', icon: 'info' });
            } else {
              // Verificar si los datos requeridos están completos
              if (!data.nombre) {
                console.log('Faltan datos requeridos para crear la fase');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para crear la categoría', icon: 'warning' });
              } else {
                // Crear una nueva instancia de Grupo
                const NuevaNota = new categoria(data);
                try {
                  await NuevaNota.save();
                  console.log('Se creó un nueva categoria');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó un nueva categoria', icon: 'success' });
                  emititCategorias();
                } catch (err) {
                  console.error('Hubo un error en la creación de categoria:', err);
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la creación de la categoría', icon: 'error' });
                }
              }
            }
          });

          //   EDITAR CATEGORIA
        socket.on('CLIENTE:EditCategoria', async (data) => {
            if (!data.nombre) {
              console.log('Falta el nombre de la categoria para editar');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Falta el nombre de la categoría para editar', icon: 'warning' });
            } else {
              try {
                await categoria.findByIdAndUpdate(data._id, data);
                console.log('Se editó la categoria');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó la categoria', icon: 'success' });
              } catch (err) {
                console.error('Error al editar categoria: ', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la edición de la categoría', icon: 'error' });
              }
              emititCategorias();
            }
          });
    
        // ******************
        // * Eliminar CATEGORIA *
        // ******************
        socket.on('CLIENTE:deleteCategoria', async (id) => {
            await categoria.updateOne({_id:id}, {borrado:true})
                .then(()=>{
                    console.log('Se eliminó una categoria')
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó la categoría', icon:'success' });
                }).catch((err)=>{
                    console.error('Hubo un error en la eliminación de la categoria:', err)
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la eliminación de la categoría', icon:'error' });
                })
              emititCategorias();
        });


    })
}