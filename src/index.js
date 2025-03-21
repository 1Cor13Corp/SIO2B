import app from './app';
import { Server as WebSocketServer } from 'socket.io'
import https from 'https';
import {PORT_URI} from './config'
import fs from 'fs';

import sockets from './sockets';
import cors from 'cors'; // Importar el middleware CORS

import { connectDB } from './db'
connectDB();

const privateKey = fs.readFileSync('c:/certificado/server/server.key', 'utf8');
const certificate = fs.readFileSync('c:/certificado/server/server.crt', 'utf8');
const ca = fs.readFileSync('c:/certificado/ca/mi_ca.pem', 'utf8');

const credentials = { 
  key: privateKey, 
  cert: certificate,
  ca: ca,
  requestCert: false,
  rejectUnauthorized: false
};

// Habilitar CORS para todos los orígenes (permitir todos los orígenes)
app.use(cors({
    origin: '*', // Permite todos los orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Permite estos métodos
    allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
    credentials: true, // Permite credenciales como cookies (opcional)
  }));

const server = https.createServer(credentials, app)
const HttpServer = server.listen(PORT_URI || 443)
console.log('Server is listening on port: ',PORT_URI || 443)
const io = new WebSocketServer(HttpServer)
const webPush = require('web-push');
const vapidConfig = require('./Keys/VapidKey');


// Configurar web-push con las claves VAPID
webPush.setVapidDetails(
  'mailto:calcurianandres@gmail.com', // Cambia por un correo válido
  vapidConfig.publicKey,
  vapidConfig.privateKey
);

sockets(io)

