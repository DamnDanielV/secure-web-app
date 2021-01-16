const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

const app = express();

const Usuario =  require('../models/user.model')

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({email:body.email}, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            })
        }

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            })
        }

        let token = jwt.sign(
            { usuario: userDB },
            process.env.SEED,
            { expiresIn: process.env.TOKEN_C }
            )
        res.json({
            ok:true,
            usuario: userDB,
            token
        })
    
    })
})

//configuracuiones de google
//verify, verifica la utenticidad de un token y obtiene el payload del token que contiene informacion del usuario de ggogle
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //retorna un objeto con las propiedades del payload del token de google
    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
  }

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let usuarioGoogle = await verify(token) // usuarioGoogle tendrá toda la informacion del usuario de google
        .catch( err => {
            return res.status(403).json({
                ok: false,
                error: err
            })
        })

    //verificacion del usuario en la abse de datos

    Usuario.findOne({email:usuarioGoogle.email}, (err, usuarioDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (usuarioDb) {
            if (usuarioDb.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Correo ya registrado"
                    }
                })
                
            } else {

                let token = jwt.sign(
                    { usuario: usuarioDb },
                    process.env.SEED,
                    { expiresIn: process.env.TOKEN_C }
                    )
                return res.json({
                    ok:true,
                    usuario: usuarioDb,
                    token
                })
            }

            
        } else {
            //si el usuario no existe en la base de datos
            let usuario = new Usuario();
            usuario.email = usuarioGoogle.email
            usuario.name = usuarioGoogle.name
            usuario.img = usuarioGoogle.picture
            usuario.google = true
            usuario.password = ':)' // no es necesaria la contraseña si se autentica con google 
                                    // sin embargo es necesario enviar una para pasar la validacion del backend server
            
            usuario.save((err, usuarioDb) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }
                    let token = jwt.sign(
                        { usuario: usuarioDb },
                        process.env.SEED,
                        { expiresIn: process.env.TOKEN_C }
                        )
                    return res.json({
                        ok:true,
                        usuario: usuarioDb,
                        token
                    })
    
                

            })
        }
    })

})

module.exports = app;