import departamento from '../src/models/departamentos'
import areas from '../src/models/areas'


module.exports = (io) => {
    io.on('connection', (socket) => {

        const EmitirAreas = async () => {
            try{
                const Areas = await areas.find({borrado: false}).exec()
                io.emit('SERVER:Areas', Areas)
            }catch(err){
                console.log('Error en la emisión de las areas')
            }
        }

        const EmitirDepartamento = async () => {
            try{
                const Departamentos = await departamento.find({ borrado: false }).exec()
                io.emit('SERVER:Departamentos', Departamentos)
            }catch(err){
                console.log('Error en la emisión de los departamentos:', err)
            }}
            
            socket.on('CLIENTE:Departamento', async() => {
                try{
                    EmitirDepartamento();
                }catch(err){
                    console.log('Error no se pudo realizar la llamada a la emisión de departamentos:', err)
                }
            })

            socket.on('CLIENTE:Areas', async() =>{
                try{
                    EmitirAreas();
                }catch(err){
                    console.log('Error no se puede realizar llamada a las areas')
                }
            })


        socket.on('CLIENTE:nuevoDepartamento', async (data) => {
            try{
                if(data._id){
                    await departamento.findByIdAndUpdate(data._id, data);
                    EmitirDepartamento();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el departamento', icon: 'info' });
                    console.log('Se actualizó un departamento');
                    return
                }else{
                    const Departamento = new departamento(data)
                    try{
                        await Departamento.save();
                        console.log('Se creó el nuevo departamento');
                        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'se registó nuevo departamento', icon: 'success' });
                        EmitirDepartamento();
                    }catch(err){
                        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se pudo crear el departamento', icon: 'error' });
                        console.log('Error en la creación de nuevo departamento', err)
                    }
                }
            }catch(err){
                console.log('Error en la creación de nuevo departamento:', err)
            }
        });

        socket.on('CLIENTE:nuevaArea', async (data) => {
            try{
                if(data._id){

                    // Obtener el nombre anterior del departamento
                    const nombreAnterior = await areas.findById(data._id);

                    console.log(nombreAnterior)
                    // Buscar y actualizar las áreas que cumplen con la condición
                    await areas.updateMany({ sup: nombreAnterior.nombre }, { sup: data.nombre });

                    // Actualizar el departamento
                    await areas.findByIdAndUpdate(data._id, data);


                    // Emitir eventos y mensajes
                    EmitirAreas();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó la subunidad', icon: 'info' });
                    console.log('Se actualizó una subunidad');
                    return
                    EmitirDepartamento();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el departamento', icon: 'info' });
                    console.log('Se actualizó un departamento');
                    return;

                    await areas.findByIdAndUpdate(data._id, data);
                }else{
                    const Unidad = new areas(data)
                    try{
                        await Unidad.save();
                        console.log('Se creó el subunidad');
                        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'se registó nueva subunidad', icon: 'success' });
                        EmitirAreas();
                    }catch(err){
                        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se pudo crear la subunidad', icon: 'error' });
                        console.log('Error en la creación de nueva subunidad', err)
                    }
                }
            }catch(err){
                console.log('Error en la creación de nueva subunidad:', err)
            }
        });

        socket.on('CLIENTE:EliminarDepartamento', async (data) => {
            try{
                await departamento.findByIdAndUpdate(data._id, {borrado:true})
                try{
                    EmitirDepartamento();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó el departamento', icon: 'info' });
                }catch(err){
                    console.log(err)
                }
            }catch(err){
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la eliminación del departamento', icon: 'error' });
                console.log('Error en la eliminación del departamento', err)
            }
        })

        socket.on('CLIENTE:EliminarSubUnidad', async (data) => {
            try{
                await areas.findByIdAndUpdate(data._id, {borrado:true})
                try{
                    EmitirAreas();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó la subunidad', icon: 'info' });
                }catch(err){
                    console.log(err)
                }
            }catch(err){
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la eliminación subdepartamento', icon: 'error' });
                console.log('Error en la eliminación del departamento', err)
            }
        })

    });
}