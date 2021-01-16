const express = require('express');

const { verifyToken } =  require('../middlewares/users.middleware')

let Producto = require('../models/product.model')

const app = express();

app.get('/productos', verifyToken, (req, res) => {
    Producto.find({disponible: true})
    .skip(Number(req.query.desde) || 0)
    .limit(Number(req.query.limite) || 5)
    .populate('categoria', 'description')
    .populate('usuario', 'name email')
    .exec((err, listProducts) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }
        Producto.countDocuments({disponible:true}, (err, countPro) => {
            res.json(
                {
                    contador: countPro,
                    productos: listProducts
                }
            )
        })
    })
})

app.get('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id
    Producto.findById(id)
    .populate('categoria', 'description')
    .populate('usuario', 'name email')
    .exec( (err, product) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err
            })
        }
        if (!product) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: "no existe el producto"
                }
            })
        }
        res.json({
            ok: true,
            producto: product
        })
    })
})

app.get('/productos/buscar/:nombre', verifyToken, (req, res) => {

    let nombre  =  req.params.nombre
    let regex = new RegExp(nombre, 'i')

    Producto.find({nombre: regex})
        .populate('usuario', 'name')
        .populate('categoria', 'description')
        .exec( (err, products) => {
            if (err) {
                return res.status(404).json({
                    ok: false,
                    err
                })
            }
            if (!products) {
                return res.status(500).json({
                    ok: false,
                    error: {
                        message: "no existen productos con dicha expresion"
                    }
                })
            }
            res.json({
                ok: true,
                productos: products
            })
        })
})

app.post('/productos', verifyToken, (req, res) => {

    let body = req.body
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        categoria: body.categoria,
        usuario: req.usuario._id
    })
    console.log(req.usuario._id);
    producto.save((err, newProduct) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        res.status(201).json({
            newProduct
        })
    })
})

app.put('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id
    let body = req.body

    Producto.findByIdAndUpdate(id, body, {new: true}, (err, prodUpd) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        if (!prodUpd) {
            return res.status(500).json({
                ok: false,
                error: {
                    message: "no existe el producto"
                }
            })
        }
        res.json({
            ok: true,
            producto:prodUpd
        })
    })
})

app.delete('/productos/:id', verifyToken, (req, res) => {
    let id = req.params.id

    Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, docRemo) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        if (!docRemo) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: "el producto no existe"
                }
            })
        }
        res.json({
            ok: true,
            producto: docRemo
        })
    })
})
module.exports =  app;