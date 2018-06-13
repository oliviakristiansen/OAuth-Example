var github = require("./github");
var local = require("./local");
var models = require("../models");

module.exports = function (passport) {
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function (user, done) {
        console.log("============== serializing user: ");
        done(null, user.user_id);
    });

    passport.deserializeUser(function (id, done) {
        console.log("============== Deserializing user: ");
        models.User.find({
                where: {
                    user_id: id
                }
            })
            .then(user => {
                done(null, user);
            })
            .catch(err => done(err, null));
    });

    // Setting up Passport Strategies for Facebook and Local
    facebook(passport);
    github(passport);
    local(passport);
};