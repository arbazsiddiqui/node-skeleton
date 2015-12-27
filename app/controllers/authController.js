var isLoggedIn = require('../middlewares/isLoggedIn');

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
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    //GOOGLE-AUTH
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));

    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function (req, res) {
        res.render('profile.ejs', {
            user: req.user
        });
    });

    // LOGOUT
    app.get('/logout', function (req, res) {
        req.logout();
        res.redirect('/');
    });
};

