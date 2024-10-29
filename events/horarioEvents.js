import horario from '../src/models/horarios';
import Calendario from '../src/models/calendarios';
module.exports = (io) => {

    io.on('connection', (socket) => {
        const EmitirHorarios = async () => {
            try {
                const _horario = await horario.find({ borrado: false })    
                io.emit('SERVER:Horarios', _horario);
            } catch (error) {
            console.error('Ha ocurrido un error al consultar horarios:', error);
            }
        };

        socket.on('CLIENTE:BuscarHorarios', async () => {
            await EmitirHorarios();
        });

        socket.on('CLIENTE:NuevoHorario', async (data) => {
            try {
              let NuevoHorarioGuardado;
          
              if (data._id) {
                // Si existe data._id, actualizar el horario existente
                NuevoHorarioGuardado = await horario.findByIdAndUpdate(data._id, data, { new: true });
                console.log('Horario actualizado', NuevoHorarioGuardado);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Horario actualizado', icon: 'success' });
              } else {
                // Si no existe data._id, crear un nuevo horario
                const NuevoHorario = new horario(data);
                NuevoHorarioGuardado = await NuevoHorario.save();
                console.log('Se registró nuevo horario', NuevoHorarioGuardado);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró nuevo horario', icon: 'success' });
              }
          
              if (data.default) {
                await setDefaultHorario(NuevoHorarioGuardado._id);
              }
          
              await EmitirHorarios();
            } catch (error) {
              console.error('Error en el registro de horario', error);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error en el registro de horario', icon: 'error' });
            }
        });


        async function setDefaultHorario(horarioId) {
            try {
              // Primero, desmarca todos los horarios predeterminados
              await horario.updateMany({ default: true }, { default: false });
          
              // Luego, marca el horario especificado como predeterminado
              await horario.findByIdAndUpdate(horarioId, { default: true });
              console.log(`Horario ${horarioId} marcado como predeterminado`);
            } catch (error) {
              console.error('Error al establecer el horario predeterminado', error);
            }
          }          
          
        
        socket.on('CLIENTE:EliminarHorario', async (data) => {
            try {
              const horarioEliminado = await horario.findByIdAndUpdate(data._id, { borrado: true }, { new: true });
              if (horarioEliminado) {
                console.log('Horario borrado', horarioEliminado);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Horario marcado como borrado', icon: 'success' });
              } else {
                console.log('No se encontró el horario para eliminar');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Horario no encontrado', icon: 'error' });
              }
          
              await EmitirHorarios();
            } catch (error) {
              console.error('Error al marcar horario como borrado', error);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al marcar horario como borrado', icon: 'error' });
            }
        });

        socket.on('CLIENTE:AgregarDiaNoLaboral', async (data) => {
          try {
            const { year, month, day, motivo, laboral } = data; // Incluimos 'laboral' en los datos recibidos
        
            // Verificar si ya existe un calendario para el año
            let calendarioExistente = await Calendario.findOne({ year: year });
        
            if (!calendarioExistente) {
              // Si no existe, crear un nuevo calendario
              calendarioExistente = new Calendario({
                year: year,
                dias: []
              });
            }
        
            // Verificar si el día ya existe en el calendario
            const diaExistente = calendarioExistente.dias.find(dia => dia.month === month && dia.day === day);
        
            if (!diaExistente) {
              // Si el día no existe, agregarlo como no laboral
              calendarioExistente.dias.push({
                month,
                day,
                year,
                motivo,
                laboral: false // Marcar como no laboral
              });
        
              await calendarioExistente.save(); // Guardar el calendario (nuevo o existente)
              console.log('Se registró nuevo día no laboral', calendarioExistente);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se registró nuevo día no laboral', icon: 'success' });
            } else {
              // Si el día ya existe, verificar si es laboral o no
              if (laboral) {
                // Si el día existe y ahora se quiere marcar como laboral, lo eliminamos
                calendarioExistente.dias = calendarioExistente.dias.filter(dia => !(dia.month === month && dia.day === day));
                await calendarioExistente.save();
                console.log('Se eliminó el día no laboral', calendarioExistente);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'El día ha sido marcado como laboral', icon: 'success' });
              } else {
                // Si el día ya existe y no es laboral, actualizar el motivo si es necesario
                diaExistente.motivo = motivo;
                diaExistente.laboral = false; // Asegurarnos de que sigue siendo no laboral
                await calendarioExistente.save();
                console.log('Se actualizó el motivo del día no laboral', calendarioExistente);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizó el motivo del día no laboral', icon: 'success' });
              }
            }
        
            EmitirCalendarios(); // Emitir la actualización del calendario a todos los clientes
          } catch (error) {
            console.error('Error al agregar día no laboral', error);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al agregar día no laboral', icon: 'error' });
          }
        });
        

        async function EmitirCalendarios() {
        try {
            const calendarios = await Calendario.find({ borrado: false });
            io.emit('SERVIDOR:EmitirCalendarios', calendarios);
        } catch (error) {
            console.error('Error al emitir calendarios', error);
        }
        }

        socket.on('CLIENTE:emitirCalendarios', async() =>{
          try {
            EmitirCalendarios()
          }catch(err){
            console.log('error al buscar dias no laborales')
          }
        })

        socket.on('CLIENTE:ActualizarDia', async (data) => {
            try {
              const { month, day, year, motivo, laboral } = data;
              
              await calendario.findOneAndUpdate(
                { year },
                { $pull: { dias: { month, day } } } // Eliminar el día si ya existe
              );
          
              const updatedCalendario = await calendario.findOneAndUpdate(
                { year },
                { $push: { dias: { month, day, motivo, year, laboral } } },
                { new: true, upsert: true } // Crear el documento si no existe
              );
          
              console.log('Día actualizado', updatedCalendario);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Día actualizado', icon: 'success' });
              await EmitirCalendarios();
            } catch (error) {
              console.error('Error al actualizar el día', error);
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al actualizar el día', icon: 'error' });
            }
        });

    })
}