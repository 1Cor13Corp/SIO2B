
import devoluciones from "../src/models/devoluciones"
import { GuardarNotificacion } from "./notificacionesEvents"

module.exports = (io) => {
    io.on("connection", (socket) => {

        let EmitirDevoluciones = async() => {

            try{
                const Devoluciones = await devoluciones.find({ borrado: false })
                                                        .populate('op')
                                                        .populate({
                                                            path: 'material.material',
                                                            populate: { path: 'material' } // Aquí haces populate de material.material.material
                                                        })
                                                        .exec();
                io.emit('SERVER:devoluciones', Devoluciones)
            }catch(err){
                console.log('Error al emitir devolucion', err)
            }
        }

        socket.on('CLIENTE:Devoluciones', async() =>{
            try{
                EmitirDevoluciones();
            }catch(err){    
                console.log('ERROR AL BUSCAR DEVOLUCIONES', err)
            }
        }) 

        // Guardar una nueva devolucion y emitirla
            socket.on("CLIENTE:NuevaDevolucion", async (data) => {
              try {
                // Crear y guardar la nueva devolucion
                const nuevaDevolucion = new devoluciones(data);
                await nuevaDevolucion.save();
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nueva devolución', icon: 'success' });


                     // 📌 Llamar la función de guardar notificación
                await GuardarNotificacion(io, {
                    titulo: 'Devolución de material',
                    mensaje: 'Se realizó una devolución de material',
                    devolucion: nuevaDevolucion._id
                });

                // Emitir la notificación a todos los usuarios menos a los que la han visto
                await EmitirDevoluciones();
              } catch (err) {
                console.log("Error al guardar la devolucion:", err);
              }
            });
        

    })
}