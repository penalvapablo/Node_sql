const express = require('express');
const moment = require('moment');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const cors = require('cors');
const { config } = require('./config');
const { mysql, sqlite } = require('./config/db.js');
const Inventory_db = require('./utils/clases/Inventory_db');
const inventory = new Inventory_db(mysql, 'productos');
const ChatStorage = require('./utils/clases/ChatStorage_db')
const chat = new ChatStorage(sqlite, 'mensajes')
// Creo la tabla 'productos' en la base de datos si no existía
inventory.start()
// Creo la table 'mensajes' en la base de datos si no existía
chat.start()

// Initializations
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(cors(`${config.cors}`));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


/* SOCKETS */
io.on('connection', async (socket) => {
  console.log('nuevo cliente conectado');

  socket.emit('products', await inventory.getProducts());

  socket.emit('messages', await chat.read());

  socket.on('productAdd', async (data) => {
    const { title, price, thumbnail } = data;
    await inventory.addProduct(title, price, thumbnail);
    const productos = await inventory.getProducts();
    io.sockets.emit('products', productos);
  });

  socket.on('message', async (data) => {
    const { author, message } = data;
    const newMessage = {author, message, date: moment(new Date()).format('DD/MM/YYY HH:mm:ss')}
    await chat.save(newMessage.author, newMessage.message, newMessage.date)
    io.sockets.emit('messages', await chat.read());
  });
});
/* SOCKETS */

const server = httpServer.listen(config.port, () => {
  console.log(
    `Servidor inicializado en el puerto ${config.port}.`
  );
});

server.on('error', () => {
  console.log('Error del servidor.');
});
