var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../app/models/user');
var configAuth = require('./auth');

module.exports = function (passport) {

    // passport session setup ==================================================
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    });

    // LOCAL SIGNUP ============================================================
    passport.use('local-signup', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            process.nextTick(function () {

                User.findOne({'local.email': email}, function (err, user) {

                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {
                        var newUser = new User();
                        newUser.local.email = email;
                        newUser.local.password = newUser.generateHash(password);
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });

            });

        }));

    // LOCAL LOGIN =============================================================
    passport.use('local-login', new LocalStrategy({

            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {

            User.findOne({'local.email': email}, function (err, user) {

                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));
                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
                return done(null, user);
            });

        }));

    // FACEBOOK ================================================================
    passport.use(new FacebookStrategy({

            clientID: configAuth.facebookAuth.clientID,
            clientSecret: configAuth.facebookAuth.clientSecret,
            callbackURL: configAuth.facebookAuth.callbackURL,
            profileFields: ["emails", "displayName", "gender"]
        },

        // facebook will send back the token and profile
        function (token, refreshToken, profile, done) {
            console.log(profile)
            process.nextTick(function () {

                User.findOne({'facebook.id': profile.id}, function (err, user) {

                    if (err)
                        return done(err);
                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser = new User();
                        newUser.facebook.id = profile.id;
                        newUser.facebook.token = token;
                        newUser.facebook.name = profile.displayName;
                        newUser.facebook.email = profile.emails[0].value;
                        newUser.save(function (err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }

                });
            });

        }));

    // GOOGLE ==================================================================
    passport.use(new GoogleStrategy({

            clientID        : configAuth.googleAuth.clientID,
            clientSecret    : configAuth.googleAuth.clientSecret,
            callbackURL     : configAuth.googleAuth.callbackURL

        },
        function(token, refreshToken, profile, done) {

            process.nextTick(function() {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, user);
                    } else {
                        var newUser          = new User();
                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.google.name  = profile.displayName;
                        newUser.google.email = profile.emails[0].value;

                        // save the user
                        newUser.save(function(err) {
                            if (err)
                                throw err;
                            return done(null, newUser);
                        });
                    }
                });
            });

        }));

};

