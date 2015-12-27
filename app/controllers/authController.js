var isLoggedIn = require('../middlewares/isLoggedIn');
var authenticated_using = require('../helpers/authenticated_using')

module.exports = function (app, passport) {


    // HOME PAGE
    app.get('/', function (req, res) {
        res.render('home.ejs');
    });

    // LOCAL-LOGIN
    app.get('/login', function (req, res) {
        res.render('login.ejs', {message: req.flash('loginMessage')});
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect: '/todos',
        failureRedirect: '/login',
        failureFlash: true
    }));

    // LOCAL-SIGNUP
    app.get('/signup', function (req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', {message: req.flash('signupMessage')});
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/todos',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    //FACEBOOK AUTH
    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect : '/todos',
            failureRedirect : '/'
        }));

    //GOOGLE-AUTH
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/todos',
            failureRedirect : '/'
        }));

    // we will use route middleware to verify this (the isLoggedIn function)
    // and a helper to check which strategy was used to authenticate
    app.get('/profile', isLoggedIn, function (req, res) {
        auth_user = authenticated_using(req)
        res.render('profile.ejs', {
            user: auth_user
        });
    });

    // LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};