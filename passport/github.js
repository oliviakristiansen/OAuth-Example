var GithubStrategy = require("passport-github").Strategy;
var models = require("../models");
const passport = require("passport");

passport.use(
    "github",
    new GithubStrategy({
            clientID: "05ce3837da0c65abca8f",
            clientSecret: "73d68298bc94860b2ba0487751686ea0e130b0ec",
            callbackURL: "http://localhost:3000/users/login/github/callback"
        },

        // github will send back the tokens and profile
        function (access_token, refresh_token, profile, done) {
            models.users.findOne({
                where: {
                    AuthId: profile.id
                }
            }).then(user => {
                // console.log(user)
                // need to do the following three lines because github has only one field for name, not two for FirstName and LastName so we need to split on the space in the name. If the last name is something like 'de souza' then the spread will join the LastName into one string. 
                let name = profile.displayName;
                let [firstName, ...lastName] = name.split(" ");
                lastName = lastName.join(" ");
                if (!user) {
                    return models.users.create({
                        AuthId: profile.id,
                        FirstName: firstName,
                        LastName: lastName
                    }).then(user => {
                        done(null, user);
                    });
                } else {
                    done(null, user);
                }

            }).catch(err => {
                if (err) {
                    console.log('error');
                    return done(err);
                }
            })

        }
    )
);