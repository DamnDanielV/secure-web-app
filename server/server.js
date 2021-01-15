// express
const express = require('express')
const app = express()

//body parser
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//mongoose

const mongoose = require('mongoose')

//rutas
app.use(require('./routes/index.routes'))

//config file
require('./config/config')

const port = process.env.PORT

const DbUrl = process.env.URLDB


mongoose.connect(DbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex:true
    
}, (err, res) => {
    if (err) throw err;
    console.log('conexion establecida')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})