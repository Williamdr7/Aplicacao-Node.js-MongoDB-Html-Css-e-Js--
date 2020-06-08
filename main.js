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
const passport = require("passport")
require("./models/cadastro")
require("./models/dadoscompra")
const cadastro = mongoose.model("cadastro")
const dadoscompra = mongoose.model('dadoscompra')
const localStrategy = require("passport-local").Strategy;
const { compra } = require("./helper/compra")



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
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next();
})

//Rotas
app.use((req, res, next) => {
    next();
})
app.get("/home", (req, res) => {
    res.render('principal')
})
app.get('/cadastro', (req, res, ) => {
    res.render('formulario')
})
app.get("/cad", (req, res) => {
    res.render('formulario')
})

app.post("/cadastro", (req, res, next) => {

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
    cadastro.findOne({ email: req.body.email }, (erro, usuario) => {
        if (usuario) {
            erros.push({ texto: "Email ja cadastrado no nosso sistema, tente outro" })
        }
        if (erros.length > 0) {
            res.render('formulario', { erros: erros })
        } else {
            var novoUsuario = new cadastro({
                name: req.body.name,
                email: req.body.email,
                senha: req.body.senha
            })

            bcrypt.genSalt(10, (erro, salt) => {
                bcrypt.hash(novoUsuario.senha, salt, (error, hash) => {
                    if (error) {
                        req.flash("error_msg", "Houve um erro ao salvar o Usuário")
                        res.redirect("/cadastro")
                    }

                    novoUsuario.senha = hash;

                    novoUsuario.save().then(() => {
                        req.flash('success_msg', "Usuário criado com sucesso")
                        res.redirect("/login");

                    }).catch((error) => {
                        req.flash("error_msg", "Houve um erro ao criar o Usuário, tente novamente")
                        res.redirect("/home");
                    })

                })
            })
        }
    })
})
app.get("/camps", compra, (req, res) => {
    res.render('camp')
})
app.get("/compra", (req, res) => {
    res.render('compracamp1')
})
app.post("/compra", (req, res, next) => {
    var novosDados = new dadoscompra({
        email: req.body.email,
        nick: req.body.nick,
        nickduo: req.body.nickduo,
        emailpaypal: req.body.emailpaypal
    })
    novosDados.save().then(() => {
        console.log("salvo")
        res.redirect("/finalizarcompra")
    }).catch(() => {
        req.flash("error_msg", "Erro ao salvar")
    });
})
app.get("/finalizarcompra", (req, res, next) => {
    res.render("finalizarcompra")
})
app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/login", (req, res, next) => {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        cadastro.findOne({ email: email }).then((user) => {
            if (!user) {
                return done(null, false, { message: "Essa conta não existe" });
            }

            bcrypt.compare(senha, user.senha).then((res) => {
                if (res) {
                    return done(null, user)
                }
                if (!res) {
                    return done(null, false, { message: "Senha incorreta" })
                }

            });
        })
    }))



    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        cadastro.findById(id, (err, user) => {
            done(err, user)
        })
    })


    passport.authenticate("local", {
        successRedirect: "/home",
        failureRedirect: "/login",
        failureFlash: true
    })(req, res, next)
})




app.listen(8089);