// express
const express = require('express')
const app = express()


const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//config file
require('./config/config')

const port = process.env.PORT

app.get('/user', (req, res) => {
  res.json('get user')
})

app.post('/user/:id', (req, res) => {
    let id =  req.params.id
    let body = req.body;
    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: "name is neccesary"
        })
    } else {
        res.json({
            usuario:body,
            id
        })
    }
})

app.put('/user', (req, res) => {
    res.json('put user')
})

app.delete('/user', (req, res) => {
    res.json('delete user')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})