const mongoose = require("mongoose");
const Schema = mongoose.Schema();

//conexão
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/fortcampdb", {
    useNewUrlParser: true
}).then(() => {
    console.log("Deu bom!")
}).catch((error) => {
    console.log("Deu ruim: " + error)
})

//Model
var cad = new mongoose.Schema({

    date: {
        type: Date,
        default: Date.now()
    },
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    senha: {
        type: String,
        require: true
    }
})


var cadastro = mongoose.model('cadastro', cad)