const jwt = require('jsonwebtoken')

//=======================
// verifica un token
//=======================

let verifyToken = (req, res, next) => {
    
    let token = req.get('token');
    console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            console.log(err);
        }
        req.usuario = decoded.usuario // crea la propiedad usuario en el objeto req con los valores del json decodificado
        next();
    })
}

//=======================
// verifica admin role
//=======================

let verifyRole = (req, res, next) => {
    if (req.usuario.role === 'ADMIN_ROLE') {
        console.log('es admin');
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: "el usuario no es un administrador"
            }
        })
    }
}
module.exports = { verifyToken, verifyRole };