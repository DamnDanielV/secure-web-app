const express = require('express')
const bcrypt = require('bcrypt');
const _ = require('underscore')

//esquema Usuario
const Usuario = require('../models/user.model')

//middleware verifica token

const { verifyToken, verifyRole } = require('../middlewares/users.middleware')

const app = express();

app.get('/user', verifyToken, (req, res) => {

    // return res.json({
    //     usuario: req.usuario,
    //     name: req.usuario.name
    // })

    let desde = req.query.desde || 0;
    desde = Number(desde)
    let limite = req.query.limite || 5;
    limite = Number(limite)

    Usuario.find({state:true}, 'email name role state')
    .skip(desde) //desde que  registro se mostrará al usuario
    .limit(limite) // cuantos registro por consulta (pagina)
    .exec((err, usu) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        Usuario.countDocuments({state:true}, (err, cont) => {
            res.json(
                {
                    contador: cont,
                    usuarios: usu
                }
            )
    
        })
    })
    
  })
  
app.post('/user', (req, res) => {
    let body = req.body;    

    let usuario = new Usuario({
        name: body.name,
        password: bcrypt.hashSync(body.password, 10 ),  
        email: body.email,
        role: body.role
    })

    usuario.save((err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({usuarioDb})
    })
})

app.put('/user/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id; //akjfakhjaabsdjahb pinche errooorrrr media hora en esto!!!!
    let body = req.body;
    body = _.pick(body, 'name', 'email', 'role') // NO SE PODRAN MODIFICAR CAMPOS SENSIBLES POR METODOS PUT

    Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json({usuarioDb})
    })
})

app.delete('/user/:id', [verifyToken, verifyRole], verifyToken, (req, res) => {

    Usuario.findByIdAndUpdate(req.params.id, {state: false}, {new: true}, (err, usuUpdated) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        res.json(
            {
                ok: true,
                usuUpdated
            })
    })










    // Usuario.findByIdAndDelete(req.params.id, (err, usuarioELimi) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: err
    //         })
    //     }
    //     if (!usuarioELimi) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: "usuario no existe"
    //         })
    //     }
    //     res.json(
    //         {
    //             ok:true,
    //             usuario: usuarioELimi
    //         }
    //     )
    // })


})

module.exports = app;
  