const express = require('express');

const V0Routes = require("./v0/routes")

const router = express.Router();

router.use("/v0", V0Routes);

module.exports = router;