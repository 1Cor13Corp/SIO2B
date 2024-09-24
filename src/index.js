import app from './app';
import { Server as WebSocketServer } from 'socket.io'
import http from 'http';
import {PORT_URI} from './config'

import sockets from './sockets';

import { connectDB } from './db'
connectDB();


const server = http.createServer(app)
const HttpServer = server.listen(PORT_URI || 80)
console.log('Server is listening on port: ',PORT_URI || 80)
const io = new WebSocketServer(HttpServer)

sockets(io)

