const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')

const User = require('../../../models/user');

module.exports.postUserSignup = (req, res, next) =>{
    
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let dateOfBirth = req.body.dateOfBirth;
    let country = req.body.country;
    let password = req.body.password;
    email = email.toLowerCase();

    User.findOne({
        email: email
    }).then(user =>{
        if(user){
            res
            .status(409)
            .json({
                message: "email already exist"
            })
        } else {
            bcrypt.hash(password, 12)
            .then(hashedPassword =>{
                let aUser = User({
                    firstName,
                    lastName,
                    email,
                    dateOfBirth,
                    country,
                    password: hashedPassword
                })
                return aUser.save();
            })
            .then(savedUser =>{
                res
                .status(201)
                .json({
                    message: "User created.",
                    user: savedUser
                })
            })
        }
    })
}

module.exports.postLogin = (req, res, next) =>{

    let email = req.body.email;
    let password = req.body.password;

    email = email.toLowerCase();

    User.findOne({
        email: email
    }).then(user =>{
        if(!user){
            res
            .status(401)
            .json({
                message: "Email or password incorrect"
            })
        } else {
            bcrypt.compare(password, user.password)
            .then(matched =>{
                if(!matched){
                    res
                    .status(401)
                    .json({
                        message: "Email or password incorrect"
                    })
                } else {
                    const token = jwt.sign(
                        {
                          email: user.email,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          userId: user._id,
                        },
                        process.env['SECRET_TOKEN']
                    );
                    res
                    .status(200)
                    .json({
                        message: "Login successed",
                        userId: user._id,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: token,
                    });
                }
            }).catch(error =>{
                console.log(error);
                
                res
                .status(500)
                .json({
                    message: "Something went wrong."
                })
            })
        }
    });
}

module.exports.getMe = (req, res, next) =>{
    
    User.findById(req.user._id)
    .then(user =>{
        res
        .status(201)
        .json({
            message: "Profile",
            user
        })
    })
}

module.exports.getUserById = (req, res, next) =>{
    let userId = req.params.userId

    User.findById(userId)
    .then(user =>{
        if(user){
            res
            .status(200)
            .json({
                message: "User Profile",
                user
            })
        } else {
            res
            .status(404)
            .json({
                message: "User Profile Not found"
            })
        }
    })
    .catch(error =>{
        res
        .status(400)
        .json({
            message: "Invalid Id provided."
        })
    })
}

