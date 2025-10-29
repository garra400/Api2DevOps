var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require("mongoose");

require("dotenv").config(); // Lê as variáveis do arquivo .env

const { MONGO_URL } = process.env;

// Configurando conexão com MongoDB
mongoose.connect(MONGO_URL, {
    minPoolSize: 10,
    socketTimeoutMS: 60000
})
    .then(() => {
        console.log("Conectado ao MongoDB! Aeeeee!");
    })
    .catch(error => {
        console.log("Deu zica na conexão!!!\n");
        console.log(error);
    })

// Rotas usadas
var indexRouter = require('./routes/index');
var sensorDatasRouter = require('./routes/sensorDatas');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Rotas
app.use('/', indexRouter);
app.use('/sensors', sensorDatasRouter);

module.exports = app;

// OBS: Link para testar localhost:3000
// Usar npm start dev ou npm run start para rodar 