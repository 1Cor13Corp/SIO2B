import cargos from '../src/models/cargos'
import cargo from '../src/models/cargos'

module.exports = (io) => {
    io.on('connection', (socket) => {

        const EmitirCargos = async () => {
            try{
                const Cargos = await cargo.find({borrado: false}).exec()
                io.emit('SERVER:Cargos', Cargos)
            }catch(err){
                console.log('Error en la emisión de los cargos', err)
            }
        }

        socket.on('CLIENTE:Cargos', async() => {
            try{
                EmitirCargos();
            }catch(err){
                console.log('Error no se pudo realizar la llamada a los cargos:', err)
            }
        })

        socket.on('CLIENTE:NuevoCargo', async(data) => {
            try{
                if(data._id){
                    await cargo.findByIdAndUpdate(data._id, data);
                    EmitirCargos();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el cargo', icon: 'info' });
                    console.log('Se actualizó el cargo');
                    return
                }else{
                    const Cargo = new cargo(data)
                    try{
                        await Cargo.save();
                        console.log('Se creó el nuevo departamento');
                        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'se registó nuevo cargo', icon: 'success' });
                        EmitirCargos();
                    }catch(err){
                        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se pudo crear el cargo', icon: 'error' });
                        console.log('Error en la creación de nuevo cargo', err)
                    }
                }

            }catch(err){

                console.log('Error al intentar almacenar el cargo:', err)
            }
        })

        socket.on('CLIENTE:EliminarCargo', async(data)=>{
            await cargos.findByIdAndUpdate(data._id, {borrado:true})
            try{
                EmitirCargos();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó el cargo', icon: 'info' });
            }catch(err){
                console.log('Error al intentar borrar cargo:',err)
            }
        })


    })
}