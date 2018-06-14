const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const models = require("../models/index");

module.exports = {
    signUser: function (user) {
        const token = jwt.sign({
                Username: user.Username,
                UserId: user.UserId
            },
            "secret", {
                expiresIn: "1h"
            }
        );
        return token;
    },

    verifyUser: function (req, res, next) {
        try {
            console.log('AUTH GET')
            // console.log(req)
            let token = req.cookies.jwt;
            const decoded = jwt.verify(token, "secret");
            req.userData = decoded;
            models.users.findOne({
                where: {
                    UserId: decoded.UserId
                }
            }).then(user => {
                console.log(user.UserId)
                req.user = user;
                next();
            })
        } catch (err) {
            console.log(err)
            return res.status(401).json({
                message: "Auth Failed"
            });
        }
    },

    hashPassword: function (plainTextPassword) {
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(plainTextPassword, salt);
        return hash;

    }
};