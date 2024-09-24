import Fabricante from "../src/models/fabricante"

module.exports = (io)=>{
    io.on('connection', (socket) => {
        const emitirFabricantes = async () =>{
            try {
                const Fabricantes = await Fabricante.find({borrado:false})
                                                    .populate('grupo')
                                                    .exec()
                io.emit('SERVER:Fabricantes', Fabricantes)
            } catch (error) {
                console.error('Error al buscar fabricantes:', error)
            }
        }
        socket.on('CLIENTE:BuscarFabricante', async() => {
            try{
                await emitirFabricantes()
            }catch(err){
                console.error('No se pudo realizar la busqueda de los fabricantes')
            }
        })


        // ********************
        // * NUEVO FABRICANTE *
        // ********************
        socket.on('CLIENTE:NuevoFabricante', async (data) => {
            try {
              const { _id, ...fabricanteData } = data;
              
              // Check if 'nombre', 'alias', or 'grupo' is missing in fabricanteData
              if (!fabricanteData.nombre || !fabricanteData.alias || !fabricanteData.grupo || !fabricanteData.origenes) {
                console.log('Faltan datos requeridos del fabricante');
                // Emit an error message to the client
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos del fabricante', icon: 'warning' });
                return;
              }
              
              // Check if the fabricanteData.nombre already exists
              const fabricanteExistente = await Fabricante.findOne({ nombre: fabricanteData.nombre, borrado: false });
              if (fabricanteExistente) {
                console.log('Este fabricante ya existe');
                // Emit an error message to the client
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Este fabricante ya existe', icon: 'error' });
                return;
              }
              
              const nuevoFabricante = await Fabricante.create(fabricanteData);
              console.log('Se creó un nuevo fabricante');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó un nuevo fabricante', icon: 'success' });
              emitirFabricantes();
            } catch (error) {
              console.error('Ha ocurrido un error al crear el nuevo fabricante:', error);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al crear el nuevo fabricante', icon: 'error' });
            }
          });
        
        // *********************
        // * EDITAR FABRICANTE *
        // *********************
        socket.on('CLIENTE:EditarFabricante', async (data) => {
            try {
                const grupoIds = data.grupo.map(grupo => grupo._id);
                data.grupo = grupoIds;
                await Fabricante.findByIdAndUpdate(data._id, data);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó un fabricante', icon: 'success' });
                emitirFabricantes();
            } catch (error) {
                console.error('Error al editar el fabricante:', error);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al editar un fabricante', icon: 'error' });
            }
        });
        // ***********************
        // * ELIMINAR FABRICANTE *
        // ***********************
        socket.on('CLIENTE:deleteFabricante', async (id) => {
            try{
                await Fabricante.updateOne({_id:id}, {borrado:true})
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó un fabricante', icon: 'success' });
                emitirFabricantes()
            }catch(err) {
                console.error('Ha ocurrido un error al elminar al fabricante')
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al elminar al fabricante', icon: 'error' });
            }
        });
    })
}