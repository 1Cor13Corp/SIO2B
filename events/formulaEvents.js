import formula from "../src/models/formulas"
module.exports = (io) => {
    io.on('connection', (socket) => {
        const emitirFormulas = async () =>{
            try {
                const Formula = await formula.find({borrado:false})
                                                .populate('formula.material')
                                                    .exec()
                io.emit('SERVER:formula', Formula)
            } catch (error) {
                console.error('Error al buscar formulas:', error)
            }
        }
        socket.on('CLIENTE:buscarFormula', async() => {
            try{
                await emitirFormulas()
            }catch(err){
                console.error('No se pudo realizar la busqueda de las formulas')
            }
        })
        
        // CREAR FORMULA
        socket.on('CLIENTE:nuevaFormula', async (data) => {
    // Verificar si los datos requeridos están completos
    if (!data.pantone) {
        console.log('Faltan datos requeridos para crear la fase');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Faltan datos requeridos para crear la fase', icon: 'warning' });
    } else {
        if (data._id) {
            try {
                const existingFormula = await formula.findById(data._id);
                if (existingFormula) {
                    // Modificar los campos de la fórmula existente con los nuevos datos
                    Object.assign(existingFormula, data);
                    await existingFormula.save();
                    console.log('Se actualizó la fórmula existente');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó la fórmula existente', icon: 'success' });
                    emitirFormulas();
                } else {
                    console.log('No se encontró la fórmula con el ID proporcionado');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se encontró la fórmula con el ID proporcionado', icon: 'error' });
                }
            } catch (err) {
                console.error('Hubo un error en la actualización de la fórmula:', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en la actualización de la fórmula', icon: 'error' });
            }
        } else {
            // Crear una nueva instancia de formula sin modificar los datos originales
                const newData = { ...data }; // Realizar una copia de los datos
                delete newData._id; // Eliminar el campo _id de la copia de los datos

                const NuevaNota = new formula(newData);
            try {
                await NuevaNota.save();
                console.log('Se registró nueva fórmula');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró nueva fórmula', icon: 'success' });
                emitirFormulas();
            } catch (err) {
                console.error('Hubo un error en la creación de fase:', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro de la fórmula', icon: 'error' });
            }
        }
    }
});

    })
}