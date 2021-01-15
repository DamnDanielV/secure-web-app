//definicion de las rutas de la aplicacion

const express = require('express')

const app =  express();

app.use(require('./users.routes'))

app.use(require('./login.routes'))

module.exports = app;