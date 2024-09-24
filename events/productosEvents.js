import producto from '../src/models/producto';
import HistorialCambios from '../src/models/historial-cambios';
const _ = require('lodash');

module.exports = (io) => {
  io.on('connection', (socket) => {

    // const obtenerDiferencias = async(obj1, obj2) => {
    //     function cambios(objetoBase, objetoComparar) {
    //       function cambiosInternos(base, comparar, ruta = '') {
    //         return _.transform(base, (resultado, valor, clave) => {
    //           const valorComparar = comparar[clave];
    //           const rutaActual = ruta ? `${ruta}.${clave}` : clave;
      
    //           if (!_.isEqual(valor, valorComparar)) {
    //             resultado[rutaActual] = _.isObject(valor) && _.isObject(valorComparar) ?
    //               cambiosInternos(valor, valorComparar, rutaActual) : { original: valor, nuevo: valorComparar };
    //           }
    //         });
    //       }
      
    //       return cambiosInternos(objetoBase, objetoComparar);
    //     }
      
    //     return cambios(obj1, obj2);
    //   }
      
    const emitirProductos = async () =>{
        try {
            const Producto = await producto.find({borrado:false})
                                                .populate('identificacion.cliente identificacion.categoria materia_prima.sustrato materia_prima.tintas.tinta materia_prima.barnices.barniz pre_impresion.tamano_sustrato.montajes pre_impresion.tamano_sustrato.margenes pre_impresion.plancha impresion.impresoras impresion.pinzas post_impresion.troqueladora post_impresion.guillotina post_impresion.pegadora post_impresion.pegamento.pega post_impresion.caja')
                                                .populate({
                                                    path: 'materia_prima.sustrato',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .populate({
                                                    path: 'materia_prima.barnices.barniz',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .populate({
                                                    path: 'materia_prima.tintas.tinta',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .populate({
                                                    path: 'impresion.fuentes',
                                                    populate: 'fabricante grupo especificacion especificacion2'
                                                })
                                                .exec()
            io.emit('SERVER:producto', Producto)
            const Historiales = await HistorialCambios.find()
            io.emit('SERVER:historial', Historiales)
        } catch (error) {
            console.error('Error al buscar productos:', error)
        }
    }
    socket.on('CLIENTE:buscarProducto', async() => {
        try{
            await emitirProductos()
        }catch(err){
            console.error('No se pudo realizar la busqueda de las productos')
        }
    })

    // function diffObjects(obj1, obj2) {
    //     const diff = {};
    //     for (let key in obj1) {
    //         if (obj1[key] !== obj2[key]) {
    //             if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
    //                 // Comparar objetos anidados recursivamente
    //                 const nestedDiff = diffObjects(obj1[key], obj2[key]);
    //                 if (Object.keys(nestedDiff).length > 0) {
    //                     diff[key] = nestedDiff;
    //                 }
    //             } else {
    //                 diff[key] = obj1[key];
    //             }
    //         }
    //     }
    //     return diff;
    // }

    function deepEqual(a, b) {
        if (a === b) return true; // Los valores son estrictamente iguales
    
        if (typeof a === 'object' && typeof b === 'object' && a !== null && b !== null) {
            const keysA = Object.keys(a);
            const keysB = Object.keys(b);
    
            if (keysA.length !== keysB.length) return false; // Diferente número de propiedades
    
            // Comparar cada propiedad de ambos objetos
            for (let key of keysA) {
                if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
                    return false; // Propiedad no coincide o su valor no es igual
                }
            }
    
            return true; // Los objetos son iguales
        }
    
        return false; // No son iguales
    }
    

    socket.on('CLIENTE:nuevoProducto', async (data) => {
        try {
            if (data._id) {
                const existingProducto = await producto.findById(data._id);
                if (existingProducto) {
    
                    const cambios = {};
    
                    // Recorrer y comparar las claves del objeto `identificacion`
                    for (let key in data.identificacion) {
                        if (!deepEqual(data.identificacion[key], existingProducto.identificacion[key])) {
                            // Guardar solo si hay cambios reales
                            const safeKey = `identificacion_${key}`;
                            cambios[safeKey] = `De: ${existingProducto.identificacion[key]} A: ${data.identificacion[key]}`;
                        }
                    }
    
                    // Comparar las demás secciones (ejemplo: dimensiones, materia_prima, etc.)
                    for (let section in data) {
                        if (section !== 'identificacion' && section !== '_id' && typeof data[section] === 'object') {
                            for (let key in data[section]) {
                                // Comprobar si el valor ha cambiado realmente
                                if (!deepEqual(data[section][key], existingProducto[section][key])) {
                                    const safeKey = `${section}_${key}`;
                                    cambios[safeKey] = `De: ${JSON.stringify(existingProducto[section][key])} A: ${JSON.stringify(data[section][key])}`;
                                }
                            }
                        }
                    }
    
                    // Si hay cambios, guardarlos en el historial
                    if (Object.keys(cambios).length > 0) {
                        const nuevoHistorial = new HistorialCambios({
                            producto: data._id,
                            fechaCambio:Date.now(),
                            cambios
                        });
                        await nuevoHistorial.save();
                    }
    
                    // Actualizar el producto
                    await producto.findByIdAndUpdate(data._id, data);
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Producto actualizado correctamente', icon: 'success' });
                } else {
                    socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'No se encontró ningún producto con el ID proporcionado', icon: 'warning' });
                }
            } else {
                const newProducto = new producto(data);
                await newProducto.save();
                socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Producto creado correctamente', icon: 'success' });
            }
            emitirProductos();
        } catch (err) {
            console.error('Error al procesar el producto:', err);
            socket.emit('SERVIDOR:enviaMensaje', { mensaje: 'Error al procesar el producto', icon: 'error' });
        }
    });
    
    
    
    
    




  })
}