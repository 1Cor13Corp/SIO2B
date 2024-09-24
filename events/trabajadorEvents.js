import trabajador from '../src/models/trabajador'
import Contratacion from '../src/models/contrataciones'
module.exports = (io) => {
  io.on('connection', (socket) => {


    const EmitirTrabajador = async () => {
        try{
            const Trabajador = await trabajador.find({ borrado: false })
                                                .populate('contratacion.departamento')
                                                .populate('contratacion.cargo')
                                                .populate('contratacion.de')
                                                .exec()
            io.emit('SERVER:Trabajador', Trabajador)
            const Contrataciones = await Contratacion.find()
                                                .populate('departamento')
                                                .populate('cargo')
                                                .populate('de')
                                                .exec()
            io.emit('SERVER:Contrataciones', Contrataciones)
        }catch(err){
            console.log('Error en la emisión de los trabajadores:', err)
    }}

    socket.on('CLIENTE:Trabajador', async() => {
        try{
            EmitirTrabajador();
        }catch(err){
            console.log('Error no se pudo realizar la llamada a la emisión de trabajadores:', err)
        }
    })

    socket.on('CLIENTE:nuevoTrabajador', async (data) => {
    try {
        if (data._id) {
            const existingWorker = await trabajador.findById(data._id);

            if (existingWorker) {
                const existingContracts = JSON.stringify(existingWorker.contratacion);
                const newContracts = JSON.stringify(data.contratacion);

                if (existingContracts !== newContracts) {
                    // Verificar si ya existe una contratación idéntica
                    const existingContract = await Contratacion.findOne({
                        fecha: data.contratacion.fecha,
                        departamento: data.contratacion.departamento,
                        cargo: data.contratacion.cargo,
                        de: data.contratacion.de,
                        sueldo: data.contratacion.sueldo,
                        trabajador: data._id
                    });

                    if (!existingContract) {
                        // Guardar la nueva contratación en el esquema contrataciones
                        const newContratacion = new Contratacion({
                            fecha: data.contratacion.fecha,
                            departamento: data.contratacion.departamento,
                            cargo: data.contratacion.cargo,
                            de: data.contratacion.de,
                            sueldo: data.contratacion.sueldo,
                            trabajador: data._id
                        });

                        await newContratacion.save();
                    }
                }

                await trabajador.findByIdAndUpdate(data._id, data);
                EmitirTrabajador();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el trabajador', icon: 'info' });
                console.log('Se actualizó un trabajador');
                return;
            }
        } else {
            const Trabajador = new trabajador(data);

            try {
                const savedTrabajador = await Trabajador.save();
                console.log('Se creó el registro nuevo trabajador');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró nuevo trabajador', icon: 'success' });
                EmitirTrabajador();

                // Verificar si ya existe una contratación idéntica
                const existingContract = await Contratacion.findOne({
                    fecha: data.contratacion.fecha,
                    departamento: data.contratacion.departamento,
                    cargo: data.contratacion.cargo,
                    de: data.contratacion.de,
                    sueldo: data.contratacion.sueldo,
                    trabajador: savedTrabajador._id
                });

                if (!existingContract) {
                    // Guardar la contratación en el esquema contrataciones
                    const newContratacion = new Contratacion({
                        fecha: data.contratacion.fecha,
                        departamento: data.contratacion.departamento,
                        cargo: data.contratacion.cargo,
                        de: data.contratacion.de,
                        sueldo: data.contratacion.sueldo,
                        trabajador: savedTrabajador._id
                    });

                    await newContratacion.save();
                }
            } catch (err) {
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se pudo registrar el trabajador', icon: 'error' });
                console.log('Error en el registro del trabajador', err);
            }
        }
    } catch (err) {
        console.log('Error en el registro del trabajador:', err);
    }
});


    socket.on('CLIENTE:EliminarTrabajador', async (data) => {
        try{
            await trabajador.findByIdAndUpdate(data._id, {borrado:true})
            try{
                EmitirTrabajador();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se eliminó el trabajador', icon: 'info' });
            }catch(err){
                console.log(err)
            }
        }catch(err){
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en la eliminación del trabajador', icon: 'error' });
            console.log('Error en la eliminación del trabajador', err)
        }
    })


  })
}