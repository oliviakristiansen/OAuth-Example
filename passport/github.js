var GithubStrategy = require("passport-github").Strategy;
var models = require("../models");
var ghConfig = require("../gh.js");
const passport = require("passport");

passport.use(
    "github",
    new GithubStrategy({
            clientID: "718347dd54bed581aaa9",
            clientSecret: "dab2411cc367ef8437ae3e51f10389afae00f495",
            callbackURL: "http://localhost:3000/login/github/callback"
        },

        // github will send back the tokens and profile
        function (access_token, refresh_token, profile, done) {
            models.users.findOne({
                    where: {
                        authId: profile.id
                    }
                })
                .then(user => {
                    if (!user) {
                        let newUser = models.users.create({
                            authId: profile.id,
                            name: profile.displayName,
                            role: "user"
                        });
                        done(null, newUser);
                    }
                    done(null, user);
                })
                .catch(err => {
                    console.log(err);
                    return done(err, null);
                });
        }
    )
);