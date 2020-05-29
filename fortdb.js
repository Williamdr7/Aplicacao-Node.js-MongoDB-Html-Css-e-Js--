const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/fortcampdb", {useNewUrlParser: true}).then(() => {
    console.log("Deu bom!")
}).catch((error) => {
    console.log("Deu ruim: " + error)
})
const cad = new mongoose.Schema({
    nome: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    }
})

var cadastro = mongoose.model('cadastro', cad)
