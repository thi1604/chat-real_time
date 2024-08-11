const express = require("express"); // Nhung express 
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
require('dotenv').config(); // Cau hinh file .env
const cookieParser = require('cookie-parser');
const database = require("./config/database.js");
database.connect();

const routeClient = require("./routes/client/index.route.js"); //Nhung folder route va di toi route cua trang client

app.use(express.static(`${__dirname}/public`)); // Nhung folder FE vao project
app.use(cookieParser('ThiBeo'));
app.set('views', `${__dirname}/views`); // Nhung folder views vao project
app.set('views engine', 'pug'); // Khai bao type template engine

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false })); //Su dung cho form

//Nhung cac phuong thuc khac cho form(mac dinh form co get va post)
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
//End nhung cac phuong thuc khac cho form(mac dinh form co get va post)


global._io = io;

routeClient.index(app);

server.listen(3000, () => {
  console.log('listening on *:3000');
});
