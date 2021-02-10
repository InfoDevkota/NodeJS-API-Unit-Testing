const express = require('express');

const userRoutes = require('./user');

const router = express.Router();

router.use("/users", userRoutes);

router.get("/", (req, res, next) =>{
    res
    .status(200)
    .json({
        message: "V0 routes home"
    })
});

module.exports = router;