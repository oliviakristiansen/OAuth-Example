var LocalStrategy = require("passport-local").Strategy;
var models = require("../models");

module.exports = function (passport) {
    passport.use(
        "local",
        new LocalStrategy(function (username, password, cb) {
            models.users.findByUsername(username, function (err, user) {
                if (err) {
                    return cb(err);
                }
                if (!user) {
                    return cb(null, false);
                }
                if (user.password != password) {
                    return cb(null, false);
                }
                return cb(null, user);
            });
        })
    );
};