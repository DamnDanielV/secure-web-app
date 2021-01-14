//=========================
//          PORT
//=========================
process.env.PORT = process.env.PORT || 3000

//=========================
//          ENTORNO
//=========================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev'

if (process.env.NODE_ENV === 'dev') {
    urlDb = 'mongodb://localhost:27017/cafe';
} else {
    urlDb = 'mongodb+srv://daniel:gqiFXCY1iWMdtr2l@cluster0.bizfo.mongodb.net/test'
}

process.env.URLDB = urlDb