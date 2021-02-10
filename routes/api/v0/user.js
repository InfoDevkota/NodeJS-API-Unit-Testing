const express = require('express');

const userAuth = require('../../../auth/v0/userAuth');

const userController = require('../../../controllers/v0/user/user');

const router = express.Router();

router.post("/signup", userController.postUserSignup);
router.post("/login", userController.postLogin);
router.get("/me", userAuth, userController.getMe);
router.get("/user/:userId", userController.getUserById);

module.exports = router;