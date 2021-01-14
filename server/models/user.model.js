const moongose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validRoles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = moongose.Schema;

let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is neccesary!']
    },
    password: {
        type: String,
        required: [true, 'Password required!']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type:Boolean,
        default: true
    },
    google: {
        type:Boolean,
        default: false
    }
})

//para no regresar la contraseña en a respuesta
userSchema.methods.toJSON = function () { //se sobrescribe el metodo toJSON que el es el que mongoose usa para imprimir un objeto
    let user = this;
    let userObject = user.toObject();
    delete(userObject.password);
    return userObject

}

userSchema.plugin(uniqueValidator)

module.exports = moongose.model('Usuario', userSchema)