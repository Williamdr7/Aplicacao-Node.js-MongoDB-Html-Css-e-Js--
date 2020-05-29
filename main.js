//REQUISIÇÕES//
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Schema = mongoose.Schema();
const bcrypt = require("bcryptjs");
const flash = require('connect-flash');
const session = require("express-session")

//Banco
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/fortcampdb", {
    useNewUrlParser: true
}).then(() => {
    console.log("Deu bom!")
}).catch((error) => {
    console.log("Deu ruim: " + error)
})
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
    password: {
        type: String,
        require: true
    }
})


var cadastro = mongoose.model('cadastro', cad)
    //Configurações
app.engine("handlebars", handlebars({ defaultLayout: "main" }))
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(session({
    secret: "sitecamp",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next();
})

//Rotas
app.use((req, res, next) => {
    next();
})
app.get("/", (req, res) => {
    res.render('principal')
})
app.get('/cadastro', (req, res, next) => {
    res.render('formulario')
})

app.post("/cadastro", (req, res) => {

    var erros = [];
    if (!req.body.nome || req.body.nome == null) {
        erros.push({ texto: "Nome Inválido" })
    }
    if (!req.body.email || req.body.nome == null) {
        erros.push({ texto: "Email Inválido" })
    }
    if (!req.body.senha || req.body.senha == null) {
        erros.push({ texto: "Senha Inválida" })
    }
    if (req.body.senha != req.body.senha2 && typeof req.body.senha != undefined && req.body.senha != null) {
        erros.push({ texto: "Senhas diferentes" })
    }
    if (req.body.senha.length <= 4 && req.body.senha.length > 0) {
        erros.push({ texto: "Senha Muito Curta" })
    }
    if (erros.length > 0) {
        res.render('formulario', { erros: erros })
    } else {
        cadastro.findOne({ email: req.body.email }).then((usuario) => {
            if (usuario) {
                req.flash("error_msg", "Esse email ja está cadastrado em nosso sistema, tente outro email")
                res.render("formulario")
            } else {
                var novoUsuario = new cadastro({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
            }


            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(req.body.senha, salt, (error, hash) => {
                    if (error) {
                        req.flash("error_msg", "Houve um erro ao salvar o Usuário")
                        res.redirect("/cadastro")
                    }
                    req.body.senha = hash;

                    novoUsuario.save().then(() => {
                        req.flash('success_msg', "Usuário criado com sucesso")
                        res.redirect("/login");

                    }).catch((error) => {
                        req.flash("error_msg", "Houve um erro ao criar o Usuário, tente novamente")
                        res.redirect("/");
                    })
                })
            })

        })
    }
})




app.get("/butao", (req, res) => {
    res.render('camp')
})


app.get("/login", (req, res) => {
    res.render("login")
})
app.listen(8089);