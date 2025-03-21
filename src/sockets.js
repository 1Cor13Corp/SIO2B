import fs from 'fs';
import path from 'path';

export default function configureEvents(io) {
    const eventsPath = path.join(__dirname, '../events'); // Ruta de la carpeta donde están los eventos
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('Events.js'));

    eventFiles.forEach(file => {
        import(path.join(eventsPath, file)).then(module => {
            module.default(io); // Llama a la función exportada por cada módulo
        }).catch(err => console.error(`Error al cargar ${file}:`, err));
    });
}
