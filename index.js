// Import dependencies
//require('./tracing')
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const socketsHandler = require("./routes/socket");
const bodyParser = require('body-parser');
const stoppable = require('stoppable');
const cors = require('cors');
const passport = require("passport");

// Initialize database models and connect.
const { connectDb } = require("./models");
connectDb()

// Define and setup server
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(cors())

// Initialize and configure passport to use session.
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport");

app.use(index);
const server = stoppable(http.createServer(app));
const io = socketIo(server);




// Tell socket.io to use redis adapter if specified
if(process.env.Redis_Hostname){
  if(process.env.Redis_Password){
    const redis = require('redis');
    const redisAdapter = require('socket.io-redis');
    const pub = redis.createClient(6379, process.env.Redis_Hostname, { auth_pass: process.env.Redis_Password });
    const sub = redis.createClient(6379, process.env.Redis_Hostname, { auth_pass: process.env.Redis_Password });
    io.adapter(redisAdapter({ pubClient: pub, subClient: sub }));
  } else {
    var redis = require('socket.io-redis');
    io.adapter(redis({ host: process.env.Redis_Hostname, port: 6379 }));
  }
  
}

// Tell socket events to go to socket handler. Similar to how routes work
io.on("connection", socket => {
  socketsHandler(io, socket)
});

module.exports = server;