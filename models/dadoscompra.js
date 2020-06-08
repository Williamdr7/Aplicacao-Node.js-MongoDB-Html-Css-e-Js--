const mongoose = require("mongoose");
const Schema = mongoose.Schema();

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/fortcampdb", {
    useNewUrlParser: true
}).then(() => {
    console.log("Deu bom!")
}).catch((error) => {
    console.log("Deu ruim: " + error)
})

var dadoscompra = new mongoose.Schema({
    email: {
        type: String,
        require: true
    },
    nick: {
        type: String,
        require: true
    },
    nickduo: {
        type: String,
        require: true
    },
    emailpaypal: {
        type: String
    }
})

var dadoscompra = mongoose.model('dadoscompra', dadoscompra)