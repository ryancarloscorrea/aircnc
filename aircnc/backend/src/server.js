const express = require ('express');
const mongoose = require ('mongoose');
const routes = require ('./routes');
const cors = require ('cors');
const path = require ('path');

const socketio = require ('socket.io');
const http = require ('http');


const app = express();
const server = http.Server(app);
const io = socketio(server);

const connectedUsers = {};


mongoose.connect ('mongodb://ryancarlos:ryancarlos@oministack-shard-00-00-fpjhi.mongodb.net:27017,oministack-shard-00-01-fpjhi.mongodb.net:27017,oministack-shard-00-02-fpjhi.mongodb.net:27017/oministack9?ssl=true&replicaSet=OminiStack-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    
})

io.on ('connection', socket => {

    const {user_id} = socket.handshake.query;

    connectedUsers [user_id] = socket.id;
})

app.use ((req, res, next) => {
    req.io = io;
    req.connectedUsers = connectedUsers;

    return next();
})
//req.query : acessar query paranspara filtrar
//req.params : acessar route params  para editar e deletar
//req.body : acessar corpo da requisicao
app.use (cors());
app.use(express.json());
app.use ('/files', express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(routes);

server.listen(3333); 