import grupoEvents from '../events/grupoEvents';
import proveedorEvents  from '../events/proveedorEvents'
import fabricanteEvents  from '../events/fabricanteEvents'
import materialEvents from '../events/materialEvents'
import recepcionEvents from '../events/recepcionEvents'
import especificacionEvents from '../events/especificacionEvents';
import almacenEvents from '../events/almacenEvents';
import analisisEvents from '../events/analisisEvents';
import fasesEvents from '../events/fasesEvents';
import maquinasEvents from '../events/maquinasEvents';
import clienteEvents from '../events/clienteEvents';
import categoriaEvents from '../events/categoriaEvents';
import defectoEvents from '../events/defectoEvents';
import formulaEvents from '../events/formulaEvents';
import productoEvents from '../events/productosEvents';
import opoligraficaEvents from '../events/opoligraficaEvents';
import ocompraEvents from '../events/ocompraEvents';
import departamentoEvents from '../events/departamentoEvents';
import cargoEvents from '../events/cargoEvents';
import trabajadorEvents from '../events/trabajadorEvents'

export default function configureEvents(io) {
    grupoEvents(io);
    proveedorEvents(io)
    fabricanteEvents(io)
    materialEvents(io)
    recepcionEvents(io)
    especificacionEvents(io)
    almacenEvents(io)
    analisisEvents(io)
    fasesEvents(io)
    maquinasEvents(io)
    clienteEvents(io)
    categoriaEvents(io)
    defectoEvents(io)
    formulaEvents(io)
    productoEvents(io)
    opoligraficaEvents(io)
    ocompraEvents(io)
    departamentoEvents(io)
    cargoEvents(io)
    trabajadorEvents(io)
}