//=========================
//          PORT
//=========================
process.env.PORT = process.env.PORT || 3000

//=========================
//    CADUCIDAD TOKEN
//=========================
process.env.TOKEN_C = 60 * 60 * 24 * 30

//=========================
//         SEED
//=========================
process.env.SEED = process.env.SEED || 'seed-de-desarrollo'

//=========================
//          ENTORNO
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = process.env.MONGO_URI
}

process.env.URLDB = urlDb