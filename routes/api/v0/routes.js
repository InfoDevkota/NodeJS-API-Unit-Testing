const express = require('express');

const router = express.Router();

router.get("/", (req, res, next) =>{
    res
    .status(200)
    .json({
        message: "V0 routes home"
    })
});

module.exports = router;