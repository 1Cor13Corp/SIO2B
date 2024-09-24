import AnalisisTinta from "../src/models/analisis-tinta";
import AnalisisSustrato from "../src/models/analisis-sustrato"
import AnalisisCajas from "../src/models/analisis-cajas";
import AnalisisPads from "../src/models/analisis-pads";
import AnalisisOtros from "../src/models/analisis-otros";
import recepcion from "../src/models/recepcion";

module.exports = (io) => {
    io.on('connection', (socket) => {

        const LastFives = async() => {
          // Realiza consultas en cada esquema para obtener las últimas 5 entradas
          Promise.all([
            AnalisisTinta.find().sort({ updateddAt: -1 }).limit(5),
            AnalisisSustrato.find().sort({ updateddAt: -1 }).limit(5),
            AnalisisCajas.find().sort({ updateddAt: -1 }).limit(5),
            AnalisisPads.find().sort({ updateddAt: -1 }).limit(5),
            AnalisisOtros.find().sort({ updateddAt: -1 }).limit(5)
          ])
          .then(results => {
            // Combina los resultados de los 5 esquemas
            const combinedResults = results.reduce((acc, curr) => acc.concat(curr), []);
            // Ordena los resultados combinados por fecha en orden descendente
            combinedResults.sort((a, b) => b.createdAt - a.createdAt);
            io.emit('SERVER:TopFive', combinedResults.slice(0, 5))
          })
          .catch(error => {
            console.error(error);
          });
        }
        
        const EmitirAnalisisTinta = async() => {
            try{
              const AnalisisTinta_ = await AnalisisTinta.find().exec()
              io.emit('SERVER:AnalisisTinta', AnalisisTinta_)
            }catch(err){
                console.error('Error al buscar analisis:', err)
            }
        }

        socket.on('CLIENTE:BuscarAnalisisTinta', async()=>{
            try {
                await EmitirAnalisisTinta()
              } catch (err) {
                console.error('No se pudo realizar la busqueda del almacen', err)
              }
        })

        socket.on('CLIENTE:AnalisisTinta', async (data) => {
            // Verificar si los datos requeridos están completos
            const NuevoAnalisis = new AnalisisTinta(data.data);
            const doc = await AnalisisTinta.findOne({ _id: data.data._id });
            if (doc) {
                try{

                    await AnalisisTinta.findByIdAndUpdate(data.data._id, data.data);
                    console.log('Se actualizo nuevo analisis');
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
                    EmitirAnalisisTinta();
                    return;  
                }catch(err){
                    console.log('Error en actualizacion de analisis',err);
                    return
                }
            }else{
              try {
                await NuevoAnalisis.save();
                const reception = await recepcion.findOne({ _id: data.recepcion._id });
                reception.materiales[data.index].forEach((material) => {
                  material.analisis = NuevoAnalisis._id;
                });
                await reception.save();
                console.log('Se realizó nuevo analisis');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
              } catch (err) {
                console.error('Hubo un error en el registro del analisis:', err);
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
              }
            }
            EmitirAnalisisTinta();
          });

          const EmitirAnalisisSustrato = async() => {
            try{
                const AnalisisSustrato_ = await AnalisisSustrato.find().exec()
                io.emit('SERVER:AnalisisSustrato', AnalisisSustrato_)
            }catch(err){
                console.error('Error al buscar analisis:', err)
            }
        }

        socket.on('CLIENTE:BuscarAnalisisSustrato', async()=>{
            try {
                await EmitirAnalisisSustrato()
              } catch (err) {
                console.error('No se pudo realizar la busqueda del analisis', err)
              }
        })

        socket.on('CLIENTE:AnalisisSustrato', async (data) => {
          // Verificar si los datos requeridos están completos
          const NuevoAnalisis = new AnalisisSustrato(data.data);
          const doc = await AnalisisSustrato.findOne({ _id: data.data._id });
          if (doc) {
              try{

                  await AnalisisSustrato.findByIdAndUpdate(data.data._id, data.data);
                  console.log('Se actualizo nuevo analisis de Sustrato');
                  socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
                  EmitirAnalisisSustrato()
                  return;  
              }catch(err){
                  console.log('Error en actualizacion de analisis');
                  return
              }
          }
          try {
            await NuevoAnalisis.save();
            const reception = await recepcion.findOne({ _id: data.recepcion._id });
            reception.materiales[data.index].forEach((material) => {
              material.analisis = NuevoAnalisis._id;
            });
            await reception.save();
            console.log('Se realizó nuevo analisis de Sustrato');
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
          } catch (err) {
            console.error('Hubo un error en el registro del analisis:', err);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
          }
          EmitirAnalisisSustrato()
        });

        // ANALISIS CAJAS
        const EmitirAnalisisCajas= async() => {
          try{
              const AnalisisCajas_ = await AnalisisCajas.find()
                                                        .exec()
              io.emit('SERVER:AnalisisCajas', AnalisisCajas_)
          }catch(err){
              console.error('Error al buscar analisis:', err)
          }
      }

      socket.on('CLIENTE:BuscarAnalisisCajas', async()=>{
        try {
            await EmitirAnalisisCajas()
          } catch (err) {
            console.error('No se pudo realizar la busqueda del analisis', err)
          }
    })

      socket.on('CLIENTE:AnalisisCajas', async (data) => {
        // Verificar si los datos requeridos están completos
        const NuevoAnalisis = new AnalisisCajas(data.data);
        const doc = await AnalisisCajas.findOne({ _id: data.data._id });
        if (doc) {
            try{

                await AnalisisCajas.findByIdAndUpdate(data.data._id, data.data);
                console.log('Se actualizo nuevo analisis de Cajas');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
                EmitirAnalisisCajas()
                return;  
            }catch(err){
                console.log('Error en actualizacion de analisis');
                return
            }
        }
        try {
          await NuevoAnalisis.save();
          const reception = await recepcion.findOne({ _id: data.recepcion._id });
          reception.materiales[data.index].forEach((material) => {
            material.analisis = NuevoAnalisis._id;
          });
          await reception.save();
          console.log('Se realizó nuevo analisis de Cajas');
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
        } catch (err) {
          console.error('Hubo un error en el registro del analisis:', err);
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
        }
        EmitirAnalisisCajas()
      });

      // ANALISIS PADS
       const EmitirAnalisisPads= async() => {
        try{
            const AnalisisPads_ = await AnalisisPads.find().exec()
            io.emit('SERVER:AnalisisPads', AnalisisPads_)
        }catch(err){
            console.error('Error al buscar analisis:', err)
        }
    }

    socket.on('CLIENTE:BuscarAnalisisPads', async()=>{
      try {
          await EmitirAnalisisPads()
        } catch (err) {
          console.error('No se pudo realizar la busqueda del analisis', err)
        }
  })

    socket.on('CLIENTE:AnalisisPads', async (data) => {
      // Verificar si los datos requeridos están completos
      const NuevoAnalisis = new AnalisisPads(data.data);
      const doc = await AnalisisPads.findOne({ _id: data.data._id });
      if (doc) {
          try{

              await AnalisisPads.findByIdAndUpdate(data.data._id, data.data);
              console.log('Se actualizo nuevo analisis de Pads');
              socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
              EmitirAnalisisPads()
              return;  
          }catch(err){
              console.log('Error en actualizacion de analisis');
              return
          }
      }
      try {
        await NuevoAnalisis.save();
        const reception = await recepcion.findOne({ _id: data.recepcion._id });
        reception.materiales[data.index].forEach((material) => {
          material.analisis = NuevoAnalisis._id;
        });
        await reception.save();
        console.log('Se realizó nuevo analisis de Pads');
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
      } catch (err) {
        console.error('Hubo un error en el registro del analisis:', err);
        socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
      }
      EmitirAnalisisPads()
    });

         // ANALISIS Otros
         const EmitirAnalisisOtros= async() => {
          try{
              const AnalisisOtros_ = await AnalisisOtros.find().exec()
              io.emit('SERVER:AnalisisOtros', AnalisisOtros_)
          }catch(err){
              console.error('Error al buscar analisis:', err)
          }
      }
  
      socket.on('CLIENTE:BuscarAnalisisOtros', async()=>{
        try {
            await EmitirAnalisisOtros()
          } catch (err) {
            console.error('No se pudo realizar la busqueda del analisis', err)
          }
    })
  
      socket.on('CLIENTE:AnalisisOtros', async (data) => {
        // Verificar si los datos requeridos están completos
        const NuevoAnalisis = new AnalisisOtros(data.data);
        const doc = await AnalisisOtros.findOne({ _id: data.data._id });
        if (doc) {
            try{
  
                await AnalisisOtros.findByIdAndUpdate(data.data._id, data.data);
                console.log('Se actualizo nuevo analisis de Otros');
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se actualizo analisis', icon: 'success' });
                EmitirAnalisisOtros()
                return;  
            }catch(err){
                console.log('Error en actualizacion de analisis');
                return
            }
        }
        try {
          await NuevoAnalisis.save();
          const reception = await recepcion.findOne({ _id: data.recepcion._id });
          reception.materiales[data.index].forEach((material) => {
            material.analisis = NuevoAnalisis._id;
          });
          await reception.save();
          console.log('Se realizó nuevo analisis de Otros');
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Se realizó nuevo analisis', icon: 'success' });
        } catch (err) {
          console.error('Hubo un error en el registro del analisis:', err);
          socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Hubo un error en el registro del analisis', icon: 'error' });
        }
        EmitirAnalisisOtros()
      });
  

    })  
}