const express = require("express");
const router = express.Router();

router.get("/g", (req, res) => {
    res.render("principal")
})

module.exports = router;