import Proveedor from "../src/models/proveedor"
import Fabricante from "../src/models/fabricante"

module.exports = (io) => {
    io.on('connection', (socket)=>{
               
        // ********************
        // * BUSCAR PROVEEDOR *
        // * ******************
        const emitirProveedores = async () =>{
            try{
                const proveedor = await Proveedor.find({borrado:false}).populate('fabricantes').exec()
                io.emit('SERVER:proveedores', proveedor)
            }catch(err){
                console.error('Ha ocurrido un erro con la busqueda de proveedores', err)
            }

        }

        socket.on('CLIENTE:BuscarProveedores', async () =>{
            try{
                await emitirProveedores()
            }catch(err){
                console.error('Ha ocurrido un erro con la busqueda de proveedores', err)
            }
        })
        // *******************
        // * NUEVO PROVEEDOR *
        // *******************
        socket.on('CLIENTE:NuevoProveedor', async (data) => {
            try {
                if (data.fabricantes === '') {
                    const lastFabricante = await Fabricante.findOne().sort({ _id: -1 });
                    if (lastFabricante) {
                        data.fabricantes = [lastFabricante._id];
                    }
                }
                
                const existingProveedor = await Proveedor.findOne({ nombre: data.nombre, borrado:false });
                if (existingProveedor) {
                    console.log('El proveedor ya existe en la base de datos');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'El proveedor ya existe en la base de datos', icon: 'info' });
                    return;
                }
                
                const nuevoProveedor = new Proveedor(data); // Create a new instance of Proveedor
                await nuevoProveedor.save(); // Save the new Proveedor instance to the database
                
                console.log('Se creó nuevo proveedor');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se creó nuevo proveedor', icon: 'success' });
                emitirProveedores();
            } catch (err) {
                console.error('Ha ocurrido un error al registrar nuevo proveedor', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al registrar nuevo proveedor', icon: 'error' });
            }
        });
        // ********************
        // * EDITAR PROVEEDOR *
        // ********************
        socket.on('CLIENTE:EditarProveedor', async(data) =>{
            try{
                const {_id, ...ProveedorData} = data;
                await Proveedor.updateOne({_id:_id}, ProveedorData)
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se editó proveedor', icon: 'success' });
                emitirProveedores();
            }catch(err){
                console.error('Ha ocurrido un error en la edición del proveedor', err)
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error en la edición del proveedor', icon: 'error' });
            }

        })

        // ***********************
        // * ELIMINAR PROVEEDOR *
        // ***********************
        socket.on('CLIENTE:deleteProveedor', async (id) => {
            try{
                await Proveedor.updateOne({_id:id}, {borrado:true})
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó un proveedor', icon: 'success' });
                emitirProveedores()
            }catch(err) {
                console.error('Ha ocurrido un error al elminar al Proveedor')
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Ha ocurrido un error al elminar al proveedor', icon: 'error' });

            }


        });
    })
 
}