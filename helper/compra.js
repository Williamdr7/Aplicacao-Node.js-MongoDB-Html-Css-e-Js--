module.exports = {
    compra: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "Você deve estar logado para comprar o ingresso")
        res.redirect("/home")
    }
}