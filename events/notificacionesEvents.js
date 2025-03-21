import Notificacion from "../src/models/notificaciones";
import Usuario from "../src/models/usuario"; // Asegúrate de tener un modelo de Usuario

// Función para emitir notificaciones a los usuarios que no la han visto
const EmitirNotificacionAUsuarios = async (io, notificacionId) => {
    try {
        const notificacion = await Notificacion.findById(notificacionId);
        if (!notificacion) return;

        const usuariosVistos = notificacion.usuarios_vistos || [];
        const usuarios = await Usuario.find({ _id: { $nin: usuariosVistos } });

        for (const usuario of usuarios) {
            const notificacionesNoVistas = await Notificacion.find({ 
                usuarios_vistos: { $ne: usuario._id }
            });

            io.to(usuario._id.toString()).emit("SERVER:Notificaciones", notificacionesNoVistas);
        }
    } catch (err) {
        console.log("Error al emitir la notificación a los usuarios", err);
    }
};

// ✅ Exportar la función para guardar notificaciones
export const GuardarNotificacion = async (io, notificacionData) => {
    try {
        const nuevaNotificacion = new Notificacion(notificacionData);
        await nuevaNotificacion.save();

        await EmitirNotificacionAUsuarios(io, nuevaNotificacion._id);
    } catch (err) {
        console.log("Error al guardar la notificación:", err);
    }
};

// ✅ Exportar la configuración de eventos de socket
export default function configureNotifications(io) {
    io.on("connection", (socket) => {
        socket.on("CLIENTE:SolicitarNotificaciones", async (userId) => {
            try {
                if (userId) {
                    socket.join(userId);
                    console.log(`Usuario ${userId} unido a la sala.`);
                }
                const notificaciones = await Notificacion.find({ "usuarios_vistos": { $ne: userId } });
                socket.emit("SERVER:Notificaciones", notificaciones);
            } catch (err) {
                console.log("Error al enviar notificaciones:", err);
            }
        });

        socket.on("CLIENTE:NotificacionVista", async ({ userId, notificacionId }) => {
            try {
                await Notificacion.findByIdAndUpdate(notificacionId, { $addToSet: { usuarios_vistos: userId } });
                await EmitirNotificacionAUsuarios(io, notificacionId);
            } catch (err) {
                console.log("Error al marcar notificación como vista:", err);
            }
        });

        socket.on("CLIENTE:GuardarNotificacion", async (notificacionData) => {
            await GuardarNotificacion(io, notificacionData);
        });

        socket.on("disconnect", () => {
            console.log("Usuario desconectado:", socket.id);
        });
    });
}
