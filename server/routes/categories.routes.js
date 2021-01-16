const express = require('express');
const app = express();
const Categoria = require('../models/category.model')

const { verifyToken, verifyRole } = require('../middlewares/users.middleware')


app.get('/categories', verifyToken, (req, res) => {

    Categoria.find({})
    .sort('description')
    .populate('user', 'name email')
    .exec((err, categoriesDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        // console.log(categoria.usuario)
        Categoria.countDocuments({}, (err, cont) => {
            res.json(
                {
                    contador: cont,
                    categorias: categoriesDb
                }
            )
        })
    })
})

app.get('/categories/:id', verifyToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, catFinded) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                error: {
                    message: "not found"
                }
            })
        }
        if (!catFinded) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "categoria no encontrada"
                }
            })
        }
        res.json({
            ok: true,
            categoria: catFinded
        })
    })
})

app.post('/categories', verifyToken, (req, res) => {
    let body = req.body
    let categoria = new Categoria({
        description: body.description,
        user: req.usuario._id
    })
    categoria.save((err, categoriaDb) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                error: err
            })
        }
        //si no se logra crear la categoria
        if(!categoriaDb) {
            return res.status(400).json({
                ok: false,
                eror: err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDb 
        })
    })

})

app.put('/categories/:id', verifyToken, (req, res) => {
    let body = req.body
    let id = req.params.id;

    Categoria.findByIdAndUpdate(id, {description: body.description}, {new: true, runValidators: true}, (err, descrDbObj) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                error: err
            })
        }
        if (!descrDbObj) {
            return res.status(401).json({
                ok:false,
                err: {
                    message: "no existe esa categoria"
                }
            })
        }
        res.json({
            descrDbObj
        })
    })
})

app.delete('/categories/:id', [verifyToken, verifyRole], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(404).json({
                ok: false,
                err: "not found"
            })
        }
        res.json({
            ok: true,
            categoria: categoryDeleted
        })
    })
})

module.exports = app;