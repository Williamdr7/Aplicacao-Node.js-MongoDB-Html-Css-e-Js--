const localStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")

//model
require("../models/cadastro");
const usuario = mongoose.model("cadastro")


module.exports = function(passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, senha, done) => {
        usuario.findOne({ email: email }, (erro, user) => {
            if (erro) {
                return done(null, false, { message: "Essa conta não existe" });
            }
            if (user) {
                bcrypt.compare(senha, , (erro, res) => {
                    if (res) {
                        return done(null, user)
                    }
                    if (erro) {
                        return done(null, false, { message: "Senha incorreta" })
                    }

                });
            }
        })
    }))



    passport.serializeUser((user, done) => {
        done(null, user.id)
    })
    passport.deserializeUser((id, done) => {
        user.findById(id, (err, user) => {
            done(err, user)
        })
    })
}