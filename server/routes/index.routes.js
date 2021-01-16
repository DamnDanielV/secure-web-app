//definicion de las rutas de la aplicacion

const express = require('express')

const app =  express();

app.use(require('./users.routes'))

app.use(require('./login.routes'))

app.use(require('./categories.routes'))

app.use(require('./products.routes'))

module.exports = app;